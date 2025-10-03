-- CreateTable
CREATE TABLE "public"."LastSeen" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LastSeen_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."LastSeen" ADD CONSTRAINT "LastSeen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
