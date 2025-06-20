import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { paymentService } from '@/lib/services';
import { ORDER_STATUS, TRANSACTION_STATUS } from '@/lib/constants';
import { db } from '@/lib/db';
import { orders, transactions } from '@/lib/db/schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: Request) {
  try {
    console.log('🔐 Checking session...');
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('❌ No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ Session found:', {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role
    });

    const body = await request.json();
    console.log('📥 Request body:', body);

    const { amount, currency = 'usd', productName, purchaseType, totalLeaks } = body;

    let customerId: string | undefined = undefined;

    // Create or find customer
    try {
      console.log('🔍 Searching for existing Stripe customer...');
      const existingCustomers = await stripe.customers.list({
        email: session.user.email!,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
        console.log('✅ Found existing customer:', {
          customerId,
          email: existingCustomers.data[0].email,
          name: existingCustomers.data[0].name
        });
      } else {
        console.log('👤 Creating new Stripe customer...');
        const customer = await stripe.customers.create({
          email: session.user.email!,
          name: session.user.name || undefined,
          metadata: {
            userId: session.user.id,
            role: session.user.role
          }
        });
        customerId = customer.id;
        console.log('✅ New customer created:', {
          customerId,
          email: customer.email,
          name: customer.name,
          metadata: customer.metadata
        });
      }
    } catch (customerError) {
      console.error('❌ Error handling customer:', customerError);
    }

    // Handle based on purchase type
    if (purchaseType === 'monthly' || purchaseType === 'pre_order') {
      console.log('📅 ===============================================');
      console.log('📅 CREATING MONTHLY SUBSCRIPTION');
      console.log('📅 ===============================================');
      return await handleSubscription(customerId!, amount, currency, productName, session, body,purchaseType);
    } else {
      console.log('💰 ===============================================');
      console.log('💰 CREATING ONE-TIME PAYMENT');
      console.log('💰 ===============================================');
      return await handleOneTimePayment(customerId, amount, currency, productName, session, body);
    }

  } catch (error: unknown) {
    console.error('❌ Error creating payment:', error);
    return NextResponse.json({
      message: 'Error creating payment',
      error: (error as { message?: string })?.message || 'Unknown error'
    }, { status: 500 });
  }
}

// Handle one-time payments
async function handleOneTimePayment(
  customerId: string | undefined,
  amount: number,
  currency: string,
  productName: string,
  session: any,
  body: any
) {
  const amountInCents = Math.round(amount * 100);
  console.log('💳 Creating one-time payment intent...');
  console.log('💰 Amount in cents:', amountInCents);
  console.log('📦 Product:', productName);
  console.log('🔢 Total leaks:', body.totalLeaks);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: currency.toLowerCase(),
    customer: customerId,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      userId: session.user.id,
      userEmail: session.user.email ?? null,
      userRole: session.user.role,
      productName,
      purchaseType: 'one_time',
      totalLeaks: body.totalLeaks?.toString() ?? null,
    },
  });

  console.log('✅ One-time Payment Intent created:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    customer: paymentIntent.customer,
    purchaseType: 'one_time',
    metadata: paymentIntent.metadata
  });


  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    customerId: customerId,
    purchaseType: 'one_time',
    payment: {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata
    }
  }, { status: 201 });
}

// Handle subscriptions
async function handleSubscription(
  customerId: string,
  amount: number,
  currency: string,
  productName: string,
  session: any,
  body: any,
  purchaseType:string
) {
  console.log('📦 Creating/finding Stripe product for subscription...');
  console.log('💰 Subscription amount:', amount, currency);
  console.log('📦 Product name:', productName);
  console.log('📦 Product purchaseType:', purchaseType);


  // Create or find product
  let product;
  try {
    // Look for existing product by name
    const products = await stripe.products.list({
      active: true,
      limit: 100,
    });

    product = products.data.find(p => p.name === productName);

    if (!product) {
      console.log('🆕 Creating new product...');
      product = await stripe.products.create({
        name: productName,
        description: `Monthly subscription for ${productName}`,
        metadata: {
          type: purchaseType ?? 'subscription',
          totalLeaks: body.totalLeaks ?? '9999',
          userId: session.user.id
        }
      });
      console.log('✅ Product created:', {
        id: product.id,
        name: product.name,
        description: product.description
      });
    } else {
      console.log('✅ Product found:', {
        id: product.id,
        name: product.name
      });
    }
  } catch (error) {
    console.error('❌ Error creating/finding product:', error);
    throw error;
  }

  // Create or find price
  console.log('💰 Creating/finding Stripe price for subscription...');
  let price;
  try {
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 100,
    });

    price = prices.data.find(p =>
      p.unit_amount === Math.round(amount * 100) &&
      p.currency === currency.toLowerCase() &&
      p.recurring?.interval === 'month'
    );

    if (!price) {
      console.log('🆕 Creating new price...');
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        recurring: {
          interval: 'month',
        },
        metadata: {
          type: purchaseType ?? 'subscription',
          totalLeaks: body.totalLeaks ?? '9999',
          userId: session.user.id
        }
      });
      console.log('✅ Price created:', {
        id: price.id,
        unit_amount: price.unit_amount,
        currency: price.currency,
        recurring: price.recurring
      });
    } else {
      console.log('✅ Price found:', {
        id: price.id,
        unit_amount: price.unit_amount,
        currency: price.currency
      });
    }
  } catch (error) {
    console.error('❌ Error creating/finding price:', error);
    throw error;
  }

  // Create subscription
  console.log('📅 Creating subscription...');
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: price.id }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    metadata: {
      userId: session.user.id,
      userEmail: session.user.email ?? null,
      userRole: session.user.role,
      productName,
      type: purchaseType ?? 'monthly',
      totalLeaks: body.totalLeaks ?? '9999',
    },
  });

  console.log('✅ Subscription created:', {
    id: subscription.id,
    status: subscription.status,
    customer: subscription.customer,
    metadata: subscription.metadata
  });

  // Get the latest invoice and payment intent
  const latestInvoice = subscription.latest_invoice as Stripe.Invoice & {
    payment_intent?: Stripe.PaymentIntent;
  };
  console.log('📄 Latest invoice:', {
    id: latestInvoice.id,
    status: latestInvoice.status,
    payment_intent: latestInvoice.payment_intent ? 'exists' : 'missing'
  });

  // Check if payment intent exists in the invoice
  if (!latestInvoice.payment_intent) {
    console.log('⚠️ Payment intent not found in latest invoice, creating separate payment intent...');

    // Create a separate payment intent for the subscription
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email ?? null,
        userRole: session.user.role,
        productName,
        type: purchaseType ?? 'monthly',
        totalLeaks: body.totalLeaks ?? '9999',
        subscriptionId: subscription.id,
      },
    });

    console.log('✅ Separate payment intent created for subscription:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
      customerId: customerId,

      purchaseType: purchaseType ?? 'monthly',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        customer: subscription.customer,
        metadata: subscription.metadata
      },
      payment: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        metadata: paymentIntent.metadata
      }
    }, { status: 201 });
  }

  // Payment intent exists in the invoice
  const paymentIntent = latestInvoice.payment_intent;
  console.log('✅ Payment intent found in invoice:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    subscriptionId: subscription.id,
    customerId: customerId,
    purchaseType: purchaseType ?? 'monthly',
    subscription: {
      id: subscription.id,
      status: subscription.status,
      customer: subscription.customer,
      metadata: subscription.metadata
    },
    payment: {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata
    }
  }, { status: 201 });
}