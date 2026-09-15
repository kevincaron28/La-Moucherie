// Two clocks on a PENDING order: one to nudge, a later one to tidy up.
//
// The sweep that reads these runs ONCE A DAY — Vercel's Hobby plan allows no
// more than that, and an hourly schedule is rejected outright rather than
// downgraded. So RECOVERY_DELAY_MS is a floor, not a schedule: it stops someone
// being emailed about a cart they walked away from twenty minutes ago, and the
// nudge then lands on the next daily run, 4-28h after checkout started. Late
// enough to be polite, early enough to still be wanted.
//
// The nudge waits long enough that someone who simply walked away from a tab
// mid-checkout isn't emailed while they're still deciding. The sweep runs far
// enough out that a genuine order can't be caught by it.
//
// Abandoned orders never held stock — inventory is only drawn down when payment
// succeeds — so the sweep is hygiene, not inventory recovery, and cancelling one
// must not add stock back.
export const RECOVERY_DELAY_MS = 4 * 60 * 60 * 1000; // 4 hours
export const CLEANUP_DELAY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
