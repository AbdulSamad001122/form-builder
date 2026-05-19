import { email, z } from "zod"

export const createFormInputModel = z.object({
    title: z.string().describe("Title of the form"),
    description: z.string().describe("Description of the form").optional(),
})
export const createFormOutputModel = z.object({

    formId: z.string().uuid().describe("Id of the form"),


})


export const listFormByUserIdOutputModel = z.object({
    id: z.string().uuid().describe("Id of the form"),
    title: z.string().describe("Title of the form"),
    description: z.string().nullable().describe("Description of the form"),
    createdAt: z.date().nullable().describe("Created at"),
    updatedAt: z.date().nullable().describe("Updated at")
})

export const updateFormInputModel = z.object({
    id: z.string().uuid().describe("Id of the form"),
    title: z.string().describe("Title of the form").optional(),
    description: z.string().describe("Description of the form").optional(),
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