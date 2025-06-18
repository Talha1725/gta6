CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "email" (
	"id" serial PRIMARY KEY NOT NULL,
	"email_address" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'active',
	"subscribed_at" timestamp DEFAULT now(),
	"unsubscribed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "email_email_address_unique" UNIQUE("email_address")
);
--> statement-breakpoint
CREATE TABLE "preorder" (
	"id" serial PRIMARY KEY NOT NULL,
	"notes" text,
	"selected_date" date,
	"release_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
