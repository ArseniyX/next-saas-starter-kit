# Stripe Integration Setup Guide

This guide will help you set up Stripe payments, subscriptions, and billing for your SaaS application.

## Prerequisites

- Stripe account ([Sign up here](https://stripe.com))
- Environment variables configured
- Database migrated with the latest schema

## 1. Stripe Account Configuration

### Get Your API Keys

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** and **Secret key** (use test keys for development)
3. Add them to your `.env.local` file:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
STRIPE_SECRET_KEY="sk_test_your_key_here"
```

### Create Products and Prices

1. Go to [Products](https://dashboard.stripe.com/test/products) in your Stripe dashboard
2. Create products for each plan:

#### Pro Plan
- **Name**: Pro Plan
- **Description**: Professional plan with advanced features
- **Price**: $19.00/month (or your preferred price)
- **Billing Period**: Monthly
- Copy the **Price ID** (starts with `price_`)

#### Business Plan
- **Name**: Business Plan  
- **Description**: Enterprise plan with unlimited features
- **Price**: $49.00/month (or your preferred price)
- **Billing Period**: Monthly
- Copy the **Price ID** (starts with `price_`)

3. Update your environment variables:
```env
STRIPE_PRO_PRICE_ID="price_your_pro_price_id"
STRIPE_BUSINESS_PRICE_ID="price_your_business_price_id"
```

### Configure Webhooks

1. Go to [Webhooks](https://dashboard.stripe.com/test/webhooks) in your Stripe dashboard
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select these events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated` 
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook Secret** (starts with `whsec_`)
6. Add it to your environment variables:
```env
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
```

## 2. Update Your Code

### Update Stripe Configuration

Edit `/src/lib/stripe.ts` and update the `PLANS` array with your actual Stripe Price IDs:

```typescript
export const PLANS = [
  {
    name: 'Free',
    slug: 'free',
    price: 0,
    stripePriceId: '', // Leave empty for free plan
    features: [
      '1 User',
      '100 API calls/month', 
      '1GB Storage',
      'Basic Support'
    ],
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
      'Advanced Analytics'
    ],
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
      'Custom Integrations'
    ],
  }
];
```

### Authentication Integration

The API routes expect a user ID in the `x-user-id` header. Update the billing page and API routes to use your actual authentication system:

In `/src/app/dashboard/billing/page.tsx`, replace:
```typescript
// TODO: Replace with actual user ID from auth
'x-user-id': 'user-id-here',
```

With your actual user authentication logic.

## 3. Testing

### Test Mode

1. Use Stripe's test card numbers:
   - **Successful payment**: `4242424242424242`
   - **Payment requires authentication**: `4000002500003155` 
   - **Declined card**: `4000000000000002`

2. Test the flow:
   - Go to `/dashboard/billing`
   - Click on a plan to upgrade
   - Complete the checkout process
   - Verify the webhook receives the events
   - Check that the subscription is created in your database

### Webhook Testing

Use Stripe CLI to test webhooks locally:

```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Forward events to your local endpoint  
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 4. Production Setup

### Go Live

1. Switch to live API keys in your production environment
2. Create live products and prices (same process as test)
3. Update webhook endpoint to your production URL
4. Set live environment variables:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your_live_key"
STRIPE_SECRET_KEY="sk_live_your_live_key"  
STRIPE_WEBHOOK_SECRET="whsec_your_live_webhook_secret"
```

### Security Considerations

- Never expose secret keys in client-side code
- Validate webhook signatures to prevent tampering
- Use HTTPS in production
- Implement proper error handling and logging
- Set up monitoring for failed payments

## 5. Features Included

✅ **Stripe Checkout Integration**: Secure hosted checkout pages  
✅ **Subscription Management**: Create, update, cancel subscriptions  
✅ **Customer Portal**: Let customers manage their own billing  
✅ **Webhook Handling**: Sync subscription status with your database  
✅ **Multiple Plans**: Support for Free, Pro, and Business tiers  
✅ **Usage Tracking**: Track API calls, storage, and user limits  
✅ **Payment History**: View invoices and payment records  
✅ **Input Validation**: Zod schemas for all API endpoints  
✅ **Rate Limiting**: Protect APIs from abuse  

## 6. Troubleshooting

### Common Issues

**Webhook not receiving events:**
- Check the webhook URL is correct and publicly accessible
- Verify the webhook secret matches your environment variable
- Check Stripe dashboard webhook logs for delivery attempts

**Checkout session creation fails:**
- Verify your Stripe secret key is correct
- Check that the price ID exists and is active  
- Ensure the user has a valid customer ID in Stripe

**Database sync issues:**
- Check webhook event processing in your server logs
- Verify database schema matches the expected structure
- Test webhook payload parsing with actual Stripe data

Need help? Check the [Stripe documentation](https://stripe.com/docs) or open an issue in this repository.