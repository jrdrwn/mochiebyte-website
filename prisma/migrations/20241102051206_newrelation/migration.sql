/*
  Warnings:

  - You are about to drop the column `buktiPembayaran` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `metodePembayaran` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `noHp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Pembelian` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resi` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `metode_pembayaran` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telpon` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pembelian" DROP CONSTRAINT "Pembelian_flavorid_fkey";

-- DropForeignKey
ALTER TABLE "Pembelian" DROP CONSTRAINT "Pembelian_productid_fkey";

-- DropForeignKey
ALTER TABLE "Pembelian" DROP CONSTRAINT "Pembelian_resiId_fkey";

-- DropForeignKey
ALTER TABLE "Pembelian" DROP CONSTRAINT "Pembelian_toppingid_fkey";

-- DropForeignKey
ALTER TABLE "Resi" DROP CONSTRAINT "Resi_userId_fkey";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" DROP COLUMN "buktiPembayaran",
DROP COLUMN "metodePembayaran",
DROP COLUMN "noHp",
ADD COLUMN     "bukti_pembayaran" TEXT,
ADD COLUMN     "metode_pembayaran" TEXT NOT NULL,
ADD COLUMN     "telpon" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";

-- DropTable
DROP TABLE "Pembelian";

-- DropTable
DROP TABLE "Resi";

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productid" INTEGER NOT NULL,
    "flavorid" INTEGER,
    "toppingid" INTEGER,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productid_fkey" FOREIGN KEY ("productid") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_flavorid_fkey" FOREIGN KEY ("flavorid") REFERENCES "Flavor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_toppingid_fkey" FOREIGN KEY ("toppingid") REFERENCES "Topping"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
