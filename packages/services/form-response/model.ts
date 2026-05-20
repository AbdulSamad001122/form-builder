import { z } from "zod"

export const submitFormResponseInputModel = z.object({
    formId: z.string().uuid(),
    respondentEmail: z.string().email("Please enter a valid email address"),
    answers: z.array(z.object({
        fieldId: z.string().uuid(),
        value: z.string()
    }))
})

export type submitFormResponseInputModelType = z.infer<typeof submitFormResponseInputModel>

export const listFormResponsesInputModel = z.object({
    formId: z.string().uuid(),
    userId: z.string().uuid()
})

export type listFormResponsesInputModelType = z.infer<typeof listFormResponsesInputModel>
