CREATE TABLE "custom_brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"logo_url" text,
	"background_color" varchar(50) DEFAULT '#030712' NOT NULL,
	"text_color" varchar(50) DEFAULT '#f9fafb' NOT NULL,
	"input_bg_color" varchar(50) DEFAULT 'rgba(255,255,255,0.05)' NOT NULL,
	"input_text_color" varchar(50) DEFAULT '#ffffff' NOT NULL,
	"input_border_color" varchar(50) DEFAULT 'rgba(255,255,255,0.1)' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "custom_brands_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "custom_brands" ADD CONSTRAINT "custom_brands_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" DROP COLUMN "enable_logic";