import { Request, Response } from "express";

import { RentalProposalsService } from "../services/rental_proposals_service";
import { createRenatalProposalsSchema } from "../validators/rental_proposals_validator";
import { RentalProposalAction } from "../state_machine/states";

export class RentalProposalsController {

    private RentalProposalsService: RentalProposalsService;
    private service: RentalProposalsService;

    constructor() {
        this.RentalProposalsService = new RentalProposalsService();
        this.service = new RentalProposalsService();
    }

    async updateStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { action } = req.body;


        const proposal = await this.service.updateStatus(
            id as string,
            action as RentalProposalAction
        );


        return res.status(200).json(proposal);
    }

    async create(req: Request, res: Response) {
        const data = createRenatalProposalsSchema.parse(req.body);

        const rentalProposals = await this.RentalProposalsService.create(data);

        return res.status(201).json(rentalProposals);
    }

    async findAllLogs(req: Request, res: Response) {

        const users = await this.RentalProposalsService.findAllLogs();

        return res.status(200).json(users);
    }

    async findAll(req: Request, res: Response) {

        const users = await this.RentalProposalsService.findAll();

        return res.status(200).json(users);
    }

}