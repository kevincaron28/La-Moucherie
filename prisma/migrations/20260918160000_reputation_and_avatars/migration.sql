-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoriteSpecies" "FishSpecies",
ADD COLUMN     "reputation" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "HatchReport" ADD COLUMN     "upvoteCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "CatchPhoto" ADD COLUMN     "upvoteCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "HatchReportVote" (
    "id" TEXT NOT NULL,
    "hatchReportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HatchReportVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatchVote" (
    "id" TEXT NOT NULL,
    "catchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatchVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HatchReportVote_hatchReportId_idx" ON "HatchReportVote"("hatchReportId");

-- CreateIndex
CREATE UNIQUE INDEX "HatchReportVote_hatchReportId_userId_key" ON "HatchReportVote"("hatchReportId", "userId");

-- CreateIndex
CREATE INDEX "CatchVote_catchId_idx" ON "CatchVote"("catchId");

-- CreateIndex
CREATE UNIQUE INDEX "CatchVote_catchId_userId_key" ON "CatchVote"("catchId", "userId");

-- AddForeignKey
ALTER TABLE "HatchReportVote" ADD CONSTRAINT "HatchReportVote_hatchReportId_fkey" FOREIGN KEY ("hatchReportId") REFERENCES "HatchReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HatchReportVote" ADD CONSTRAINT "HatchReportVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatchVote" ADD CONSTRAINT "CatchVote_catchId_fkey" FOREIGN KEY ("catchId") REFERENCES "CatchPhoto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatchVote" ADD CONSTRAINT "CatchVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
