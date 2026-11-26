CREATE TABLE "User" ("id" TEXT PRIMARY KEY NOT NULL, "email" TEXT NOT NULL, "name" TEXT NOT NULL, "passwordHash" TEXT NOT NULL);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "Category" ("id" TEXT PRIMARY KEY NOT NULL, "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE, "title" TEXT NOT NULL, "description" TEXT NOT NULL DEFAULT '', "icon" TEXT NOT NULL, "color" TEXT NOT NULL);
CREATE UNIQUE INDEX "Category_id_userId_key" ON "Category"("id","userId");
CREATE INDEX "Category_userId_title_idx" ON "Category"("userId","title");
CREATE TABLE "Transaction" ("id" TEXT PRIMARY KEY NOT NULL, "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE, "categoryId" TEXT NOT NULL, "description" TEXT NOT NULL, "date" TEXT NOT NULL, "amountCents" INTEGER NOT NULL CHECK("amountCents" > 0), "type" TEXT NOT NULL CHECK("type" IN ('INCOME','EXPENSE')), FOREIGN KEY ("categoryId","userId") REFERENCES "Category"("id","userId") ON DELETE RESTRICT ON UPDATE CASCADE);
CREATE INDEX "Transaction_userId_date_idx" ON "Transaction"("userId","date");
