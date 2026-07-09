/*
  Warnings:

  - You are about to drop the `rentalProposal` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "proposal_status" AS ENUM ('NOVA', 'ANALISE_CREDITO', 'CONTRATO_EMITIDO', 'ASSINADO', 'ATIVO', 'REPROVADA', 'CANCELADA');

-- DropForeignKey
ALTER TABLE "rentalProposal" DROP CONSTRAINT "rentalProposal_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "rentalProposal" DROP CONSTRAINT "rentalProposal_propertyId_fkey";

-- DropTable
DROP TABLE "rentalProposal";

-- DropEnum
DROP TYPE "proposalStatus";

-- CreateTable
CREATE TABLE "rental_proposal" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "status" "proposal_status" NOT NULL DEFAULT 'NOVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rental_proposal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rental_proposal" ADD CONSTRAINT "rental_proposal_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_proposal" ADD CONSTRAINT "rental_proposal_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
