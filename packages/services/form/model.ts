import { z } from "zod"

export const createFormInputModel = z.object({
    userId: z.string().uuid().describe("Id of the user"),
    title: z.string().describe("Title of the form"),
    description: z.string().describe("Description of the form").optional(),
})

export type createFormFieldInputModelType = z.infer<typeof createFormInputModel>

export const listFormByUserIdInputModel = z.object({
    userId: z.string().uuid().describe("Id of the user")
})

export type listFormByUserIdInputModelType = z.infer<typeof listFormByUserIdInputModel>

export const updateFormInputModel = z.object({
    id: z.string().uuid().describe("Id of the form"),
    userId: z.string().uuid().describe("Id of the user"),
    title: z.string().describe("Title of the form").optional(),
    description: z.string().describe("Description of the form").optional(),
})

export type updateFormInputModelType = z.infer<typeof updateFormInputModel>

export const deleteFormInputModel = z.object({
    id: z.string().uuid().describe("Id of the form"),
    userId: z.string().uuid().describe("Id of the user"),
})

export type deleteFormInputModelType = z.infer<typeof deleteFormInputModel>