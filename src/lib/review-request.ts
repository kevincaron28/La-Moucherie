// One clock, on top of the one in `fulfilledAt`.
//
// There is no delivery-confirmation webhook here — the Canada Post
// integration only quotes a rate at checkout, it never tracks the parcel
// afterward — so "delivered" is not a fact this app has. What it has is
// "an operator in /admin clicked 'shipped'." REVIEW_REQUEST_DELAY_MS is a
// buffer on top of that guess: long enough that even untracked Lettermail
// (the cheaper, slower option most orders under the free-shipping threshold
// actually ship as) has almost certainly arrived, short enough that the
// order is still fresh in the customer's mind when the email lands.
//
// Runs off the same once-a-day cron as the abandoned-cart sweep (see
// src/app/api/cron/daily/route.ts) — Vercel's Hobby plan allows no more than
// one cron schedule, so this rides the existing one rather than adding a
// second.
export const REVIEW_REQUEST_DELAY_MS = 10 * 24 * 60 * 60 * 1000; // 10 days
