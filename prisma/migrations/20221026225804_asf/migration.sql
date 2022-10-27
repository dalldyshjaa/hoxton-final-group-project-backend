/*
  Warnings:

  - Added the required column `title` to the `Favorites` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Favorites" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    CONSTRAINT "Favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Favorites_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Favorites" ("id", "roomId", "userId") SELECT "id", "roomId", "userId" FROM "Favorites";
DROP TABLE "Favorites";
ALTER TABLE "new_Favorites" RENAME TO "Favorites";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
