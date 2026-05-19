import { z } from "zod";

export const submitFormResponseInputModel = z.object({
    formId: z.string().uuid(),
    respondentEmail: z.string().email(),
    answers: z.array(z.object({
        fieldId: z.string().uuid(),
        value: z.string()
    }))
})

export const submitFormResponseOutputModel = z.object({
    success: z.boolean(),
    responseId: z.string().uuid()
})

export const listFormResponsesInputModel = z.object({
    formId: z.string().uuid()
})

export const formResponseAnswerOutputModel = z.object({
    fieldId: z.string().uuid(),
    value: z.string().nullable()
})

export const formResponseOutputModel = z.object({
    id: z.string().uuid(),
    formId: z.string().uuid(),
    respondentEmail: z.string().nullable(),
    submittedAt: z.date(),
    answers: z.array(formResponseAnswerOutputModel)
})
