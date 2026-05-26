import { db, eq, and, desc, sql } from "@repo/database"
import { formsTable, formFieldsTable, formResponsesTable, formResponseAnswersTable, usersTable } from "../../database/schema"
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
            description: formsTable.description,
            expiresAt: formsTable.expiresAt,
            responseLimit: formsTable.responseLimit,
            creatorEmail: usersTable.email
        })
            .from(formsTable)
            .innerJoin(usersTable, eq(usersTable.id, formsTable.createdBy))
            .where(eq(formsTable.id, formId))
            .limit(1)

        if (!form || form.length === 0 || !form[0]) {
            throw new Error("We could not find the form you are looking for.")
        }

        if (form[0].status !== "PUBLISHED") {
            throw new Error("This form is still a draft and is not accepting responses yet.")
        }

        if (form[0].expiresAt && new Date() > new Date(form[0].expiresAt)) {
            throw new Error("This form has expired and is no longer accepting responses.")
        }

        if (form[0].responseLimit) {
            const [countResult] = await db.select({
                count: sql<number>`count(*)::int`
            })
            .from(formResponsesTable)
            .where(eq(formResponsesTable.formId, formId))

            if (countResult && countResult.count >= form[0].responseLimit) {
                throw new Error("This form has reached its response limit and is no longer accepting submissions.")
            }
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

        const fallbackEmail = process.env.RESEND_FALLBACK_EMAIL || "iamabdulsamad2.0@gmail.com";
        const targetEmail = form[0].creatorEmail && form[0].creatorEmail !== "demo@formit.dev"
            ? form[0].creatorEmail
            : fallbackEmail;

        try {
            const { data, error } = await resend.emails.send({
                from: 'Formit <onboarding@resend.dev>',
                to: [targetEmail],
                subject: `New Submission: ${form[0].title}`,
                html: emailHtml,
            });

            if (error) {
                console.error("Resend API error with dynamic email, falling back to developer email:", error)
                if (targetEmail !== fallbackEmail) {
                    await resend.emails.send({
                        from: 'Formit <onboarding@resend.dev>',
                        to: [fallbackEmail],
                        subject: `New Submission (Fallback): ${form[0].title}`,
                        html: emailHtml,
                    });
                }
            }
        } catch (err) {
            console.error("Failed to send submission email via Resend:", err)
            try {
                if (targetEmail !== fallbackEmail) {
                    await resend.emails.send({
                        from: 'Formit <onboarding@resend.dev>',
                        to: [fallbackEmail],
                        subject: `New Submission (Fallback): ${form[0].title}`,
                        html: emailHtml,
                    });
                }
            } catch (fallbackErr) {
                console.error("Resend completely failed:", fallbackErr)
            }
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
            throw new Error("This form could not be found, or you do not have permission to view it.")
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
