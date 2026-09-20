-- Additive: both columns nullable, no backfill, no existing row touched.
ALTER TABLE "Order" ADD COLUMN "fulfilledAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "reviewRequestSentAt" TIMESTAMP(3);
