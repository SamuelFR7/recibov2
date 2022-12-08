-- AlterTable
CREATE SEQUENCE receipts_number_seq;
ALTER TABLE "receipts" ALTER COLUMN "number" SET DEFAULT nextval('receipts_number_seq');
ALTER SEQUENCE receipts_number_seq OWNED BY "receipts"."number";
