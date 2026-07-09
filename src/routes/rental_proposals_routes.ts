import { Router } from "express";
import { RentalProposalsController } from "../controllers/rental_proposals_controller";


const router = Router();

const rentalProposalsController = new RentalProposalsController();

router.post("/rental_proposals", rentalProposalsController.create.bind(rentalProposalsController));

router.get("/rental_proposals", rentalProposalsController.findAll.bind(rentalProposalsController));

router.get("/rental_proposals/logs", rentalProposalsController.findAllLogs.bind(rentalProposalsController));

router.patch("/rental_proposals/:id/status", rentalProposalsController.updateStatus.bind(rentalProposalsController)
);


export default router;