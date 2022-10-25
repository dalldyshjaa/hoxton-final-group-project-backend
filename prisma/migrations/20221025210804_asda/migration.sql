/*
  Warnings:

  - You are about to alter the column `price` on the `Room` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "guestsLimit" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "reviewsNr" INTEGER NOT NULL DEFAULT 0,
    "review" INTEGER NOT NULL
);
INSERT INTO "new_Room" ("city", "country", "description", "guestsLimit", "id", "price", "review", "reviewsNr", "rules", "title") SELECT "city", "country", "description", "guestsLimit", "id", "price", "review", "reviewsNr", "rules", "title" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
