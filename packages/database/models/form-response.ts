import {
    pgTable,
    uuid,
    timestamp,
    text,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";
import { formFieldsTable } from "./form-field";

export const formResponsesTable = pgTable("form_responses", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").references(() => formsTable.id).notNull(),
    respondentEmail: text("respondent_email"), // Email collected before submission
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const formResponseAnswersTable = pgTable("form_response_answers", {
    id: uuid("id").primaryKey().defaultRandom(),
    responseId: uuid("response_id").references(() => formResponsesTable.id, { onDelete: 'cascade' }).notNull(),
    fieldId: uuid("field_id").references(() => formFieldsTable.id, { onDelete: 'cascade' }).notNull(),
    value: text("value"), // Store responses as text; JSON/Arrays can be stringified
});
