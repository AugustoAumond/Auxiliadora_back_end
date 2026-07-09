-- CreateTable
CREATE TABLE "rental_proposal_logs" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "ownerPropertyId" TEXT NOT NULL,
    "propertiesStatus" TEXT NOT NULL,
    "rentalProposalStatus" "proposal_status" NOT NULL,
    "message" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rental_proposal_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rental_proposal_logs" ADD CONSTRAINT "rental_proposal_logs_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_proposal_logs" ADD CONSTRAINT "rental_proposal_logs_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
