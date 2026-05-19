import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    boolean,
    text,
    numeric,
    pgEnum,
    jsonb,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { formsTable } from "./form"
import { placeholder } from "drizzle-orm";
import { describe } from "zod/v4/core";
import { unique } from "drizzle-orm/pg-core";

export const fieldTypeEnum = pgEnum("field_type_enum", [
    "TEXT", "LONG_TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD", 
    "SINGLE_SELECT", "MULTI_SELECT", "CHECKBOX", "DROPDOWN", "RATING", "DATE"
])


export const formFieldsTable = pgTable("form_fields", {
    id: uuid("id").primaryKey().defaultRandom(),

    label: varchar("label", { length: 100 }).notNull(),
    labelKey: varchar("lable_key", { length: 100 }).notNull(),

    description: text("description"),

    placeholder: text("placeholder"),
    
    options: jsonb("options"), // Array of choices for selects/dropdowns

    isRequired: boolean("is_required").default(false).notNull(),

    index: numeric("index", { scale: 2 }).notNull(),

    formId: uuid("form_id").references(() => formsTable.id),


    type: fieldTypeEnum("type").notNull(),

    createdBy: uuid("created_by").references(() => usersTable.id),

    createdAt: timestamp("created_at").defaultNow(),

    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())

}, (table) => {
    return {
        uniqueFormIdAndIndex: unique().on(table.formId, table.index)
    }
})