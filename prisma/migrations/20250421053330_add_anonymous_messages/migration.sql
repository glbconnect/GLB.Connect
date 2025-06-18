-- CreateTable
CREATE TABLE "AnonymousMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnonymousMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnonymousMessage_timestamp_idx" ON "AnonymousMessage"("timestamp");
