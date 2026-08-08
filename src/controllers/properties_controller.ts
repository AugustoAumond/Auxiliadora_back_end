import { Request, Response } from "express";
import { PropertiesService } from "../services/properties_service";
import { createPropertiesSchema } from "../validators/properties_validator";
import { paginationSchema } from "../validators/pagination_validator";

export class PropertiesController {
  private readonly service = new PropertiesService();

  async create(req: Request, res: Response) {
    const data = createPropertiesSchema.parse(req.body);
    return res.status(201).json(await this.service.create(req.auth!.sub, data));
  }

  async findAll(req: Request, res: Response) {
    return res
      .status(200)
      .json(await this.service.findAll(paginationSchema.parse(req.query)));
  }
}
