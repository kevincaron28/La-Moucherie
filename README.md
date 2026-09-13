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
- **Auth.js (NextAuth v5)** with email + password credentials for customer accounts

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

Generate an `AUTH_SECRET` for signing account sessions:

```bash
openssl rand -base64 32
```

### 4. Run migrations and seed sample products

```bash
npm run db:migrate
npm run db:seed
```

This creates the schema and seeds the current catalog — the 6 fly patterns confirmed so
far (Egg Sucking Leech, Montana Stone, Elk Wing Caddis, Lefty Deceiver, Bead Head Hare's
Ear, Woolly Bugger Black), described from general fly-fishing knowledge with placeholder
hook sizes and pricing. Replace/extend these via `prisma/seed.ts` or `npm run db:studio`
(a visual database browser) as the real lineup, sizes, and prices are confirmed, and swap
in real photos once available (currently `public/products/placeholder-fly.svg`).

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
prisma/schema.prisma        Data model: Product, ProductVariant, Order, OrderItem, Review, User, ContactMessage
prisma/seed.ts               Catalog data (bilingual)
messages/{fr,en}.json        All UI copy
src/i18n/                    next-intl routing/navigation/config
src/app/[locale]/            Pages (home, shop, product, cart, checkout, order confirmation, about, contact, account)
src/app/api/                 Route handlers (Stripe PaymentIntent, Stripe webhook, contact form, order lookup, auth)
src/components/               Header, Footer, product cards, checkout UI, account forms, etc.
src/lib/                     Prisma client, Stripe clients, Auth.js config, cart context, formatting helpers
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

## Customer accounts

Sign-in is email + password (Auth.js/NextAuth v5, `Credentials` provider, bcrypt-hashed
passwords, JWT sessions) — no email delivery required, unlike magic links or password
resets, so it works out of the box everywhere. `/account/register` creates a `User` and
signs them in; `/account` shows order history (`Order.userId`) and a saved shipping
address that pre-fills checkout. Guest checkout still works exactly as before — `Order`
only links to a `User` when someone is signed in at checkout (`auth()` is checked
server-side in `/api/checkout/create-payment-intent`, never trusted from the client).

From `/account`, a signed-in customer can change their display name, their sign-in
email, and their password. Changing the email or the password requires re-entering the
current password — the session alone isn't enough, since the email is the sign-in
identifier. A password change also retires any unused reset tokens, so a link still
sitting in an inbox can't be used as a second way in.

Password reset is at `/account/forgot`. Tokens are stored only as SHA-256 hashes with a
one-hour expiry and are single-use; requesting a new link invalidates any outstanding one.
The endpoint answers identically for known and unknown addresses so it can't be used to
discover who has an account. There's still no email verification on signup.

## Email

