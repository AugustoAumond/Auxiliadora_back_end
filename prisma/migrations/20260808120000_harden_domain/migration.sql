-- Preserve existing property states while converting them to a constrained enum.
CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'NEGOTIATING', 'RENTED');

ALTER TABLE "properties"
  ALTER COLUMN "value" TYPE DECIMAL(12, 2) USING ROUND("value"::numeric, 2),
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "PropertyStatus" USING (
    CASE "status"
      WHEN 'disponível' THEN 'AVAILABLE'
      WHEN 'em_negociacao' THEN 'NEGOTIATING'
      WHEN 'alugado' THEN 'RENTED'
      WHEN 'AVAILABLE' THEN 'AVAILABLE'
      WHEN 'NEGOTIATING' THEN 'NEGOTIATING'
      WHEN 'RENTED' THEN 'RENTED'
      ELSE 'AVAILABLE'
    END::"PropertyStatus"
  ),
  ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';

CREATE UNIQUE INDEX "rental_proposal_open_property_key"
  ON "rental_proposal" ("propertyId")
  WHERE "status" IN ('NOVA', 'ANALISE_CREDITO', 'CONTRATO_EMITIDO', 'ASSINADO');

CREATE INDEX "properties_ownerId_idx" ON "properties" ("ownerId");
CREATE INDEX "rental_proposal_applicantId_idx" ON "rental_proposal" ("applicantId");
CREATE INDEX "rental_proposal_propertyId_idx" ON "rental_proposal" ("propertyId");
CREATE INDEX "rental_proposal_logs_propertyId_idx" ON "rental_proposal_logs" ("propertyId");
CREATE INDEX "rental_proposal_logs_applicantId_idx" ON "rental_proposal_logs" ("applicantId");
