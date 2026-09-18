-- AlterTable
ALTER TABLE "HatchReport" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "CatchPhoto" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "HatchReport_userId_idx" ON "HatchReport"("userId");

-- CreateIndex
CREATE INDEX "CatchPhoto_userId_idx" ON "CatchPhoto"("userId");

-- AddForeignKey
ALTER TABLE "HatchReport" ADD CONSTRAINT "HatchReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatchPhoto" ADD CONSTRAINT "CatchPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