All outgoing mail goes through [Resend](https://resend.com) via `src/lib/email.ts`:
order confirmations to the customer, new-order and contact-form alerts to `OWNER_EMAIL`,
and password-reset links.

**Email is optional.** With `RESEND_API_KEY` unset, every send is logged
(`[email:not-configured] would send …`) instead and nothing errors — the site runs fine
unconfigured. Sends also never throw into their caller, so a mail outage can't fail a
payment webhook or a contact submission. To turn it on: verify your domain in Resend, then
set `RESEND_API_KEY`, `EMAIL_FROM` (an address on that domain) and `OWNER_EMAIL`.

## Shipping

Rates live in `src/lib/shipping.ts` and nowhere else — the checkout, the order
total and the shipping policy page all read from it, so changing a price there
changes it everywhere.

Flies weigh about a gram, so postage is decided by thickness and tracking, not
weight, and Canada Post prices those two cases very differently (oversize
Lettermail around $2.61 versus Regular Parcel from about $10.91). A single flat
rate therefore can't be fair: it overcharges a three-fly envelope and loses money
on anything tracked. So the customer picks: untracked letter mail, or a tracked
parcel. Orders at or above `FREE_SHIPPING_THRESHOLD_CENTS` ship free and always
tracked — giving away the untracked rate saves the customer very little and
teaches nothing.

The shipping price is always recomputed on the server from the server's own
subtotal; the browser only says which method was chosen. `Order.shippingMethod`
and `Order.shippingCents` record what was actually charged, so a past order still
reads correctly after the rates change.

**Check the rates against your own Canada Post prices** from your origin postal
code before launch — the defaults are informed estimates, not quotes. Canada
only for now: US parcels cost several times more and need a customs declaration
per package.

## Rate limiting

`src/lib/rate-limit.ts` throttles registration, contact, reviews and password-reset
requests. It's database-backed rather than in-memory because on serverless each request
can hit a different instance, where an in-process counter would reset constantly and
enforce nothing.

## Reviews

Customers can leave a star rating + written review from any product page. Every review is
saved with `status: PENDING` and is **not shown publicly** until approved — open
`npm run db:studio`, find the `Review` table, and change `status` to `APPROVED` (or
`REJECTED`). If the reviewer's email matches a `PAID` order that included the product,
`verifiedPurchase` is set automatically and shows a "Verified purchase" badge.

## Catalog naming

Flies keep their canonical pattern names (Woolly Bugger, Elk Wing Caddis, Lefty
Deceiver). This is deliberate and should stay that way: those names are what
customers search for and how they already order, so a house-branded or
river-themed name would cost discoverability and make the buyer translate before
they can find the fly they want. Local character belongs in the descriptions and
in how patterns are grouped, not in the product name.

## Catalog scope

The shop currently sells **flies only** (dry flies, nymphs, streamers, wet flies) — no
materials, tools, or kits, due to a team supplier agreement (TFO). The `MATERIAL`/`TOOL`/
`KIT` categories still exist in `prisma/schema.prisma` and are ready to use again later;
they're just left out of `CATEGORY_ORDER` in `src/lib/localize.ts`, which controls what
shows up in the shop's category filter.

## Known limitations / natural next steps

- No admin UI yet — manage products and moderate reviews via `npm run db:studio` or by
  editing `prisma/seed.ts`.
- No email verification on signup.
- Abandoned checkouts leave `PENDING` orders behind; nothing prunes them yet.
- The contact form stores messages in the database (`ContactMessage` table, viewable via
  `db:studio`) rather than sending an email — wire up a transactional email provider
  (Resend, Postmark, SendGrid) when you're ready.
- Product photos are placeholder illustrations (`public/products/`) — swap in real photos
  of your flies.
- Single currency (CAD) throughout.

## Deployment

Only `main` deploys. `vercel.json` sets `git.deploymentEnabled` to `{"*": false,
"main": true}` — a branch matching several rules deploys if any of them is true,
so `main` wins its own rule and every other branch is skipped. Branch pushes
would otherwise trigger preview builds that run `prisma migrate deploy` and the
seed against whatever `DATABASE_URL` the Preview environment holds; pointed at
production that means an unfinished schema change on a side branch can reach the
live shop. To use previews properly later, give the Preview environment its own
database (a Neon branch) first, then re-enable the branch here.


Any Node host works; Vercel is the path of least resistance for Next.js. You'll need:

- A managed Postgres database (Vercel Postgres, Supabase, Neon, Railway, etc.) — just set
  `DATABASE_URL`. The `build` script (`prisma migrate deploy && tsx prisma/deploy-seed.ts
  && next build`) applies migrations and, only if the database is completely empty, seeds
  the starting catalog — every deploy, automatically, with no manual step. Once real data
  exists, `deploy-seed.ts` no-ops forever; re-seed intentionally with `npm run db:seed`.
- `AUTH_SECRET` (`openssl rand -base64 32`) for signing account sessions.
- Live Stripe keys, and a webhook endpoint configured in the Stripe Dashboard pointing at
  `https://yourdomain.com/api/webhooks/stripe` for `payment_intent.succeeded` and
  `payment_intent.payment_failed`.
- `NEXT_PUBLIC_SITE_URL` set to your production URL.

## Social links

Set `NEXT_PUBLIC_TIKTOK_URL` (see `.env.example`) to your TikTok profile URL to show the
TikTok icon in the footer — it's hidden automatically while that variable is empty. TikTok
is the only social link wired up for now; the same pattern (env var + conditional icon in
`src/components/Footer.tsx`) can be repeated for Instagram/YouTube/etc. later.
