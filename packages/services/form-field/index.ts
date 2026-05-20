import { db, eq, and, asc } from "@repo/database"
import { formsTable, formFieldsTable } from "../../database/schema"
import { 
    createFormFieldInputModel, type createFormFieldInputModelType,
    updateFormFieldInputModel, type updateFormFieldInputModelType,
    deleteFormFieldInputModel, type deleteFormFieldInputModelType,
    listFormFieldsInputModel, type listFormFieldsInputModelType,
    reorderFormFieldInputModel, type reorderFormFieldInputModelType,
} from "./model"

const generateLabelKey = (label: string) => {
    return label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '')
}

class FormFieldService {
    
    private async verifyFormOwnership(formId: string, userId: string) {
        const form = await db.select({ id: formsTable.id }).from(formsTable).where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)))
        if (!form || form.length === 0) {
            throw new Error("Form not found or you don't have permission")
        }
    }

    private async verifyFieldOwnership(fieldId: string, userId: string) {
        const field = await db.select({ id: formFieldsTable.id, formId: formFieldsTable.formId })
            .from(formFieldsTable)
            .innerJoin(formsTable, eq(formFieldsTable.formId, formsTable.id))
            .where(and(eq(formFieldsTable.id, fieldId), eq(formsTable.createdBy, userId)))
            
        if (!field || field.length === 0) {
            throw new Error("Field not found or you don't have permission")
        }
        return field[0]
    }

    public async createFormField(payload: createFormFieldInputModelType) {
        const { userId, formId, label, description, placeholder, options, isRequired, type } = await createFormFieldInputModel.parseAsync(payload)
        
        await this.verifyFormOwnership(formId, userId)

        let labelKey = generateLabelKey(label)
        if (!labelKey) labelKey = "field_" + Math.random().toString(36).substring(7)
        
        const existingFields = await db.select({ index: formFieldsTable.index })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            
        let newIndex = "1000.00"
        if (existingFields.length > 0) {
            const maxIndex = Math.max(...existingFields.map(f => parseFloat(f.index || "0")))
            newIndex = (maxIndex + 1000).toFixed(2)
        }

        const insert = await db.insert(formFieldsTable).values({
            formId,
            label,
            labelKey,
            description,
            placeholder,
            options,
            isRequired,
            type,
            index: newIndex
        }).returning()

        if (!insert || insert.length === 0) {
            throw new Error("Failed to create form field")
        }

        return insert[0]!
    }

    public async updateFormField(payload: updateFormFieldInputModelType) {
        const { id, userId, label, description, placeholder, options, isRequired, type, index } = await updateFormFieldInputModel.parseAsync(payload)
        
        await this.verifyFieldOwnership(id, userId)

        const valuesToUpdate: any = {}
        if (label !== undefined) valuesToUpdate.label = label
        if (description !== undefined) valuesToUpdate.description = description
        if (placeholder !== undefined) valuesToUpdate.placeholder = placeholder
        if (options !== undefined) valuesToUpdate.options = options
        if (isRequired !== undefined) valuesToUpdate.isRequired = isRequired
        if (type !== undefined) valuesToUpdate.type = type
        if (index !== undefined) valuesToUpdate.index = index

        const update = await db.update(formFieldsTable)
            .set(valuesToUpdate)
            .where(eq(formFieldsTable.id, id))
            .returning()

        if (!update || update.length === 0) {
            throw new Error("Failed to update form field")
        }

        return update[0]!
    }

    public async deleteFormField(payload: deleteFormFieldInputModelType) {
        const { id, userId } = await deleteFormFieldInputModel.parseAsync(payload)
        
        await this.verifyFieldOwnership(id, userId)

        const deleted = await db.delete(formFieldsTable)
            .where(eq(formFieldsTable.id, id))
            .returning()

        if (!deleted || deleted.length === 0) {
            throw new Error("Failed to delete form field")
        }

        return deleted[0]!
    }

    public async reorderFormField(payload: reorderFormFieldInputModelType) {
        const { id, userId, newIndex } = await reorderFormFieldInputModel.parseAsync(payload)
        
        await this.verifyFieldOwnership(id, userId)

        const update = await db.update(formFieldsTable)
            .set({ index: newIndex })
            .where(eq(formFieldsTable.id, id))
            .returning()

        if (!update || update.length === 0) {
            throw new Error("Failed to reorder form field")
        }

        return update[0]!
    }

    public async listFormFields(payload: listFormFieldsInputModelType) {
        const { formId, userId } = await listFormFieldsInputModel.parseAsync(payload)
        
        await this.verifyFormOwnership(formId, userId)

        return await db.select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(asc(formFieldsTable.index))
    }
}

export default FormFieldService
