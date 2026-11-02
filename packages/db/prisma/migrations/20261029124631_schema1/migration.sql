-- CreateTable
CREATE TABLE "LastSeen" (
    "id" TEXT NOT NULL,
    "lastOnline" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LastSeen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LastSeen_userId_key" ON "LastSeen"("userId");

-- AddForeignKey
ALTER TABLE "LastSeen" ADD CONSTRAINT "LastSeen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
