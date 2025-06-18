CREATE TYPE "public"."order_status" AS ENUM('pending', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('success', 'failed', 'pending', 'refunded');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"customer_email" varchar(255),
	"customer_id" varchar(255),
	"stripe_customer_id" varchar(100),
	"product_name" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'usd' NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"payment_id" varchar(100) NOT NULL,
	"stripe_customer_id" varchar(100),
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'usd' NOT NULL,
	"status" "transaction_status" NOT NULL,
	"failure_reason" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "transactions_payment_id_unique" UNIQUE("payment_id")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "leaks" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;