import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions, payments, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          const subscriptionData = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          const customerId = session.customer as string;
          const customer = await stripe.customers.retrieve(customerId);
          
          // @ts-ignore - metadata exists
          const userId = customer.metadata?.userId;

          if (userId) {
            // Update subscription in database
            const priceData = subscriptionData.items.data[0]?.price;
            const priceNickname = typeof priceData === 'object' && priceData !== null ? (priceData as any).nickname : null;
            const unitAmount = typeof priceData === 'object' && priceData !== null ? (priceData as any).unit_amount : 0;
            const recurringInterval = typeof priceData === 'object' && priceData !== null ? (priceData as any).recurring?.interval : 'month';
            
            await db
              .update(subscriptions)
              .set({
                stripeSubscriptionId: subscriptionData.id,
                status: subscriptionData.status === 'canceled' ? 'cancelled' : subscriptionData.status as any,
                currentPeriodStart: new Date((subscriptionData as any).current_period_start * 1000),
                currentPeriodEnd: new Date((subscriptionData as any).current_period_end * 1000),
                planName: priceNickname || 'Pro',
                planPrice: unitAmount || 0,
                billingCycle: recurringInterval === 'year' ? 'yearly' : 'monthly',
              })
              .where(eq(subscriptions.userId, userId));
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription status
        await db
          .update(subscriptions)
          .set({
            status: subscription.status === 'canceled' ? 'cancelled' : subscription.status as any,
            currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Mark subscription as cancelled
        await db
          .update(subscriptions)
          .set({
            status: 'cancelled',
            cancelAtPeriodEnd: false,
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );
          
          const customer = await stripe.customers.retrieve(
            invoice.customer as string
          );
          
          // @ts-ignore - metadata exists
          const userId = customer.metadata?.userId;

          if (userId) {
            // Record payment
            await db.insert(payments).values({
              userId,
              subscriptionId: subscription.id,
              stripePaymentIntentId: invoice.payment_intent as string,
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: 'succeeded',
              invoiceUrl: invoice.hosted_invoice_url || undefined,
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any; // Use any to bypass type checking
        
        // Try to get subscription ID from various possible locations
        const subscriptionId = invoice.subscription || 
          invoice.subscription_details?.subscription ||
          null;
        
        const finalSubscriptionId = typeof subscriptionId === 'string' 
          ? subscriptionId 
          : subscriptionId?.id;
          
        if (finalSubscriptionId) {
          // Update subscription status to past_due
          await db
            .update(subscriptions)
            .set({
              status: 'past_due',
            })
            .where(eq(subscriptions.stripeSubscriptionId, finalSubscriptionId));
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}