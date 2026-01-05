-- Add posterUserId to AnonymousMessage
ALTER TABLE "AnonymousMessage" ADD COLUMN "posterUserId" TEXT;
CREATE INDEX "AnonymousMessage_posterUserId_idx" ON "AnonymousMessage"("posterUserId");
ALTER TABLE "AnonymousMessage" ADD CONSTRAINT "AnonymousMessage_posterUserId_fkey"
  FOREIGN KEY ("posterUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add moderation flags to User
ALTER TABLE "User" ADD COLUMN "muted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "banned" BOOLEAN NOT NULL DEFAULT false;

-- Create AnonymousMessageReport table
CREATE TABLE "AnonymousMessageReport" (
  "id" TEXT NOT NULL,
  "messageId" TEXT NOT NULL,
  "reportedGuestId" TEXT NOT NULL,
  "reporterUserId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AnonymousMessageReport_pkey" PRIMARY KEY ("id")
);

-- Indexes for reports
CREATE INDEX "AnonymousMessageReport_messageId_idx" ON "AnonymousMessageReport"("messageId");
CREATE INDEX "AnonymousMessageReport_reporterUserId_idx" ON "AnonymousMessageReport"("reporterUserId");

-- FKs for reports
ALTER TABLE "AnonymousMessageReport" ADD CONSTRAINT "AnonymousMessageReport_messageId_fkey"
  FOREIGN KEY ("messageId") REFERENCES "AnonymousMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnonymousMessageReport" ADD CONSTRAINT "AnonymousMessageReport_reporterUserId_fkey"
  FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

