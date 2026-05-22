import { z } from "zod"

export const fieldTypeEnumSchema = z.enum([
    "TEXT", "LONG_TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD", 
    "SINGLE_SELECT", "MULTI_SELECT", "CHECKBOX", "DROPDOWN", "RATING", "DATE"
])

export const createFormFieldInputModel = z.object({
    userId: z.string().uuid(),
    formId: z.string().uuid(),
    label: z.string().min(1, "Please enter a question or label for this field.").max(100, "Please keep the question or label under 100 characters."),
    description: z.string().optional(),
    placeholder: z.string().optional(),
    options: z.any().optional(), 
    isRequired: z.boolean().default(false),
    type: fieldTypeEnumSchema,
})
export type createFormFieldInputModelType = z.infer<typeof createFormFieldInputModel>

export const updateFormFieldInputModel = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(), 
    label: z.string().min(1, "Please enter a question or label for this field.").max(100, "Please keep the question or label under 100 characters.").optional(),
    description: z.string().optional(),
    placeholder: z.string().optional(),
    options: z.any().optional(),
    isRequired: z.boolean().optional(),
    type: fieldTypeEnumSchema.optional(),
    index: z.string().optional(), 
})
export type updateFormFieldInputModelType = z.infer<typeof updateFormFieldInputModel>

export const deleteFormFieldInputModel = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(), // to verify ownership
})
export type deleteFormFieldInputModelType = z.infer<typeof deleteFormFieldInputModel>

export const listFormFieldsInputModel = z.object({
    formId: z.string().uuid(),
    userId: z.string().uuid(),
})
export type listFormFieldsInputModelType = z.infer<typeof listFormFieldsInputModel>

export const reorderFormFieldInputModel = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    newIndex: z.string()
})
export type reorderFormFieldInputModelType = z.infer<typeof reorderFormFieldInputModel>
