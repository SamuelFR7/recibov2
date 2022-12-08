-- CreateTable
CREATE TABLE "receipts" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "historic" TEXT,
    "recipientName" TEXT NOT NULL,
    "recipientAddress" TEXT,
    "recipientDocument" TEXT,
    "payerName" TEXT,
    "payerAddress" TEXT,
    "payerDocument" TEXT,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "receipts_number_key" ON "receipts"("number");
