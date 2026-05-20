import { type createFormFieldInputModelType, createFormInputModel, listFormByUserIdInputModel, type listFormByUserIdInputModelType, updateFormInputModel, type updateFormInputModelType, deleteFormInputModel, type deleteFormInputModelType, getFormByIdInputModel, type getFormByIdInputModelType } from "./model"
import { db, eq, and, asc, desc } from "@repo/database"
import { formsTable, formFieldsTable, formResponsesTable } from "../../database/schema"

class FormService {

    public async createForm(payload: createFormFieldInputModelType) {

        const { userId, title, description, slug, theme, visibility, status } = await createFormInputModel.parseAsync(payload)

        const formInsert = await db.insert(formsTable).values({
            title,
            description: description || null,
            slug: slug || null,
            theme: theme || null,
            visibility: visibility || "UNLISTED",
            status: status || "DRAFT",
            createdBy: userId
        }).returning({
            id: formsTable.id
        })


        if (!formInsert || formInsert.length === 0 || !formInsert[0]?.id) {
            throw new Error("Something went wrong while creating form")
        }

        return {
            id: formInsert[0].id

        }


    }

    public async listFormById(payload: listFormByUserIdInputModelType) {

        const { userId } = await listFormByUserIdInputModel.parseAsync(payload)


        const forms = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.description,
            slug: formsTable.slug,
            theme: formsTable.theme,
            visibility: formsTable.visibility,
            status: formsTable.status,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt
        }).from(formsTable)
            .where(eq(formsTable.createdBy, userId))


        return forms

    }

    public async updateForm(payload: updateFormInputModelType) {
        const { id, userId, title, description, slug, theme, visibility, status } = await updateFormInputModel.parseAsync(payload)

        const valuesToUpdate: any = {}
        if (title !== undefined) valuesToUpdate.title = title
        if (description !== undefined) valuesToUpdate.description = description
        if (slug !== undefined) valuesToUpdate.slug = slug
        if (theme !== undefined) valuesToUpdate.theme = theme
        if (visibility !== undefined) valuesToUpdate.visibility = visibility
        if (status !== undefined) valuesToUpdate.status = status

        valuesToUpdate.updatedAt = new Date()

        const formUpdate = await db.update(formsTable)
            .set(valuesToUpdate)
            .where(and(eq(formsTable.id, id), eq(formsTable.createdBy, userId)))
            .returning({ id: formsTable.id })

        if (!formUpdate || formUpdate.length === 0 || !formUpdate[0]?.id) {
            throw new Error("Form not found or you don't have permission to update it")
        }

        return { id: formUpdate[0].id }
    }

    public async deleteForm(payload: deleteFormInputModelType) {
        const { id, userId } = await deleteFormInputModel.parseAsync(payload)

        const formDelete = await db.delete(formsTable)
            .where(and(eq(formsTable.id, id), eq(formsTable.createdBy, userId)))
            .returning({ id: formsTable.id })

        if (!formDelete || formDelete.length === 0 || !formDelete[0]?.id) {
            throw new Error("Form not found or you don't have permission to delete it")
        }

        return { id: formDelete[0].id }
    }

    public async getPublicForm(id: string) {
        const form = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.description,
            theme: formsTable.theme,
            status: formsTable.status
        }).from(formsTable)
            .where(eq(formsTable.id, id))
            .limit(1)

        if (!form || form.length === 0 || !form[0]) {
            throw new Error("Form not found")
        }

        if (form[0].status !== "PUBLISHED") {
            throw new Error("This form is not currently accepting responses.")
        }

        const fields = await db.select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, id))
            .orderBy(asc(formFieldsTable.index))

        return {
            ...form[0],
            fields
        }
    }
    public async getFormById(payload: getFormByIdInputModelType) {
        const { id, userId } = await getFormByIdInputModel.parseAsync(payload)

        const form = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.description,
            slug: formsTable.slug,
            theme: formsTable.theme,
            status: formsTable.status,
            visibility: formsTable.visibility,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt,
        }).from(formsTable)
            .where(and(eq(formsTable.id, id), eq(formsTable.createdBy, userId)))
            .limit(1)

        if (!form || form.length === 0 || !form[0]) {
            throw new Error("Form not found or unauthorized")
        }

        const fields = await db.select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, id))
            .orderBy(asc(formFieldsTable.index))

        return { ...form[0], fields }
    }

    public async getDashboardStats(payload: { userId: string }) {
        const { userId } = payload

        const forms = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.description,
            slug: formsTable.slug,
            theme: formsTable.theme,
            visibility: formsTable.visibility,
            status: formsTable.status,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt
        }).from(formsTable)
            .where(eq(formsTable.createdBy, userId))

        let submissions: any[] = []
        if (forms.length > 0) {
            submissions = await db.select({
                id: formResponsesTable.id,
                formId: formResponsesTable.formId,
                respondentEmail: formResponsesTable.respondentEmail,
                submittedAt: formResponsesTable.submittedAt,
                formTitle: formsTable.title,
            })
            .from(formResponsesTable)
            .innerJoin(formsTable, eq(formResponsesTable.formId, formsTable.id))
            .where(eq(formsTable.createdBy, userId))
            .orderBy(desc(formResponsesTable.submittedAt))
        }

        const totalForms = forms.length
        const totalSubmissions = submissions.length
        const totalPublished = forms.filter(f => f.status === 'PUBLISHED').length
        const totalDrafts = forms.filter(f => f.status === 'DRAFT').length

        const trendMap = new Map<string, number>()
        
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dateStr = d.toISOString().split('T')[0]!
            trendMap.set(dateStr, 0)
        }

        for (const sub of submissions) {
            const dateStr = new Date(sub.submittedAt).toISOString().split('T')[0]!
            trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + 1)
        }

        const submissionsTrend = Array.from(trendMap.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date))

        const recentSubmissions = submissions.slice(0, 5)

        return {
            totalForms,
            totalSubmissions,
            totalPublished,
            totalDrafts,
            recentSubmissions,
            submissionsTrend,
        }
    }
}

export default FormService;