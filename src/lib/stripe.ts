import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

export const PLANS = [
  {
    name: 'Free',
    slug: 'free',
    price: 0,
    stripePriceId: '',
    features: [
      '1 User',
      '100 API calls/month',
      '1GB Storage',
      'Basic Support',
      'Community Access'
    ],
    limits: {
      users: 1,
      apiCalls: 100,
      storage: 1073741824, // 1GB in bytes
    }
  },
  {
    name: 'Pro',
    slug: 'pro',
    price: 1900, // $19 in cents
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || '',
    features: [
      '5 Users',
      '10,000 API calls/month',
      '10GB Storage',
      'Priority Support',
      'Advanced Analytics',
      'API Access'
    ],
    limits: {
      users: 5,
      apiCalls: 10000,
      storage: 10737418240, // 10GB in bytes
    }
  },
  {
    name: 'Business',
    slug: 'business',
    price: 4900, // $49 in cents
    stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID || '',
    features: [
      'Unlimited Users',
      'Unlimited API calls',
      '100GB Storage',
      'Premium Support',
      'Advanced Analytics',
      'API Access',
      'Custom Integrations',
      'SSO/SAML'
    ],
    limits: {
      users: -1, // unlimited
      apiCalls: -1,
      storage: 107374182400, // 100GB in bytes
    }
  }
];

export async function createStripeCustomer(email: string, userId: string) {
  return await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  });
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

export async function resumeSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}