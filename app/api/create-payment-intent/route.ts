import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';

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
    if (purchaseType === 'monthly') {
      console.log('📅 ===============================================');
      console.log('📅 CREATING MONTHLY SUBSCRIPTION');
      console.log('📅 ===============================================');
      return await handleSubscription(customerId!, amount, currency, productName, session, body);
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
  body: any
) {
  console.log('📦 Creating/finding Stripe product for subscription...');
  console.log('💰 Subscription amount:', amount, currency);
  console.log('📦 Product name:', productName);

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
          type: 'subscription',
          totalLeaks: 'unlimited',
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
    });

    const targetAmount = Math.round(amount * 100);
    price = prices.data.find(p =>
      p.unit_amount === targetAmount &&
      p.currency === currency.toLowerCase() &&
      p.recurring?.interval === 'month'
    );

    if (!price) {
      console.log('🆕 Creating new price...');
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: targetAmount,
        currency: currency.toLowerCase(),
        recurring: {
          interval: 'month',
        },
        metadata: {
          type: 'monthly_subscription',
          userId: session.user.id
        }
      });
      console.log('✅ Price created:', {
        id: price.id,
        unit_amount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval
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

  // Create subscription with proper setup
  console.log('📅 Creating subscription with immediate charge...');
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: price.id }],

    // Change this to charge immediately
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
      payment_method_types: ['card', 'amazon_pay', 'us_bank_account', 'link']
    },
    expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],

    // Add this to charge the first invoice immediately after setup
    proration_behavior: 'none',

    metadata: {
      userId: session.user.id,
      userEmail: session.user.email ?? null,
      userRole: session.user.role,
      productName,
      purchaseType: 'monthly',
    },
  });

  console.log('✅ Subscription created:', {
    id: subscription.id,
    status: subscription.status,
    customer: subscription.customer,
    pending_setup_intent: (subscription as any).pending_setup_intent,
    purchaseType: 'monthly'
  });

  // Try to get payment intent from various sources
  const latestInvoice = subscription.latest_invoice as any;
  let paymentIntent = latestInvoice?.payment_intent;
  let setupIntent = (subscription as any).pending_setup_intent;

  console.log('🔍 Checking payment options:', {
    invoice_id: latestInvoice?.id,
    invoice_status: latestInvoice?.status,
    payment_intent_exists: !!paymentIntent,
    setup_intent_exists: !!setupIntent,
    setup_intent_id: setupIntent?.id
  });

  // If we have a setup intent, use that for payment setup
  if (setupIntent && setupIntent.client_secret) {
    console.log('✅ Using setup intent for subscription setup:', {
      id: setupIntent.id,
      status: setupIntent.status,
      client_secret: 'Present'
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      subscriptionId: subscription.id,
      setupIntentId: setupIntent.id,
      customerId: customerId,
      productId: product.id,
      priceId: price.id,
      purchaseType: 'monthly',
      paymentType: 'setup_intent',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_start: (subscription as any).current_period_start || null,
        current_period_end: (subscription as any).current_period_end || null,
      }
    }, { status: 201 });
  }

  // If no setup intent, try to get payment intent
  if (!paymentIntent && latestInvoice?.payment_intent) {
    console.log('🔄 Fetching payment intent manually...');
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(latestInvoice.payment_intent as string);
    } catch (error) {
      console.error('❌ Error fetching payment intent:', error);
    }
  }

  // If we have a payment intent, use that
  if (paymentIntent && paymentIntent.client_secret) {
    console.log('✅ Using payment intent:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      client_secret: 'Present'
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
      paymentIntentId: paymentIntent.id,
      customerId: customerId,
      productId: product.id,
      priceId: price.id,
      purchaseType: 'monthly',
      paymentType: 'payment_intent',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_start: (subscription as any).current_period_start || null,
        current_period_end: (subscription as any).current_period_end || null,
      },
      payment: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      }
    }, { status: 201 });
  }

  // Last resort: create a setup intent manually
  console.log('🔧 Creating setup intent manually...');
  try {
    const manualSetupIntent = await stripe.setupIntents.create({
      customer: customerId,
      usage: 'off_session',
      payment_method_types: ['card', 'amazon_pay', 'us_bank_account', 'link'],
      metadata: {
        subscription_id: subscription.id,  // 🚨 ADD THIS LINE!
        userId: session.user.id,
        productName,
        purchaseType: 'monthly',
      },
    });
    console.log('✅ Manual setup intent created:', {
      id: manualSetupIntent.id,
      status: manualSetupIntent.status,
      subscription_id: manualSetupIntent?.metadata?.subscription_id, // Log this
      client_secret: 'Present'
    });

    return NextResponse.json({
      clientSecret: manualSetupIntent.client_secret,
      subscriptionId: subscription.id,
      setupIntentId: manualSetupIntent.id,
      customerId: customerId,
      productId: product.id,
      priceId: price.id,
      purchaseType: 'monthly',
      paymentType: 'setup_intent',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_start: (subscription as any).current_period_start || null,
        current_period_end: (subscription as any).current_period_end || null,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating manual setup intent:', error);
    throw new Error('Failed to create payment setup for subscription');
  }
}