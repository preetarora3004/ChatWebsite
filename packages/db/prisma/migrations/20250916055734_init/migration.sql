-- DropIndex
DROP INDEX "public"."Message_chatId_idx";

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Message_chatId_createdAt_idx" ON "public"."Message"("chatId", "createdAt");
