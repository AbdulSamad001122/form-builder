import {
    pgTable,
    uuid,
    timestamp,
    text,
    index,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";
import { formFieldsTable } from "./form-field";

export const formResponsesTable = pgTable("form_responses", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").references(() => formsTable.id, { onDelete: 'cascade' }).notNull(),
    respondentEmail: text("respondent_email"),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
}, (table) => [
    index("form_responses_form_id_idx").on(table.formId),
    index("form_responses_submitted_at_idx").on(table.submittedAt),
]);

export const formResponseAnswersTable = pgTable("form_response_answers", {
    id: uuid("id").primaryKey().defaultRandom(),
    responseId: uuid("response_id").references(() => formResponsesTable.id, { onDelete: 'cascade' }).notNull(),
    fieldId: uuid("field_id").references(() => formFieldsTable.id, { onDelete: 'cascade' }).notNull(),
    value: text("value"),
}, (table) => [
    index("form_response_answers_response_id_idx").on(table.responseId),
    index("form_response_answers_field_id_idx").on(table.fieldId),
]);
