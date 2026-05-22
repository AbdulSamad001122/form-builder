import { db, eq, and, desc } from "@repo/database"
import { formsTable, formFieldsTable, formResponsesTable, formResponseAnswersTable } from "../../database/schema"
import {
    submitFormResponseInputModel, type submitFormResponseInputModelType,
    listFormResponsesInputModel, type listFormResponsesInputModelType
} from "./model"
import { resend, generateSubmissionEmailHtml } from "./utils"

function sanitizeInput(val: string): string {
    if (!val) return val;
    return val
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
}

class FormResponseService {

    public async submitResponse(payload: submitFormResponseInputModelType) {
        const { formId, respondentEmail, answers } = await submitFormResponseInputModel.parseAsync(payload)

        const form = await db.select({
            id: formsTable.id,
            status: formsTable.status,
            title: formsTable.title,
            description: formsTable.description
        })
            .from(formsTable)
            .where(eq(formsTable.id, formId))
            .limit(1)

        if (!form || form.length === 0 || !form[0]) {
            throw new Error("Form not found")
        }

        if (form[0].status !== "PUBLISHED") {
            throw new Error("Cannot submit response to an unpublished form")
        }

        const responseInsert = await db.insert(formResponsesTable).values({
            formId,
            respondentEmail
        }).returning()

        const responseId = responseInsert[0]!.id

        if (answers.length > 0) {
            const answersToInsert = answers.map(ans => ({
                responseId,
                fieldId: ans.fieldId,
                value: sanitizeInput(ans.value)
            }))

            await db.insert(formResponseAnswersTable).values(answersToInsert)
        }

        const fields = await db.select({
            id: formFieldsTable.id,
            label: formFieldsTable.label
        })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))

        const answersWithLabels = answers.map(ans => {
            const field = fields.find(f => f.id === ans.fieldId)
            return {
                label: field ? field.label : "Unknown Field",
                value: sanitizeInput(ans.value)
            }
        })

        const emailHtml = generateSubmissionEmailHtml({
            formTitle: form[0].title,
            formDescription: form[0].description,
            respondentEmail,
            answers: answersWithLabels
        })

        try {
            const { data, error } = await resend.emails.send({
                from: 'Formit <onboarding@resend.dev>',
                to: ["iamabdulsamad2.0@gmail.com"],
                subject: `New Submission: ${form[0].title}`,
                html: emailHtml,
            });

            if (error) {
                console.error("Resend API Error details:", error)
            }
        } catch (err) {
            console.error("Failed to send submission email via Resend:", err)
        }

        return { success: true, responseId }
    }

    public async listResponses(payload: listFormResponsesInputModelType) {
        const { formId, userId } = await listFormResponsesInputModel.parseAsync(payload)

        const form = await db.select({ id: formsTable.id })
            .from(formsTable)
            .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)))
            .limit(1)

        if (!form || form.length === 0) {
            throw new Error("Form not found or unauthorized")
        }

        const responses = await db.select({
            id: formResponsesTable.id,
            formId: formResponsesTable.formId,
            respondentEmail: formResponsesTable.respondentEmail,
            submittedAt: formResponsesTable.submittedAt,
        })
            .from(formResponsesTable)
            .where(eq(formResponsesTable.formId, formId))
            .orderBy(desc(formResponsesTable.submittedAt))

        const responseIds = responses.map(r => r.id)
        let answers: any[] = []
        if (responseIds.length > 0) {
            answers = await db.select()
                .from(formResponseAnswersTable)
        }

        const allAnswers = await db.select({
            responseId: formResponseAnswersTable.responseId,
            fieldId: formResponseAnswersTable.fieldId,
            value: formResponseAnswersTable.value
        })
            .from(formResponseAnswersTable)
            .innerJoin(formResponsesTable, eq(formResponsesTable.id, formResponseAnswersTable.responseId))
            .where(eq(formResponsesTable.formId, formId))

        const groupedResponses = responses.map(res => {
            const resAnswers = allAnswers.filter(a => a.responseId === res.id)
            return {
                ...res,
                answers: resAnswers
            }
        })

        return groupedResponses
    }
}

export default FormResponseService
