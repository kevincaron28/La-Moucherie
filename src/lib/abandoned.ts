// Two clocks on a PENDING order: one to nudge, a later one to tidy up.
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
