import { type createFormFieldInputModelType, createFormInputModel, listFormByUserIdInputModel, type listFormByUserIdInputModelType, updateFormInputModel, type updateFormInputModelType, deleteFormInputModel, type deleteFormInputModelType } from "./model"
import { db, eq, and } from "@repo/database"
import { formsTable } from "../../database/schema"


class FormService {

    public async createForm(payload: createFormFieldInputModelType) {

        const { userId, title, description } = await createFormInputModel.parseAsync(payload)

        const formInsert = await db.insert(formsTable).values({
            title,
            description,
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
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt
        }).from(formsTable)
            .where(eq(formsTable.createdBy, userId))


        return forms

    }

    public async updateForm(payload: updateFormInputModelType) {
        const { id, userId, title, description } = await updateFormInputModel.parseAsync(payload)

        const valuesToUpdate: any = {}
        if (title !== undefined) valuesToUpdate.title = title
        if (description !== undefined) valuesToUpdate.description = description
        
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

}

export default FormService;