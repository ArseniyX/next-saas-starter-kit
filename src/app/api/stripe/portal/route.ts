import { NextRequest, NextResponse } from 'next/server';
import { createBillingPortalSession } from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit';

async function handler(req: NextRequest) {
  try {
    // Get user from session (implement your auth check here)
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));

    if (!subscription || !subscription.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // Create billing portal session
    const session = await createBillingPortalSession(
      subscription.stripeCustomerId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Billing portal error:', error);
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(handler, rateLimitConfigs.stripe);