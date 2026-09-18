# La Moucherie

Mouches artisanales du Québec — an independent, handmade fly-tying shop.

A bilingual (French/English) e-commerce storefront built with Next.js, Prisma/PostgreSQL,
and an embedded Stripe Elements checkout.

## Where things stand (updated 2026-09-17)

**Live and working:** bilingual storefront and Stripe checkout; Canada Post live shipping
quotes with a service-tier picker (Regular/Expedited/Xpresspost/Priority) plus a
postal-code shipping estimator on the cart page; the "fly dozen" deal (buy 10 of the same
pattern, get 2 free — see below) replacing the old percentage tiers; reviews open to any
signed-in customer, with a verified-purchase badge and "was this helpful" voting; an admin
dashboard at `/admin` (review moderation, low-stock alerts, a "no sizes in stock" alert for
products with zero variants, a "planned patterns" tying to-do list, order print slips, and
a newsletter compose-and-send tool); a newsletter signup/unsubscribe funnel; a header Shop
dropdown (categories + species), a "shop by species" grid on the homepage, and a
`/shop/water` index page; the former "Catches" page is now `/catches` → **Community**
(nav + footer relabeled), showing only hand-approved angler photos — no live embed, so a
bad photo never appears just because it used the right hashtag; `robots.txt` +
`sitemap.ts`; and a homepage/About page built around the real founders, Claudya and Kevin.

**Needs attention before the shop can actually sell:**
- The catalog has 34 fly patterns plus 3 curated boxes, all with real hook-size variants —
  **but every variant is at zero stock**, intentionally, while real inventory is confirmed.
  Every product shows "Out of Stock" until stock counts are set via `db:studio` or the
  admin dashboard. The "planned patterns" list on `/admin` is empty — add new candidates
  there as they come up; an entry disappears ("Tied it") once it becomes a real `Product`.
- Only 4 products (Bead Head Hare's Ear, Montana Stone, Woolly Bugger Black, Lefty
  Deceiver) have real photos, and those are temporary phone shots pending proper lightbox
  photography. **Every other product uses the placeholder SVG** — this is now the single
  biggest visual gap on the site.
- The 3 curated fly-box (`ASSORTMENT`) products exist in `prisma/seed.ts` but aren't live
  in the database.

**Operational note — Neon branch naming was fixed 2026-09-17.** The branch Vercel's
Production deployment actually connects to (`br-lively-bonus-aynn765z`) used to be
mislabeled "vercel-dev" while an unused branch (`br-sweet-frog-aybo5mlh`) was labeled
"production" and flagged primary/default — a trap that caused real confusion earlier this
project (direct SQL landing on the wrong branch). Both are now renamed to match reality:
`br-lively-bonus-aynn765z` is "production" and is the project's primary/default branch;
`br-sweet-frog-aybo5mlh` is "unused-legacy-do-not-use". Any direct SQL should still target
`br-lively-bonus-aynn765z` by ID, but the console labels no longer lie about which one
that is. `br-sweet-frog-aybo5mlh` can't be deleted even though it's unused — Neon refuses
("cannot delete the root branch") since every other branch in the project, including
`production`, was forked from it. It'll just sit there renamed and harmless.

**Operational note — git branch hygiene, cleaned up 2026-09-17.** Several stale
feature branches (from abandoned worktree agents and superseded Canada Post fixes) had
piled up locally and on `origin`, none with any content not already merged into `main`.
The stale ones with zero unique value were identified via `git diff --stat` against
`main` and `git merge-base --is-ancestor`, then deleted (see "Still open" below for the
one that took a manual step). Going forward: prefer working directly against `main` (or a
short-lived branch merged back the same session) over long-lived per-feature branches,
and treat any branch a background/worktree agent creates as disposable the moment its
work lands on `main` — it should be deleted right after merging, not left around.

