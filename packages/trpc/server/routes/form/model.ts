import { email, z } from "zod"
import { formVisibilityEnumSchema, formStatusEnumSchema } from "../../../../services/form/model";

export const createFormInputModel = z.object({
    title: z.string().describe("Title of the form"),
    description: z.string().describe("Description of the form").optional(),
    slug: z.string().optional(),
    theme: z.string().optional(),
    visibility: formVisibilityEnumSchema.optional(),
    status: formStatusEnumSchema.optional(),
})
export const createFormOutputModel = z.object({

    formId: z.string().uuid().describe("Id of the form"),


})


export const listFormByUserIdOutputModel = z.object({
    id: z.string().uuid().describe("Id of the form"),
    title: z.string().describe("Title of the form"),
    description: z.string().nullable().describe("Description of the form"),
    slug: z.string().nullable().describe("Custom slug"),
    theme: z.string().nullable().describe("Theme of the form"),
    visibility: z.string().describe("Visibility status"),
    status: z.string().describe("Publish status"),
    createdAt: z.date().nullable().describe("Created at"),
    updatedAt: z.date().nullable().describe("Updated at")
})

export const updateFormInputModel = z.object({
    id: z.string().uuid().describe("Id of the form"),
    title: z.string().describe("Title of the form").optional(),
    description: z.string().describe("Description of the form").optional(),
    slug: z.string().optional(),
    theme: z.string().optional(),
    visibility: formVisibilityEnumSchema.optional(),
    status: formStatusEnumSchema.optional(),
})

export const updateFormOutputModel = z.object({
    formId: z.string().uuid().describe("Id of the form"),
})

export const deleteFormInputModel = z.object({
    id: z.string().uuid().describe("Id of the form"),
})

export const deleteFormOutputModel = z.object({
    formId: z.string().uuid().describe("Id of the form"),
})

export const getPublicFormInputModel = z.object({
    id: z.string().uuid()
})

export const getPublicFormOutputModel = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    theme: z.string().nullable(),
    status: z.string(),
    fields: z.array(z.any())
})

export const getFormByIdInputModel = z.object({
    id: z.string().uuid().describe("Id of the form"),
})

export const getFormByIdOutputModel = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    slug: z.string().nullable(),
    theme: z.string().nullable(),
    status: z.string(),
    visibility: z.string(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    fields: z.array(z.any())
})