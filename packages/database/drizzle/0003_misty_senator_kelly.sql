CREATE TYPE "public"."form_status_enum" AS ENUM('PUBLISHED', 'DRAFT');--> statement-breakpoint
CREATE TYPE "public"."form_visibility_enum" AS ENUM('PUBLIC', 'UNLISTED');--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'LONG_TEXT' BEFORE 'NUMBER';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'SINGLE_SELECT';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'MULTI_SELECT';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'CHECKBOX';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'DROPDOWN';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'RATING';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'DATE';--> statement-breakpoint
CREATE TABLE "form_response_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"response_id" uuid NOT NULL,
	"field_id" uuid NOT NULL,
	"value" text
);
--> statement-breakpoint
CREATE TABLE "form_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "slug" varchar(100);--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "theme" varchar(50);--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "visibility" "form_visibility_enum" DEFAULT 'UNLISTED' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "status" "form_status_enum" DEFAULT 'DRAFT' NOT NULL;--> statement-breakpoint
ALTER TABLE "form_fields" ADD COLUMN "options" jsonb;--> statement-breakpoint
ALTER TABLE "form_response_answers" ADD CONSTRAINT "form_response_answers_response_id_form_responses_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."form_responses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_response_answers" ADD CONSTRAINT "form_response_answers_field_id_form_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."form_fields"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_slug_unique" UNIQUE("slug");