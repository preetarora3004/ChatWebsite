/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `LastSeen` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LastSeen_userId_key" ON "LastSeen"("userId");
