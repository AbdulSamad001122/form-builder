import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const customBrandsTable = pgTable("custom_brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull().unique(),
  logoUrl: text("logo_url"),
  backgroundColor: varchar("background_color", { length: 50 }).notNull().default("#030712"),
  cardBgColor: varchar("card_bg_color", { length: 50 }).notNull().default("rgba(255,255,255,0.03)"),
  textColor: varchar("text_color", { length: 50 }).notNull().default("#f9fafb"),
  inputBgColor: varchar("input_bg_color", { length: 50 }).notNull().default("rgba(255,255,255,0.05)"),
  inputTextColor: varchar("input_text_color", { length: 50 }).notNull().default("#ffffff"),
  inputBorderColor: varchar("input_border_color", { length: 50 }).notNull().default("rgba(255,255,255,0.1)"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectCustomBrand = typeof customBrandsTable.$inferSelect;
export type InsertCustomBrand = typeof customBrandsTable.$inferInsert;
