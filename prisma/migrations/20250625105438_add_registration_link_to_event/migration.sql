/*
  Warnings:

  - You are about to drop the `ConnectionRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConnectionRequest" DROP CONSTRAINT "ConnectionRequest_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "ConnectionRequest" DROP CONSTRAINT "ConnectionRequest_senderId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "registrationLink" TEXT;

-- DropTable
DROP TABLE "ConnectionRequest";
