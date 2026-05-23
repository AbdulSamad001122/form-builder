import { type createFormFieldInputModelType, createFormInputModel, listFormByUserIdInputModel, type listFormByUserIdInputModelType, updateFormInputModel, type updateFormInputModelType, deleteFormInputModel, type deleteFormInputModelType, getFormByIdInputModel, type getFormByIdInputModelType } from "./model"
import { db, eq, and, asc, desc, ilike } from "@repo/database"
import { formsTable, formFieldsTable, formResponsesTable, usersTable } from "../../database/schema"
import { randomBytes, createHmac } from "node:crypto"
import * as JWT from "jsonwebtoken"
import { env } from "../env"

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
            throw new Error("An unexpected error occurred while creating your form. Please try again.")
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
            updatedAt: formsTable.updatedAt,
            isPasswordProtected: formsTable.isPasswordProtected,
            isArchived: formsTable.isArchived
        }).from(formsTable)
            .where(and(eq(formsTable.createdBy, userId), eq(formsTable.isArchived, false)))

        return forms
    }

    public async listArchivedForms(payload: listFormByUserIdInputModelType) {
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
            updatedAt: formsTable.updatedAt,
            isPasswordProtected: formsTable.isPasswordProtected,
            isArchived: formsTable.isArchived
        }).from(formsTable)
            .where(and(eq(formsTable.createdBy, userId), eq(formsTable.isArchived, true)))

        return forms
    }

    public async updateForm(payload: updateFormInputModelType) {
        const { id, userId, title, description, slug, theme, visibility, status, isPasswordProtected, password, isArchived } = await updateFormInputModel.parseAsync(payload)

        const valuesToUpdate: any = {}
        if (title !== undefined) valuesToUpdate.title = title
        if (description !== undefined) valuesToUpdate.description = description
        if (slug !== undefined) valuesToUpdate.slug = slug
        if (theme !== undefined) valuesToUpdate.theme = theme
        if (visibility !== undefined) valuesToUpdate.visibility = visibility
        if (status !== undefined) valuesToUpdate.status = status

        if (isPasswordProtected !== undefined) {
            valuesToUpdate.isPasswordProtected = isPasswordProtected
            if (!isPasswordProtected) {
                valuesToUpdate.passwordHash = null
                valuesToUpdate.passwordSalt = null
            }
        }

        if (password !== undefined && password !== "") {
            const salt = randomBytes(16).toString("hex")
            const hash = createHmac("sha256", salt).update(password).digest("hex")
            valuesToUpdate.passwordHash = hash
            valuesToUpdate.passwordSalt = salt
            valuesToUpdate.isPasswordProtected = true
        }

        if (isArchived !== undefined) {
            valuesToUpdate.isArchived = isArchived
        }

        valuesToUpdate.updatedAt = new Date()

        const formUpdate = await db.update(formsTable)
            .set(valuesToUpdate)
            .where(and(eq(formsTable.id, id), eq(formsTable.createdBy, userId)))
            .returning({ id: formsTable.id })

        if (!formUpdate || formUpdate.length === 0 || !formUpdate[0]?.id) {
            throw new Error("This form could not be found, or you do not have permission to update it.")
        }

        return { id: formUpdate[0].id }
    }

    public async deleteForm(payload: deleteFormInputModelType) {
        const { id, userId } = await deleteFormInputModel.parseAsync(payload)

        const formDelete = await db.delete(formsTable)
            .where(and(eq(formsTable.id, id), eq(formsTable.createdBy, userId)))
            .returning({ id: formsTable.id })

        if (!formDelete || formDelete.length === 0 || !formDelete[0]?.id) {
            throw new Error("This form could not be found, or you do not have permission to delete it.")
        }

        return { id: formDelete[0].id }
    }

    public async getPublicForm(id: string, accessToken?: string) {
        const form = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.description,
            theme: formsTable.theme,
            status: formsTable.status,
            isPasswordProtected: formsTable.isPasswordProtected,
            passwordHash: formsTable.passwordHash,
            passwordSalt: formsTable.passwordSalt
        }).from(formsTable)
            .where(eq(formsTable.id, id))
            .limit(1)

        if (!form || form.length === 0 || !form[0]) {
            throw new Error("We could not find the form you are looking for.")
        }

        if (form[0].status !== "PUBLISHED") {
            throw new Error("This form is a draft and is not accepting responses yet.")
        }

        const formDetails = form[0]

        if (formDetails.isPasswordProtected) {
            let isAuthorized = false
            if (accessToken) {
                try {
                    const decoded = JWT.verify(accessToken, env.JWT_SECRET) as { formId: string; verified: boolean }
                    if (decoded.formId === id && decoded.verified === true) {
                        isAuthorized = true
                    }
                } catch {
                    isAuthorized = false
                }
            }

            if (!isAuthorized) {
                return {
                    id: formDetails.id,
                    title: formDetails.title,
                    description: formDetails.description,
                    theme: formDetails.theme,
                    status: formDetails.status,
                    isPasswordProtected: true,
                    fields: []
                }
            }
        }

        const fields = await db.select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, id))
            .orderBy(asc(formFieldsTable.index))

        return {
            id: formDetails.id,
            title: formDetails.title,
            description: formDetails.description,
            theme: formDetails.theme,
            status: formDetails.status,
            isPasswordProtected: formDetails.isPasswordProtected,
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
            isPasswordProtected: formsTable.isPasswordProtected,
            isArchived: formsTable.isArchived
        }).from(formsTable)
            .where(and(eq(formsTable.id, id), eq(formsTable.createdBy, userId)))
            .limit(1)

        if (!form || form.length === 0 || !form[0]) {
            throw new Error("This form could not be found, or you do not have permission to view it.")
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

    public async listExploreForms(payload: { search?: string }) {
        const { search } = payload

        const conditions = [
            eq(formsTable.status, "PUBLISHED"),
            eq(formsTable.visibility, "PUBLIC"),
        ]

        if (search && search.trim().length > 0) {
            conditions.push(ilike(formsTable.title, `%${search.trim()}%`))
        }

        const forms = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                theme: formsTable.theme,
                status: formsTable.status,
                visibility: formsTable.visibility,
                createdAt: formsTable.createdAt,
                creatorName: usersTable.fullName,
                creatorEmail: usersTable.email,
            })
            .from(formsTable)
            .leftJoin(usersTable, eq(formsTable.createdBy, usersTable.id))
            .where(and(...conditions))
            .orderBy(desc(formsTable.createdAt))

        return forms
    }

    public async verifyFormPassword(payload: { formId: string; password: string }) {
        const [form] = await db.select({
            id: formsTable.id,
            isPasswordProtected: formsTable.isPasswordProtected,
            passwordHash: formsTable.passwordHash,
            passwordSalt: formsTable.passwordSalt
        }).from(formsTable)
            .where(eq(formsTable.id, payload.formId))
            .limit(1)

        if (!form || !form.isPasswordProtected || !form.passwordSalt || !form.passwordHash) {
            throw new Error("This form is not password protected.")
        }

        const hash = createHmac("sha256", form.passwordSalt).update(payload.password).digest("hex")
        if (hash !== form.passwordHash) {
            throw new Error("The password you entered is incorrect. Please try again.")
        }

        const token = JWT.sign({ formId: form.id, verified: true }, env.JWT_SECRET, { expiresIn: "2h" })
        return { token }
    }
}

export default FormService;