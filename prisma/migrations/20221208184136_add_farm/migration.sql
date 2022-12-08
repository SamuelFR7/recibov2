/*
  Warnings:

  - Added the required column `farmId` to the `receipts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "receipts" ADD COLUMN     "farmId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "farms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "payerName" TEXT,
    "payerAddress" TEXT,
    "payerDocument" TEXT,

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "farms_name_key" ON "farms"("name");

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
