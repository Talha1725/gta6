ALTER TABLE "users" ALTER COLUMN "leaks" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "purchase_type" varchar(255);--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "purchase_type" varchar(255);