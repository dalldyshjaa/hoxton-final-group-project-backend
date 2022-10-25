/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL DEFAULT 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAIMAgwMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYCBAcDAf/EADcQAAICAAMFAwoFBQEAAAAAAAABAgMEBREGITFRsRKh0RMiMzVCcXJzgeEjMlJTYkFDYZHBFP/EABkBAQEBAQEBAAAAAAAAAAAAAAADBAIBBf/EACMRAQACAQMEAwEBAAAAAAAAAAABAgQDETESIUFRIjJSQhP/2gAMAwEAAhEDEQA/ALwAD7r5oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0MyzXDZeuzN9u3T0ceP15EHftHjJv8KFVS93aff4FK6V794eTaIWsFPhtBmEXq51zXKVa/wCaEpgdoqbWoYuHkZP209Y/Y9to3r3eReE4D4mpJOL1T4PmfSToAAAAAAAAAAAAACOzvMf/AAYbzN91m6C5c2SJTdob3fmli182rSCXXvbKaNOu20ubTtCPlKU5OU5OUm9XJ8WYgH0UQAATez2ZyotjhLpa1TekG/Yl4MtJzsvmAveJwVFz4zgm/f8A1MWRSInqhWk79mwADO7AAAAAAAAAAAKLmycc0xSf7jL0VXajCOvFxxUV5lq0b5SX26F8eYi7i8dkKADckAAAXXIk1lOH1/Tr3sp1FM8TfCmpazm9F4l9prjTVCqH5YRUV7kZcq0bRCmnHlmADIoAAAAAAAAAAAeOLw1eLw86LlrCXd/k9gOBR8xy6/L7GrU5Vt+bYuD8Gaep0OUVKLjJJxe5prcyNuyLL7ZdpVyrb/RJpf6NVMn9JzT0pxnVXO6xV1Qc5vhGK1LVDZzARer8rJcnPToSOGwmHwsezh6o1p8dOL+p1bJr/J/nLQyTKVgY+Vu0liJLTdwiuRKgGS1ptO8qRGwADwAAAAAAAAADUzHMKcvp7dr1lL8kE98hEbztBM7Nsj8TnOBw7alcpyXs1rtfYq+PzPE45vys+zX+3HcvuaZqpjfqU5v6WO3aeH9nCyfxy06GvLaXFN+bRVH36shT4WjQpHhz1SmVtLjE99VL+j8T2r2nsT/EwsGv4zaIACdHT9HVK2UbRYOx6WwtqfNrVdxJ4fEU4mHbothZH+L4FAMqrLKpqdU5QmuEovRk7Y0eJexefLoQK/lOf9uUace0m90bVuX18SwGW1LUnaVImJAAcvQAAAAAKNmuJli8fbZJ7lJxguUU9xeTn13p7PjfU040fKZcajAAGxIAAAAAAAAfAuOz2JliMtj5R6yrk4a80uHc0U4tWynq+z5z6RM+THxd05TQAMSoAAAAAHPrvT2fG+p0E59d6ez431NOLzLjUYAA2JAAAAAAAABatk/V1nzn0iVUtWyfq6z5z6RIZH0d05TQAMKoAAAAAHPrvT2fG+oBpxeZcajAAGxIAAAAAAAALVsn6us+c+kQCGR9HdOU0ADCqAAD/9k=',
    "host" BOOLEAN,
    "balance" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("balance", "email", "host", "id", "password", "profileImage") SELECT "balance", "email", "host", "id", "password", "profileImage" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
