import { Router } from "express";
import { RentalProposalsController } from "../controllers/rental_proposals_controller";
import { requireAuth } from "../middlewares/auth_middleware";

const router = Router();

const rentalProposalsController = new RentalProposalsController();

router.post(
  "/rental_proposals",
  requireAuth,
  rentalProposalsController.create.bind(rentalProposalsController),
);

router.get(
  "/rental_proposals",
  requireAuth,
  rentalProposalsController.findAll.bind(rentalProposalsController),
);

router.get(
  "/rental_proposals/logs",
  requireAuth,
  rentalProposalsController.findAllLogs.bind(rentalProposalsController),
);

router.patch(
  "/rental_proposals/:id/status",
  requireAuth,
  rentalProposalsController.updateStatus.bind(rentalProposalsController),
);

export default router;
