import { Request, Response } from "express";
import { RentalProposalsService } from "../services/rental_proposals_service";
import {
  createRentalProposalsSchema,
  idParamSchema,
  updateRentalProposalStatusSchema,
} from "../validators/rental_proposals_validator";
import { paginationSchema } from "../validators/pagination_validator";

export class RentalProposalsController {
  private readonly service = new RentalProposalsService();

  async create(req: Request, res: Response) {
    const data = createRentalProposalsSchema.parse(req.body);
    const proposal = await this.service.create(req.auth!.sub, data);
    return res.status(201).json(proposal);
  }

  async updateStatus(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const { action } = updateRentalProposalStatusSchema.parse(req.body);
    const proposal = await this.service.updateStatus(id, action, req.auth!.sub);
    return res.status(200).json(proposal);
  }

  async findAll(req: Request, res: Response) {
    const pagination = paginationSchema.parse(req.query);
    return res
      .status(200)
      .json(await this.service.findAll(req.auth!.sub, pagination));
  }

  async findAllLogs(req: Request, res: Response) {
    const pagination = paginationSchema.parse(req.query);
    return res
      .status(200)
      .json(await this.service.findAllLogs(req.auth!.sub, pagination));
  }
}
