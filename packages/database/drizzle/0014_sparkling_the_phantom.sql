ALTER TABLE "forms" ADD COLUMN "apply_branding" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" DROP COLUMN "use_custom_branding";