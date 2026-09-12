# La Moucherie

Mouches artisanales du Québec — an independent, handmade fly-tying shop.

A bilingual (French/English) e-commerce storefront built with Next.js, Prisma/PostgreSQL,
and an embedded Stripe Elements checkout.

## Stack

- **Next.js 16** (App Router, TypeScript) + Tailwind CSS v4
- **next-intl** for bilingual routing (`/fr/...` default, `/en/...`)
- **Prisma + PostgreSQL** for products, variants, and orders
- **Stripe Elements** (embedded Payment Element, not a hosted redirect) for checkout,
  with a webhook that confirms payment and decrements inventory

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Start a local Postgres database

```bash
docker compose up -d
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in your Stripe **test** keys from the
[Stripe Dashboard](https://dashboard.stripe.com/test/apikeys):

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 4. Run migrations and seed sample products

```bash
npm run db:migrate
npm run db:seed
```

This creates the schema and seeds ~12 sample flies, materials, tools, and a starter kit
so the shop isn't empty. Replace/extend these via `prisma/seed.ts` or
`npm run db:studio` (a visual database browser) once you have real products.

### 5. Forward Stripe webhooks to your local server

In a separate terminal, using the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` value it prints into `STRIPE_WEBHOOK_SECRET` in `.env`.

### 6. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` — it redirects to `/fr` by default.

Use [Stripe's test card numbers](https://stripe.com/docs/testing) (e.g.
`4242 4242 4242 4242`, any future expiry, any CVC) to complete a test checkout.

## Project structure

```
prisma/schema.prisma        Data model: Product, ProductVariant, Order, OrderItem, Review, ContactMessage
prisma/seed.ts               Sample catalog data (bilingual)
messages/{fr,en}.json        All UI copy
src/i18n/                    next-intl routing/navigation/config
src/app/[locale]/            Pages (home, shop, product, cart, checkout, order confirmation, about, contact)
src/app/api/                 Route handlers (Stripe PaymentIntent, Stripe webhook, contact form, order lookup)
src/components/               Header, Footer, product cards, checkout UI, etc.
src/lib/                     Prisma client, Stripe clients, cart context, formatting helpers
```

## How checkout works

1. The cart lives client-side (React context + `localStorage`) — no account required.
2. On the checkout page, the customer enters contact + shipping info, then
   `POST /api/checkout/create-payment-intent` re-prices the cart **server-side** from the
   database (never trusting client-sent prices), creates a `PENDING` `Order` row, and
   creates a Stripe `PaymentIntent`.
3. The Stripe Payment Element collects card details and confirms the payment in place.
4. Stripe calls `POST /api/webhooks/stripe` on `payment_intent.succeeded`, which marks the
   order `PAID` and decrements variant stock — this is the source of truth for fulfillment,
   not the browser redirect.

## Reviews

Customers can leave a star rating + written review from any product page. Every review is
saved with `status: PENDING` and is **not shown publicly** until approved — open
`npm run db:studio`, find the `Review` table, and change `status` to `APPROVED` (or
`REJECTED`). If the reviewer's email matches a `PAID` order that included the product,
`verifiedPurchase` is set automatically and shows a "Verified purchase" badge.

## Known limitations / natural next steps

- No admin UI yet — manage products and moderate reviews via `npm run db:studio` or by
  editing `prisma/seed.ts`.
- No customer accounts or order history lookup by email.
- Flat-rate shipping only (`SHIPPING_FLAT_CENTS` in `src/lib/constants.ts`); no live
  carrier rates.
- The contact form stores messages in the database (`ContactMessage` table, viewable via
  `db:studio`) rather than sending an email — wire up a transactional email provider
  (Resend, Postmark, SendGrid) when you're ready.
- Product photos are placeholder illustrations (`public/products/`) — swap in real photos
  of your flies.
- Single currency (CAD) throughout.

## Deployment

Any Node host works; Vercel is the path of least resistance for Next.js. You'll need:

- A managed Postgres database (Vercel Postgres, Supabase, Neon, Railway, etc.) — set
  `DATABASE_URL` and run `npx prisma migrate deploy` against it.
- Live Stripe keys, and a webhook endpoint configured in the Stripe Dashboard pointing at
  `https://yourdomain.com/api/webhooks/stripe` for `payment_intent.succeeded` and
  `payment_intent.payment_failed`.
- `NEXT_PUBLIC_SITE_URL` set to your production URL.
