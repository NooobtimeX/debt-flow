/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `Debt` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Debt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "principal" REAL NOT NULL,
    "interestRate" REAL NOT NULL,
    "interestRateType" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "termMonths" INTEGER NOT NULL,
    "firstPaymentDate" DATETIME NOT NULL,
    "note" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Debt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Debt" ("createdAt", "currency", "firstPaymentDate", "id", "interestRate", "interestRateType", "name", "note", "principal", "termMonths", "type", "updatedAt", "userId") SELECT "createdAt", "currency", "firstPaymentDate", "id", "interestRate", "interestRateType", "name", "note", "principal", "termMonths", "type", "updatedAt", "userId" FROM "Debt";
DROP TABLE "Debt";
ALTER TABLE "new_Debt" RENAME TO "Debt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
