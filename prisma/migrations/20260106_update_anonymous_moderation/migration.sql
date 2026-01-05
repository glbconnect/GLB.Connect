-- Alter AnonymousMessage to support moderation and user linkage
ALTER TABLE "AnonymousMessage"
    ADD COLUMN IF NOT EXISTS "userId" TEXT,
    ADD COLUMN IF NOT EXISTS "flagged" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "moderationStatus" TEXT NOT NULL DEFAULT 'APPROVED',
    ADD COLUMN IF NOT EXISTS "moderationReason" TEXT;

-- Add index for userId if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'AnonymousMessage_userId_idx' AND n.nspname = 'public'
    ) THEN
        CREATE INDEX "AnonymousMessage_userId_idx" ON "AnonymousMessage"("userId");
    END IF;
END
$$;

-- Add foreign key for userId (SET NULL on delete)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'AnonymousMessage_userId_fkey'
          AND table_name = 'AnonymousMessage'
    ) THEN
        ALTER TABLE "AnonymousMessage"
            ADD CONSTRAINT "AnonymousMessage_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "User"("id")
            ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END
$$;

-- Create AnonymousReport table for reporting abusive messages
CREATE TABLE IF NOT EXISTS "AnonymousReport" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnonymousReport_pkey" PRIMARY KEY ("id")
);

-- Indexes for AnonymousReport
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'AnonymousReport_messageId_idx' AND n.nspname = 'public'
    ) THEN
        CREATE INDEX "AnonymousReport_messageId_idx" ON "AnonymousReport"("messageId");
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'AnonymousReport_reporterId_idx' AND n.nspname = 'public'
    ) THEN
        CREATE INDEX "AnonymousReport_reporterId_idx" ON "AnonymousReport"("reporterId");
    END IF;
END
$$;

-- Foreign keys for AnonymousReport
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'AnonymousReport_messageId_fkey'
          AND table_name = 'AnonymousReport'
    ) THEN
        ALTER TABLE "AnonymousReport"
            ADD CONSTRAINT "AnonymousReport_messageId_fkey"
            FOREIGN KEY ("messageId") REFERENCES "AnonymousMessage"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'AnonymousReport_reporterId_fkey'
          AND table_name = 'AnonymousReport'
    ) THEN
        ALTER TABLE "AnonymousReport"
            ADD CONSTRAINT "AnonymousReport_reporterId_fkey"
            FOREIGN KEY ("reporterId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;
