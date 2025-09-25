# SaaS Starter Kit

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

<p align="center">A modern, full-stack SaaS starter kit built with Next.js 14, TypeScript, and Tailwind CSS.<br/>Get your SaaS application up and running quickly with authentication, billing, user management, and more.</p>

<div align="center">
  <img src="public/hero.png" alt="SaaS Starter Kit Hero" width="800" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
</div>

<br/>

## 🚀 Features

-   ✅ **Authentication & Authorization** - Secure user auth with Better Auth
-   ✅ **Database** - PostgreSQL with Drizzle ORM and migrations
-   ✅ **Payments & Billing** - Stripe integration with subscriptions
-   ✅ **User Dashboard** - Complete user management interface
-   ✅ **Entity Management** - CRUD operations for business entities
-   ✅ **Usage Tracking** - Monitor API calls, storage, and user limits
-   ✅ **Responsive Design** - Mobile-first with dark/light mode
-   ✅ **Type Safety** - Full TypeScript coverage with Zod validation
-   ✅ **Rate Limiting** - API protection with express-rate-limit
-   ✅ **Email System** - Ready for transactional emails
-   ✅ **Analytics Ready** - Vercel Analytics integration
-   ✅ **Production Ready** - Optimized for deployment

## 🛠️ Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS + shadcn/ui
-   **Database**: PostgreSQL (Vercel Postgres/Local)
-   **ORM**: Drizzle ORM
-   **Authentication**: Better Auth
-   **Payments**: Stripe
-   **Validation**: Zod
-   **Icons**: Lucide React
-   **Deployment**: Vercel (recommended)

## 📦 Getting Started

### Prerequisites

-   Node.js 18+ and npm/pnpm
-   PostgreSQL database
-   Stripe account (for payments)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd saas-starter-kit
npm install
```

### 2. Environment Setup

Copy the environment template:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/saas_starter_kit"

# Authentication
BETTER_AUTH_SECRET="your-super-secret-key-min-32-chars-long"
BETTER_AUTH_URL="http://localhost:3000"

# Stripe (optional for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_BUSINESS_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (optional)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""
```

### 3. Database Setup

Generate and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

Optional: Open database studio:

```bash
npm run db:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🗄️ Database Schema

The starter kit includes comprehensive database schema with:

-   **Users**: Complete user profiles with preferences
-   **Sessions**: Secure session management
-   **Accounts**: OAuth provider support
-   **Entities**: Business entity management
-   **Subscriptions**: Stripe subscription tracking
-   **Plans**: Subscription plan definitions
-   **Payments**: Payment history and invoices
-   **Usage**: Resource usage tracking

## 💳 Stripe Integration

### Quick Setup

1. Create a Stripe account and get your API keys
2. Create products and prices in Stripe Dashboard
3. Configure webhooks for subscription events
4. Update environment variables

For detailed setup instructions, see [STRIPE_SETUP.md](./STRIPE_SETUP.md).

### Subscription Plans

-   **Free**: 1 user, 100 API calls/month, 1GB storage
-   **Pro**: 5 users, 10K API calls/month, 10GB storage ($19/month)
-   **Business**: Unlimited users/API calls, 100GB storage ($49/month)

## 🎨 UI Components

Built with shadcn/ui components:

-   Modern, accessible component library
-   Dark/light mode support
-   Fully customizable with Tailwind CSS
-   Mobile-responsive design
-   Loading states and error handling

## 🔐 Authentication

Powered by Better Auth:

-   Email/password authentication
-   Session management
-   Password reset functionality
-   OAuth providers ready (GitHub, Google, etc.)
-   CSRF protection and security headers

## 📁 Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Protected dashboard pages
│   └── page.tsx       # Landing page
├── components/
│   ├── ui/            # shadcn/ui components
│   ├── auth/          # Authentication components
│   └── dashboard/     # Dashboard components
├── lib/
│   ├── db/            # Database schema and config
│   ├── auth.ts        # Authentication config
│   ├── stripe.ts      # Stripe configuration
│   └── utils.ts       # Utility functions
└── hooks/             # Custom React hooks
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy with automatic PostgreSQL setup

### Manual Deployment

1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy to your hosting platform

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio
```

### Code Quality

-   TypeScript for type safety
-   ESLint for code linting
-   Prettier formatting (recommended)
-   Zod for runtime validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## 🆘 Support

-   📖 [Documentation](./DOCS.md)
-   💳 [Stripe Setup Guide](./STRIPE_SETUP.md)
-   🐛 [Report Issues](https://github.com/your-username/saas-starter-kit/issues)
-   💬 [Discussions](https://github.com/your-username/saas-starter-kit/discussions)

## 🙏 Acknowledgments

Built with amazing open-source tools:

-   [Next.js](https://nextjs.org/) - React framework
-   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
-   [shadcn/ui](https://ui.shadcn.com/) - Component library
-   [Drizzle ORM](https://orm.drizzle.team/) - Type-safe ORM
-   [Better Auth](https://www.better-auth.com/) - Authentication library
-   [Stripe](https://stripe.com/) - Payment processing

---

**Ready to build your SaaS? Star this repo and get started!** ⭐
