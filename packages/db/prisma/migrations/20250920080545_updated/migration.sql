/*
  Warnings:

  - You are about to drop the column `senderId` on the `ChatParticipant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ChatParticipant" DROP COLUMN "senderId";
