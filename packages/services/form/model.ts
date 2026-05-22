import { z } from "zod"

export const formVisibilityEnumSchema = z.enum(["PUBLIC", "UNLISTED"])
export const formStatusEnumSchema = z.enum(["PUBLISHED", "DRAFT"])

export const createFormInputModel = z.object({
    userId: z.string().uuid().describe("Id of the user"),
    title: z.string().min(1, "Please enter a title for your form.").max(100, "Please keep the form title under 100 characters.").describe("Title of the form"),
    description: z.string().max(500, "Please keep the form description under 500 characters.").describe("Description of the form").optional(),
    slug: z.string().optional(),
    theme: z.string().optional(),
    visibility: formVisibilityEnumSchema.optional(),
    status: formStatusEnumSchema.optional(),
})

export type createFormFieldInputModelType = z.infer<typeof createFormInputModel>

export const listFormByUserIdInputModel = z.object({
    userId: z.string().uuid().describe("Id of the user")
})

export type listFormByUserIdInputModelType = z.infer<typeof listFormByUserIdInputModel>

export const updateFormInputModel = z.object({
    id: z.string().uuid().describe("Id of the form"),
    userId: z.string().uuid().describe("Id of the user"),
    title: z.string().min(1, "Please enter a title for your form.").max(100, "Please keep the form title under 100 characters.").describe("Title of the form").optional(),
    description: z.string().max(500, "Please keep the form description under 500 characters.").describe("Description of the form").optional(),
    slug: z.string().optional(),
    theme: z.string().optional(),
    visibility: formVisibilityEnumSchema.optional(),
    status: formStatusEnumSchema.optional(),
    isPasswordProtected: z.boolean().optional(),
    password: z.string().min(4, "Your password must be at least 4 characters long.").describe("Form password").optional(),
})

export type updateFormInputModelType = z.infer<typeof updateFormInputModel>

export const deleteFormInputModel = z.object({
    id: z.string().uuid().describe("Id of the form"),
    userId: z.string().uuid().describe("Id of the user"),
})

export type deleteFormInputModelType = z.infer<typeof deleteFormInputModel>

export const getFormByIdInputModel = z.object({
    id: z.string().uuid().describe("Id of the form"),
    userId: z.string().uuid().describe("Id of the user"),
})

export type getFormByIdInputModelType = z.infer<typeof getFormByIdInputModel>