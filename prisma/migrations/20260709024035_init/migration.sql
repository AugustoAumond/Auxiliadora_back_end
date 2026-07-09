-- CreateEnum
CREATE TYPE "proposalStatus" AS ENUM ('NOVA', 'ANALISE_CREDITO', 'CONTRATO_EMITIDO', 'ASSINADO', 'ATIVO', 'REPROVADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "rentalProposal" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "status" "proposalStatus" NOT NULL DEFAULT 'NOVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rentalProposal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rentalProposal" ADD CONSTRAINT "rentalProposal_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentalProposal" ADD CONSTRAINT "rentalProposal_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