**Operational note — expect a brief window after a migration where the pooled
connection can 500 on the new column/table.** Confirmed 2026-09-17: a deploy applied a
migration successfully (`prisma migrate deploy`, via `DATABASE_URL_UNPOOLED`) and the
column was verified present via direct SQL, but the app's first live request afterward
(via pooled `DATABASE_URL`) still 500'd with `P2022 column does not exist` — then the
exact same route succeeded on the next request, ~2 minutes later, with no further errors.
Looks like Neon's connection pooler needs a short settle time after DDL before every
pooled connection reflects it. Not something to work around in code; if a page 500s right
after a deploy that included a migration, wait a couple of minutes and recheck before
assuming something is actually broken. Separately: pages with no dynamic route segment
(`/`, `/catches`, `/reports`) are marked `export const dynamic = "force-dynamic"` so they
read live data on every request — without it, Next prerenders them once at build time and
freezes that HTML until the next deploy, which silently breaks any page whose content the
admin dashboard is meant to update (exactly what happened here: the admin CRUD for
reports/catches wouldn't have shown new content without this).

**Recommended next upgrades**, roughly in order of value once inventory/photos catch up:
1. Set real stock counts on the variants that need it so the shop can actually take
   orders again — hook sizes are already published for all 34 patterns.
2. Photograph the catalog — 30 of 34 patterns still use the placeholder image. Consider a
   photo of Kevin too; the homepage/About story currently only has one of Claudya.

## This week's punch list (from the 2026-09-17 site audit)

The owner ran a full audit of the live site and asked for everything in it — ~46 items
spanning copy fixes to multi-week content projects. Most of what's actually buildable
(as opposed to requiring real photos or business decisions) shipped in one pass:

**Done and pushed:**
- Reviews carry optional catch details (species, water, hook size, conditions) shown as
  a tag line under the review body.
- Add-to-cart shows a checkmark + "Added" then a "View cart" link. Cart's free-shipping
  progress bar and product-card hover zoom were already in place.
- `/shop` gained season and water-type filter pills; new `/shop/finder` (species/water/
  season picker), linked from the header Shop dropdown.
- Product pages: a "pairs well with" cross-sell (same category, falling back to species
  overlap), a shipping-price note under the price, sharper SEO titles/descriptions. The
  "how to fish it"/"tyer's tip" callout and JSON-LD `Product` schema already existed.
- Admin dashboard can now publish a `FishingReport` or `CatchPhoto` directly — previously
  the only way was `db:studio`, which is why both pages looked unfinished. Nothing was
  seeded; that's for the owner to fill with real reports/catches.
- Homepage: a trust bar, a "What's Working" teaser (shows the latest published report,
  or a plain invite if none exists yet), a real-catches teaser (renders only once
  approved catches exist), a newsletter/hatch-report signup banner.
- New pages: `/faq` (shipping/returns/sizes/storage, pulling real numbers from
  `shipping.ts`), `/wholesale` and `/ambassadors` (shells + contact CTA — no invented
  terms), `/hatches` (see the hatch chart section below).
- Contact page: reason-for-contact chips (product/order/wholesale/ambassador/custom).
- Footer: 4 columns (Shop/Fishing/About/Help) instead of 3, linking everything above.
  Sitemap updated for all new routes.
- The 3 curated fly-box (`ASSORTMENT`) products (Discovery/Brook Trout/Streamer boxes)
  are live — real prices and descriptions from `prisma/seed.ts`, at zero stock like the
  rest of the catalog until real inventory is confirmed.
- `generateMetadata` added to About, Community, `/shop`, `/reports`, and `/shipping` —
  the only pages left without hand-tuned titles/descriptions were the account/cart/
  checkout/admin flows, which don't need SEO metadata.
- Language-consistency pass across product/checkout/email copy: fixed one drift (FAQ's
  French copy said "l'envoi en enveloppe" instead of "poste-lettre") and aligned the
  owner-facing order-notification email's shipping label with the customer-facing
  wording. Dozen-deal naming, "Community" branding, brand-name capitalization, and
  French "mouche" terminology were all already consistent — checked, not just assumed.

**Deliberately not done, and why:**
- **Inventing current water temps/hatch data for real rivers.** The admin tool above is
  the honest version of this — the owner fills in real conditions, nothing's fabricated.
- **Fake customer catches or testimonials.** Same fix: the admin tool lets the owner add
  real ones (their own catches, friends', customers') whenever they exist.
- **Wholesale/ambassador pricing, criteria, or ambassador profiles.** Business decisions,
  not something to fabricate — shells only until real content exists.

**Still open, lower priority:**
- The mega-menu / full homepage visual redesign from the audit's mockup wasn't attempted —
  the existing Shop dropdown and homepage section order cover most of the same ground
  without a ground-up redesign.
- A "Fly Finder" quiz UI exists at `/shop/finder`; a richer multi-step wizard version
  wasn't built — the single-form version does the same job.
- **Stale branch cleanup, done 2026-09-17.** 9 branches with zero content not already in
  `main` were identified and removed: locally (`fix-token-url-commit`,
  `old-branch-before-restart`, the stale local `main`, and three `worktree-agent-*`
  branches — deleted directly from this session) and on `origin`
  (`claude/canada-post-rest-migration`, `claude/canada-post-token-url-fix`,
  `vercel/install-vercel-web-analytics-uh0jl7` — remote branch deletion is blocked from
  this sandbox by the egress proxy's org policy, so the owner deleted these three via the
  GitHub UI).

## Angler hatch reports (`/reports/submit`)

`HatchReport` is deliberately **not** a `FishingReport`. That model is bilingual
throughout (`titleFr`/`titleEn`, `bodyFr`/`bodyEn`…) because the shop writes both
languages; a visitor writes one, and making those fields nullable to accommodate that
would rot the editorial reports sharing the table. Keeping them apart also keeps this data
*structured* rather than prose, which is what will let it be aggregated later ("Hendrickson
reported on four rivers in ten days") instead of only read.

The form is almost entirely selectors, because the data already existed: waters come from
`FishingWater`, the insect list from the 38 entries in `hatches.ts`, and **hook size is
derived from whichever insect was picked** — so the two hardest questions answer
themselves. Only `note` is free text.

Three things that matter when changing it:

- **`hatchId` is validated in the route, not by a foreign key**, because the hatch
  catalogue lives in code. An unrecognised id would become an unfilterable orphan, so the
  endpoint rejects it — and hatch ids are therefore permanent.
- **`waterOther` is the escape hatch.** Most of Québec isn't in `FishingWater`; without it
  the form dead-ends for anyone fishing an unnamed river. It's also the only free-text
  field, so it carries the moderation weight.
- **`fromShop` lets the shop seed the section** through the same model, auto-approved and
  labelled as ours rather than passed off as a stranger's.

Nothing publishes without approval (`approved` defaults false, same as `CatchPhoto`), the
endpoint is rate-limited and honeypotted, and the owner gets an email per submission —
without that last part the queue is invisible until someone happens to open `/admin`,
which is how a submission feature quietly dies.

**CASL.** Filing a report is not consent to be marketed to. The newsletter opt-in is a
separate, unticked checkbox, and a subscriber created that way records
`consentSource = "hatch_report_form"` — Canadian anti-spam law requires being able to show
*how* express consent was obtained, which a bare `subscribedAt` cannot answer.

## Materials & the production run sheet (`/admin/production`)

Each pattern has a recipe: `Material` rows (what's in the bin) joined to products
through `ProductMaterial` (how this pattern uses it). Material rows are deliberately
generic — "Brown hackle", not "Whiting brown saddle #14" — because two patterns needing
brown hackle must point at the **same** row or the shopping list can't collapse them into
one line. Per-pattern detail belongs in `ProductMaterial.spec{Fr,En}`.

`perFlyQty` is set only for things consumed exactly N per fly (hooks, beads, eyes) so the
run sheet can multiply them out. Thread, dubbing and hackle leave it null: you either have
those or you don't, and a number would be fiction.

The run sheet takes every out-of-stock variant, lists what to tie at an adjustable count
per size, and rolls the recipes into a deduplicated shopping list grouped in tying order.
Hooks additionally break out **by size**, since a single total across every size is
useless at the shop counter — that's the one material you order by size.

**Recipes are seeded from the standard published dressing for each pattern** (see
`prisma/fly-recipes.ts`), which is a starting point, not a record of how this bench
actually ties. That's why `Product.materialsPublic` defaults to `false`: the "Tied with"
list on a product page stays hidden until someone has read that fly's recipe and turned it
on. Supplier notes and quantities are never public either way — that's sourcing, not
merchandising. Re-seed with `npm run db:seed-materials` (idempotent; it upserts).

## The hatch chart (`/hatches`)

`src/lib/hatches.ts` holds La Moucherie's own hatch chart for southern Québec — 38 entries
across mayflies, caddis, stoneflies, midges and terrestrials, each with its scientific
name, an overall emergence window, one or two peak windows (several species are
double-brooded), hook sizes, time of day, a bilingual fishing note, and the catalog
patterns that cover it. The page renders it as a 12-month timeline with a marker on
today's date, and leads with a "what's on the water right now" panel computed from that
date — which is why the route is `force-dynamic`.

**On sourcing.** The timing was written from entomology for this region and cross-checked
against three references the owner supplied (a southern-Québec mayfly calendar, a
Laurentians hatch chart, and a southern-Ontario chart). Emergence dates are facts, not
anyone's copyrightable expression, but none of those charts' text, structure or selection
was copied — the entries, groupings, notes and layout here are original. One of the three
(lemoucheux.ca) carries an explicit all-rights-reserved notice, so it was used strictly to
sanity-check dates against, never reproduced.

Every hatch's `patternSlugs` must resolve to an active product or the link silently
disappears from the page. When adding a hatch or renaming a product slug, re-check that
mapping.

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

Two things that bite when changing the key:

- **Vercel injects env vars at deploy time, so changing one in the dashboard does not
  reach the deployment already serving traffic.** Redeploy after any change, or the site
  keeps using the old value. `src/lib/email.ts` also reads `RESEND_API_KEY` once at
  module scope, so even a warm function keeps whatever it booted with.
- **`OWNER_EMAIL` is load-bearing beyond email.** `adminEmails()` falls back to it when
  `ADMIN_EMAILS` is unset, so clearing it locks everyone out of `/admin`. It also gates
  the owner notifications: `sendOrderNotificationToOwner` and `sendContactNotification`
  return early with no log line when it's missing, so a new order would simply never
  reach the bench — silently.

**Never paste a live API key into a chat, a commit, an issue or a screenshot.** Treat one
that has been anywhere near those as burned: create a replacement in Resend, update the
Vercel env var, redeploy, then revoke the old key. Keys live in the Vercel dashboard and
in `.env.local` (git-ignored), nowhere else.

## Angler metadata, species and water

Fly type is how a tyer organises a bench; species, water and season are how an
angler decides what to buy. `src/lib/angling.ts` holds that vocabulary, and each
`Product` carries `species`, `seasons`, `waterTypes`, `techniques`, what it
imitates, a "how to fish it" note and a tyer's tip. Anything left empty simply
renders less rather than showing an empty heading.

That metadata drives three things: the spec panel on a product page,
`/shop/species/<slug>` landing pages (prerendered for both locales, since they
exist to be found in search), and `/shop/water/<slug>` pages built from the
`FishingWater` table — plus a `/shop/water` index listing every named water,
and a header dropdown (desktop "Shop" link) into both categories and species
so they're reachable without landing on `/shop` first.

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
photos a month by pasting a URL is less machinery than hosting images. It used
to also embed a live SociableKit widget of the `#LaMoucherie` hashtag feed —
that's gone, because an auto-embed can't tell a good photo from a bad one, and
having both a curated grid and an uncurated feed on the same page undercut the
"every photo here was picked by hand" framing.

The replacement is the "Add a catch" form on `/admin`: paste the Instagram
post URL and nothing else is required — `src/lib/instagram.ts` pulls the
shortcode out of it and derives `instagram.com/p/{code}/media/?size=l`, an
unofficial but long-standing endpoint that redirects straight to that post's
own image, no API key needed. The card also links back to the original post
as "View the post" / "Via Instagram". A live preview shows before saving so a
bad paste (or a post that endpoint doesn't work for — private accounts,
carousels, reels) is obvious immediately; the "Photo URL" field stays as a
manual fallback for exactly that case, or for a photo that never came from
Instagram at all. Tick "approve immediately" to publish right away, or leave
it off to review later; either way the daily workflow is: check the hashtag,
paste one link, done — no `db:studio` required.

That derivation isn't a documented Instagram contract, so it can stop working
without notice. If it ever does, the fallback field is the escape hatch —
find a working image URL by hand the way the form used to require for every
photo.

## Assortments

Curated boxes are ordinary products in the `ASSORTMENT` category, so they use the
same cart, stock and checkout path as a single fly. They lead the shop's category
list because a box is one decision instead of twelve.

They sit **outside** the per-fly bulk tiers: a bundle is already priced as a
deal, so counting its flies would discount the same flies twice, and one box
would drag unrelated singles into a tier they hadn't earned. Price each box below
what the same flies cost as singles *after* the tier, or it's a worse deal than
the cart it replaces.

## The fly dozen deal

`src/lib/discount.ts` implements "buy 10 of the same fly, get 2 free" — every
complete dozen of **one pattern** in the cart has its two cheapest units waived.
This replaced an earlier cart-wide 6/12/24-flies percentage-tier system, which
let a customer reach a discount by padding the cart with twelve unrelated
singles; the dozen deal is computed **per `productId`**, so it can only be
earned by depth in one pattern, and mixing patterns earns nothing.

It's applied server-side in `create-payment-intent`, from the database's own
product/category data — the browser only expresses intent (which service tier,
which items), never a discount amount. `ASSORTMENT` boxes are excluded, same
reasoning as before: they're already priced as a bundle. The cart and checkout
UI nudge toward whichever single pattern is closest to its next dozen, by name.

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
holds a rate per zone (QC / Ontario / Atlantic / west / north) measured from
`ORIGIN_POSTAL_CODE`. Each zone bills at the **worst case inside it** — a rate
set from a zone's cheapest city loses money on every order to its far edge.

Ontario is its own zone rather than part of an "east" bucket: Toronto and
St. John's differ by about 45%, and one shared rate would overcharge every
Ontario customer by a third.

Rates are stored **tax-inclusive**. Canada Post quotes before tax but charges it
at the counter, so a pre-tax figure here would lose 13-15% on every parcel. The destination province is therefore a fixed list rather
than free text — an unrecognised value would silently pick a rate — and an
unknown one bills the highest zone, since guessing cheap means eating the
difference on every such order.

**One sanity check still outstanding.** The quotes these came from put Toronto
below Montréal and Whitehorse below Vancouver, which no distance-zoned carrier
does — most likely Find a Rate returned a different service for some
destinations, since Regular Parcel isn't offered everywhere. Each figure is at
or above what its zone should cost, so nothing here undercharges, but one real
counter receipt would settle it.

### Live rates

With `CANADA_POST_API_USERNAME` / `CANADA_POST_API_PASSWORD` set, the tracked
option is priced from a live Canada Post quote (`src/lib/canada-post.ts`) and the
zone table becomes the fallback. Without them, nothing changes and the zone table
is used directly — the shop works either way.

The API rates **parcels only**. Lettermail isn't a rated service and never comes
back from it, so the letter option keeps its flat price rather than disappearing:
it's the cheapest way to send a few flies, and replacing it with a parcel quote
would roughly triple postage on a small order.

Three rules make a network call safe in the checkout path:

- **Fail soft.** Every entry point returns null instead of throwing, and the
  caller falls back to the zone rate. A Canada Post outage must never block a
  sale.
- **Time out at 4s**, so a hanging upstream doesn't hang checkout.
- **Cache by FSA.** The first three characters of a postal code decide the zone,
  so quoting by FSA gets many more hits for the same answer. One hour, in
  memory; a miss costs one API call, never a wrong price.

The price charged uses Canada Post's `due` (tax-inclusive), not `base` — `base`
would lose 5-15% depending on the destination province. The browser's quote is a
preview only; `create-payment-intent` resolves the rate again server-side.

**Service tiers.** `resolveShippingRate` (`src/lib/shipping-quote.ts`) returns every live
tier Canada Post quotes (Regular, Expedited, Xpresspost, Priority, whichever apply),
cheapest first, and the checkout page lets the customer pick among them once tracked
shipping applies. Free shipping only zeroes out the **cheapest** tier — a customer can
still pay to upgrade to a faster one above the free-shipping threshold, since giving away
Priority for free would blow past the margin the threshold exists to protect. The
`shippingServiceCode`/`shippingServiceName` the customer picked are re-validated
server-side against the live tier list (never trusted from the browser) and recorded on
the `Order` for the owner-notification email and the print slip.

**Shipping estimator.** The cart page also has a standalone `ShippingEstimator`
component — province + postal code only, no address required — so someone can check
the price before ever starting checkout. It hits the same `/api/shipping/quote`
endpoint checkout uses.

`GET /api/admin/canada-post-check` quotes one test parcel and reports what came
back, so a credential problem reads directly instead of being inferred from a
checkout that quietly fell back. It renders a readable page rather than JSON
because the usual way to reach it is a phone, where a Bearer header isn't
something you can set; add `?format=json` for curl.

Access is either route in (`src/lib/admin.ts`): signed in with an address in
`ADMIN_EMAILS` (defaults to `OWNER_EMAIL`), or the `CRON_SECRET` bearer token for
scripts. Matching on the session's email rather than a role column is deliberate
— there's one operator, and a permissions system would be machinery without a
user.

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
runs **once a day** from `vercel.json` (13:00 UTC) and does two things: emails a recovery link for
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

**Vercel's Hobby plan allows at most one cron run per day**, and a more frequent
schedule is rejected outright — the deployment is never created, so pushes appear
to do nothing rather than failing visibly. Keep the schedule daily unless the
plan changes. `RECOVERY_DELAY_MS` is therefore a floor rather than a cadence:
it stops someone being emailed about a cart they left twenty minutes ago, and the
nudge lands on the next daily run.

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

Any **signed-in** customer can leave a star rating + written review on **any** product —
a purchase is no longer required (it was, earlier; that gate was removed deliberately).
`verifiedPurchase` is still set from a real order lookup at submit time, so the badge on
each review stays honest even though it's no longer a requirement to review at all.
Sign-in itself remains the only gate, both to enforce one-review-per-product-per-account
(`Review`'s `@@unique([productId, userId])`) and as a cheap anti-spam floor.

Every review is saved `PENDING` and isn't shown publicly until approved — either in
`npm run db:studio` (the `Review` table, flip `status` to `APPROVED`/`REJECTED`), or from
the **admin dashboard** at `/admin`, which lists everything pending with one-click
Approve/Reject buttons.

Each visible review also carries a "was this review helpful?" yes/no vote
(`ReviewVote`, keyed on a hashed visitor IP so the same visitor can't vote twice — the
hash exists purely to block repeat votes, never to identify anyone).

The review card (`ReviewsSection.tsx`) is the reference for every other piece of
user-submitted content on the site: a `rounded-2xl border border-forest/10 bg-cream/40`
container, a header row pairing the primary name with a date, and small pill labels for
facts (species, verified-purchase, hook size). Community catches (`/catches`) and angler
hatch reports (`/reports`) reuse the same container tokens and the same pill via
`chipClass()` in `src/lib/chip.ts`, so a page built from three different content types —
a review, a photo, a hatch note — still reads as one family of cards rather than three
competing designs.

## Admin dashboard

`/admin` is gated by `isAdmin()` (`src/lib/admin.ts`) — signed in with an address in
`ADMIN_EMAILS` (defaults to `OWNER_EMAIL`). One page, several sections: pending review
moderation, low-stock variant alerts, recent paid orders with print-slip links, the
newsletter composer (below), and a link to the Canada Post diagnostic. There's no
separate product-editing UI — that's still `db:studio` or `prisma/seed.ts`.

## Newsletter

`NewsletterSubscriber` is this app's own table — not a Resend audience — kept
consistent with Prisma being the source of truth everywhere else. Sign-up is a footer
form (`src/components/NewsletterSignup.tsx`) → `POST /api/newsletter/subscribe`; every
subscriber gets a permanent, per-subscriber unsubscribe token (stored **plaintext**,
deliberately unlike the hashed password-reset token — this link has to keep working in
every future campaign email, not just once right after issue) baked into a link at
`/newsletter/unsubscribe`.

Sending is admin-only: the "Newsletter" section of `/admin` composes a subject + HTML
body per locale (optionally prefilled from a published fishing report), and
`POST /api/admin/newsletter/send` batches the send through Resend
(`sendNewsletterCampaign` in `src/lib/email.ts`, chunked at 100 recipients per Resend's
batch-API limit), appending each recipient's own unsubscribe link. Every send is logged
to `NewsletterCampaign` so the dashboard shows history and a send can't happen twice by
accident. Like all other email here, this is a no-op (logs instead of sending) until
`RESEND_API_KEY` is set.

## Pre-launch notice

`ConstructionBanner` sits above the header on every page: the shop opens **March 1st**
with the catalogue restocked. It exists because every variant is at zero stock until then,
so without it a visitor's only available explanation for "Out of Stock" across all 34
patterns is that the business is dead. It is deliberately not dismissible and not sticky —
read on arrival, then scrolls away rather than eating a phone's viewport.

**Delete the component and its mount in `[locale]/layout.tsx` once the shop opens.**

## Navigation

Grouped by what someone is trying to do, not by what the codebase contains:
**Shop** (categories, species, Fly Finder, shop by water), **Learn** (hatch chart, the
insect guides, FAQ), **On the water** (what's working, file a report, community, waters),
then Our story and Contact. Shop leads in both the drawer and the always-visible row —
it is a shop, and the educational sections sit directly under it rather than above it.

On a phone this is a drawer, not the horizontally scrolling strip it used to be. That
strip held five links and physically could not show the rest of the site — the hatch
chart, every insect page, the FAQ and the Fly Finder were unreachable on mobile except
through the footer, which is where the site's best content was effectively buried. The
drawer carries the whole map; a single always-visible row underneath the logo keeps the
hatch chart, shop and reports one tap away without opening it.

`/wholesale` and `/ambassadors` stay footer-only on purpose: they're shells until there
are real terms to publish.

## Branch convention

**`main` is the only branch.** It deploys straight to production; there is no staging
branch and no long-lived feature branch. Push work to `main`.

Earlier sessions also mirrored every commit to `claude/fly-tying-shop-stripe-jlr7w6`,
which made Vercel build each push twice — once as production from `main`, once as a
preview from the branch — and made the deployment list read as though work were landing
on the branch instead of `main`. It wasn't: the two refs were byte-identical. That mirror
push has been dropped; don't reintroduce it.

## Brand & identity

La Moucherie is a family business run by Claudya and Kevin. Customer-facing copy uses
first names only — the full surname is deliberately kept to the single spot where it
carries weight (`About.p1`), not repeated across hero copy, image alt text and meta
descriptions. Don't reintroduce it elsewhere. The homepage hero and
About page (`src/app/[locale]/page.tsx`, `.../about/page.tsx`) are built around their real
story — Claudya's first fly-fishing trip to Pulaski, NY three years ago, picking up a vise
two years ago, tying seriously this season — with a real photo of Claudya
(`public/about/claudya-steelhead.jpg`) rather than a stock/placeholder image.

The visual system (forest/rust/gold/halo palette, Fraunces + Inter) was **kept**, not
replaced, after reviewing a full rebrand mockup against three directions — see
`src/app/globals.css`'s header comment for why the palette was chosen (it's drawn from
the omble de fontaine / brook trout). What changed is Fraunces now also loads weight 800
and italic (for the heavier hero headline and the About page pull-quote), plus a
hand-drawn river-line SVG accent on the homepage hero. If a fuller visual overhaul is
revisited later, two more aggressive directions (dark/condensed, high-contrast patch
badge) were explored and can be picked up again rather than designed from scratch.

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

See "Where things stand" at the top for the current catalog/photo/email-config gaps —
this list is the smaller, longer-lived stuff:

- There's an admin dashboard at `/admin` now (review moderation, low-stock, order print
  slips, newsletter), but no product-editing UI yet — manage products/variants via
  `npm run db:studio` or `prisma/seed.ts`.
- Abandoned checkouts leave `PENDING` orders behind; the daily cron cancels old ones (see
  "Abandoned orders") but nothing prunes the row itself.
- The contact form stores messages in the database (`ContactMessage` table, viewable via
  `db:studio`); the owner is also emailed via Resend if `OWNER_EMAIL`/`RESEND_API_KEY`
  are set.
- Single currency (CAD) throughout.
- No product-image upload pipeline — new photos are added by hand to `public/products/`
  or `public/about/` and referenced by path in the database.

## Database connections

Two URLs, deliberately:

- `DATABASE_URL` — Neon's **pooled** host. Runtime queries want this: serverless
  makes many short-lived connections, which is what a pooler is for.
- `DATABASE_URL_UNPOOLED` — the same string with `-pooler` removed from the host.
  `prisma migrate deploy` takes a session-scoped Postgres advisory lock, and a
  transaction-mode pooler can't hold one, so migrations through the pooled URL
  fail with `P1002 … timed out trying to acquire a postgres advisory lock` and
  the whole deploy dies. `directUrl` in `prisma/schema.prisma` routes migrations
  around the pooler.

  On Vercel this variable is auto-populated by the Neon integration for
  **every** environment — Production and each Preview branch — so it never
  needs to be added by hand. (An earlier hand-added `DIRECT_URL` only existed
  in Production, which is why every Preview build failed with
  `P1012: Environment variable not found` until this was switched over.)

For a plain local Postgres there's no pooler, so both point at the same place.

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

Set `NEXT_PUBLIC_TIKTOK_URL` and/or `NEXT_PUBLIC_INSTAGRAM_URL` (see `.env.example`) to
show that platform's icon in the footer — each is hidden automatically while its variable
is empty. `NEXT_PUBLIC_INSTAGRAM_URL` also drives the "tag us on Instagram" link on
`/catches`. The same pattern (env var + conditional icon in `src/components/Footer.tsx`)
can be repeated for YouTube/etc. later.
