import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    boolean,
    text,
    pgEnum,
    index,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formVisibilityEnum = pgEnum("form_visibility_enum", ["PUBLIC", "UNLISTED"])
export const formStatusEnum = pgEnum("form_status_enum", ["PUBLISHED", "DRAFT"])

export const formsTable = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),

    title: varchar("title", { length: 80 }).notNull(),
    description: varchar("description", { length: 300 }),
    slug: varchar("slug", { length: 100 }).unique(),
    theme: varchar("theme", { length: 50 }),
    visibility: formVisibilityEnum("visibility").default("UNLISTED").notNull(),
    status: formStatusEnum("status").default("DRAFT").notNull(),

    createdBy: uuid("created_by").references(() => usersTable.id),

    createdAt: timestamp("created_at").defaultNow(),

    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())

}, (table) => [
    index("forms_created_by_idx").on(table.createdBy),
    index("forms_status_visibility_idx").on(table.status, table.visibility),
    index("forms_created_at_idx").on(table.createdAt),
])