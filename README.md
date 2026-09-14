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

## Angler metadata, species and water

Fly type is how a tyer organises a bench; species, water and season are how an
angler decides what to buy. `src/lib/angling.ts` holds that vocabulary, and each
`Product` carries `species`, `seasons`, `waterTypes`, `techniques`, what it
imitates, a "how to fish it" note and a tyer's tip. Anything left empty simply
renders less rather than showing an empty heading.

That metadata drives three things: the spec panel on a product page,
`/shop/species/<slug>` landing pages (prerendered for both locales, since they
exist to be found in search), and `/shop/water/<slug>` pages built from the
`FishingWater` table.

Named water is the sharpest form of the Québec position and the strongest SEO
asset here — no competitor outside the province can credibly claim the
Jacques-Cartier or the Matapédia. Add waters in `prisma/seed.ts` and link
patterns to them by slug.

**French is not a translation layer.** Species names carry a definite article
that elides before a vowel, so `Angling.speciesDefinite` holds the full form
("l'omble de fontaine", not "le omble de fontaine") and the page templates
interpolate that rather than the bare name.

## Fishing reports and catches

`/reports` is short seasonal notes on what's working where — the reason to come
back weekly rather than once. Reports are unpublished by default; write one in
`npm run db:studio` and flip `published` when the conditions have been checked
against the real river. Linking products to a report turns it into a shoppable
page.

`/catches` is customer catch photos, approved by hand. There's no upload
pipeline on purpose: approval is the whole point, and curating a handful of
photos a month by pasting a URL into `db:studio` is less machinery than hosting
images. Set `approved` to show one.

## Assortments

Curated boxes are ordinary products in the `ASSORTMENT` category, so they use the
same cart, stock and checkout path as a single fly. They lead the shop's category
list because a box is one decision instead of twelve.

They sit **outside** the per-fly bulk tiers: a bundle is already priced as a
deal, so counting its flies would discount the same flies twice, and one box
would drag unrelated singles into a tier they hadn't earned. Price each box below
what the same flies cost as singles *after* the tier, or it's a worse deal than
the cart it replaces.

## Bulk pricing

Quantity tiers live in `src/lib/discount.ts`: 6+ flies 5%, 12+ 10%, 24+ 15%.
They count flies rather than dollars because flies have always been sold by the
dozen, and because twelve flies is twelve flies' worth of bench time whether
they're one pattern or twelve. The discount is applied server-side from the
server's own subtotal — the browser never sends one — and the free-shipping
threshold is judged on the discounted amount, on what the customer actually pays.

Tiers create a deliberate cliff: 23 flies can cost more than 24. The checkout
tells the customer how many more flies reach the next tier, which turns that
into a nudge rather than a surprise.

## Order details for fulfilment

`OrderItem.variantSnapshotFr/En` freeze the hook size at purchase, alongside the
name and price, so a paid order still says what to tie after a variant is renamed
or retired. `Order.notes` holds up to 500 characters of customer instructions.

The owner notification is built as a tying list — pattern, hook size, SKU, count,
with the fly total in the subject line and any customer note called out — so it
can be worked from a phone at the bench without opening the site.

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

Lettermail is priced by format and weight only, never by distance, so one number
covers the country. Parcels do vary by distance, so `TRACKED_RATE_BY_ZONE_CENTS`
holds a rate per zone (QC / east / west / north) measured from
`ORIGIN_POSTAL_CODE`. The destination province is therefore a fixed list rather
than free text — an unrecognised value would silently pick a rate — and an
unknown one bills the highest zone, since guessing cheap means eating the
difference on every such order.

**Verify the zone rates before launch.** They're informed estimates, not quotes.
Four lookups at canadapost.ca from the origin postal code (500 g, 20×15×5 cm) —
Montréal, Toronto or Halifax, Vancouver, Whitehorse — replace the four numbers,
and the checkout, totals and policy page all follow.

This is deliberately a static table rather than the Canada Post Rating API. The
API rates parcels only: Lettermail isn't a rated service and doesn't come back
from it, so live rates would hide the cheapest option on most orders while
adding a network call to the checkout path. Worth revisiting for label printing
and tracking numbers, where the manual work is the real cost.

The shipping price is always recomputed on the server from the server's own
subtotal; the browser only says which method was chosen. `Order.shippingMethod`
and `Order.shippingCents` record what was actually charged, so a past order still
reads correctly after the rates change.

**Check the rates against your own Canada Post prices** from your origin postal
code before launch — the defaults are informed estimates, not quotes. Canada
only for now: US parcels cost several times more and need a customs declaration
per package.

## Abandoned orders

An order sits `PENDING` from the moment checkout starts until Stripe confirms
payment, so every abandoned checkout leaves one behind. `/api/cron/abandoned`
runs hourly from `vercel.json` and does two things: emails a recovery link for
orders past `RECOVERY_DELAY_MS` (4h) that haven't been nudged, and cancels those
past `CLEANUP_DELAY_MS` (7 days).

Abandoned orders never held stock — inventory is only drawn down when payment
succeeds — so cancelling one must not add stock back, and the sweep is hygiene
rather than inventory recovery. Cancel rather than delete, so the record of what
was attempted survives.

The nudge is stamped **before** sending: a send that throws would otherwise be
retried every hour, and emailing someone repeatedly is worse than missing one.
The recovery link carries a random `recoveryToken` rather than the order id, and
`/api/cart/recover` rebuilds the basket from today's catalogue rather than the
order snapshot — a retired or sold-out pattern shouldn't reappear in someone's
cart, and the price should be the current one.

Set `CRON_SECRET` in the environment; the endpoint refuses anything without it,
since otherwise anyone could trigger a mailing.

## Email verification

Registration issues a 24-hour, single-use, SHA-256-hashed token and emails a
link, exactly like password reset. It **never blocks**: an unverified customer
can still browse and check out. Gating the shop on an email that might land in
spam would cost more orders than the fake accounts it prevents. `/account` shows
a banner with a resend button until the address is confirmed.

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
