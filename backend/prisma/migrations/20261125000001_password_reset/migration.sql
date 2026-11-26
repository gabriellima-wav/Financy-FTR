ALTER TABLE "User" ADD COLUMN "resetDigest" TEXT;
ALTER TABLE "User" ADD COLUMN "resetExpires" DATETIME;
CREATE UNIQUE INDEX "User_resetDigest_key" ON "User"("resetDigest");
