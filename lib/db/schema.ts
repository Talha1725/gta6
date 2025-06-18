import { pgTable, serial, varchar, text, timestamp, boolean, integer, date, pgEnum, decimal } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'completed', 'failed', 'cancelled']);
export const transactionStatusEnum = pgEnum('transaction_status', ['success', 'failed', 'pending', 'refunded']);

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    leaks:integer('leaks').default(0),
    role: userRoleEnum('role').default('user').notNull(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
});

export const email = pgTable('email', {
    id: serial('id').primaryKey(),
    emailAddress: varchar('email_address', { length: 255 }).notNull().unique(),
    status: varchar('status', { length: 20 }).default('active'),
    subscribedAt: timestamp('subscribed_at').defaultNow(),
    unsubscribedAt: timestamp('unsubscribed_at'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const preorder = pgTable('preorder', {
    id: serial('id').primaryKey(),
    notes: text('notes'),
    selectedDate: date('selected_date'), // Date selected by user (YYYY-MM-DD)
    releaseDate: timestamp('release_date'), // Full timestamp for countdown (YYYY-MM-DD HH:MM:SS)
    createdAt: timestamp('created_at').defaultNow(),
});

// Simple orders table for your 5 hardcoded products
export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
    customerEmail: varchar('customer_email', { length: 255 }),
    customerId: varchar('customer_id', { length: 255 }),
    stripeCustomerId: varchar('stripe_customer_id', { length: 100 }),
    productName: varchar('product_name', { length: 255 }).notNull(), // Your 5 hardcoded products
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('usd'),
    status: orderStatusEnum('status').default('pending').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// Simple transactions table
export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    orderId: integer('order_id').references(() => orders.id),
    paymentId: varchar('payment_id', { length: 100 }).notNull().unique(), // Stripe payment_intent ID
    stripeCustomerId: varchar('stripe_customer_id', { length: 100 }),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('usd'),
    status: transactionStatusEnum('status').notNull(),
    failureReason: text('failure_reason'), // Only for failed payments
    createdAt: timestamp('created_at').defaultNow(),
});