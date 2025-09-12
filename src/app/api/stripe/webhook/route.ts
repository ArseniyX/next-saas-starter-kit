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
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          const customerId = session.customer as string;
          const customer = await stripe.customers.retrieve(customerId);
          
          // @ts-ignore - metadata exists
          const userId = customer.metadata?.userId;

          if (userId) {
            // Update subscription in database
            await db
              .update(subscriptions)
              .set({
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0].price.id,
                status: subscription.status,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                planName: subscription.items.data[0].price.nickname || 'Pro',
                planPrice: subscription.items.data[0].price.unit_amount || 0,
                billingCycle: subscription.items.data[0].price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
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
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
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
        const invoice = event.data.object as Stripe.Invoice;
        
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
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          // Update subscription status to past_due
          await db
            .update(subscriptions)
            .set({
              status: 'past_due',
            })
            .where(eq(subscriptions.stripeSubscriptionId, invoice.subscription as string));
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