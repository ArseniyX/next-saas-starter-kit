import { NextRequest, NextResponse } from 'next/server';
import { stripe, createCheckoutSession } from '@/lib/stripe';
import { db } from '@/lib/db';
import { users, subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { validateData, createCheckoutSessionSchema } from '@/lib/validations';
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit';

async function handler(req: NextRequest) {
  try {
    // Get user from session (implement your auth check here)
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = validateData(createCheckoutSessionSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { priceId } = validation.data;

    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has a subscription
    const [existingSubscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));

    let customerId = existingSubscription?.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID to database
      if (existingSubscription) {
        await db
          .update(subscriptions)
          .set({ stripeCustomerId: customerId })
          .where(eq(subscriptions.id, existingSubscription.id));
      } else {
        await db.insert(subscriptions).values({
          userId: user.id,
          stripeCustomerId: customerId,
          planName: 'Free',
          planPrice: 0,
          billingCycle: 'monthly',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
      }
    }

    // Create checkout session
    const session = await createCheckoutSession(
      customerId,
      priceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(handler, rateLimitConfigs.stripe);