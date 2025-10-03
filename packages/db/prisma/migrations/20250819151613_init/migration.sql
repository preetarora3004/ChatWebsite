/*
  Warnings:

  - A unique constraint covering the columns `[chatId,userId]` on the table `ChatParticipant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."ChatParticipant_userId_chatId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ChatParticipant_chatId_userId_key" ON "public"."ChatParticipant"("chatId", "userId");
