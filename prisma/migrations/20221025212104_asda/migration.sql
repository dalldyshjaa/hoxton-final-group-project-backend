/*
  Warnings:

  - Added the required column `hostId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "guestsLimit" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "reviewsNr" INTEGER NOT NULL DEFAULT 0,
    "review" INTEGER NOT NULL,
    "hostId" INTEGER NOT NULL,
    CONSTRAINT "Room_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Room" ("city", "country", "description", "guestsLimit", "id", "price", "review", "reviewsNr", "rules", "title") SELECT "city", "country", "description", "guestsLimit", "id", "price", "review", "reviewsNr", "rules", "title" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
