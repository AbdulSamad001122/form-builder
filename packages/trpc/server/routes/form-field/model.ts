import { z } from "zod"
import { fieldTypeEnumSchema } from "../../../../services/form-field/model"

export const createFormFieldInputModel = z.object({
    formId: z.string().uuid(),
    label: z.string().min(1, "Label is required").max(100),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    options: z.any().nullable().optional(),
    conditionalRules: z.any().nullable().optional(),
    isRequired: z.boolean().default(false),
    type: fieldTypeEnumSchema,
})

export const updateFormFieldInputModel = z.object({
    id: z.string().uuid(),
    label: z.string().min(1).max(100).optional(),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    options: z.any().nullable().optional(),
    conditionalRules: z.any().nullable().optional(),
    isRequired: z.boolean().optional(),
    type: fieldTypeEnumSchema.optional(),
    index: z.string().optional(),
})

export const deleteFormFieldInputModel = z.object({
    id: z.string().uuid(),
})

export const listFormFieldsInputModel = z.object({
    formId: z.string().uuid(),
})

export const reorderFormFieldInputModel = z.object({
    id: z.string().uuid(),
    newIndex: z.string()
})

export const listFormFieldsOutputModel = z.object({
    id: z.string().uuid(),
    formId: z.string().uuid().nullable(),
    label: z.string(),
    labelKey: z.string(),
    description: z.string().nullable(),
    placeholder: z.string().nullable(),
    options: z.any().nullable(),
    conditionalRules: z.any().nullable().optional(),
    isRequired: z.boolean(),
    type: z.string(),
    index: z.string()
})

export const formFieldActionOutputModel = z.object({
    id: z.string().uuid(),
})
