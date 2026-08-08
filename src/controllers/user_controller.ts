import { Request, Response } from "express";
import { UserService } from "../services/user_service";
import { createUserSchema } from "../validators/user_validator";
import { paginationSchema } from "../validators/pagination_validator";

export class UserController {
  private readonly service = new UserService();

  async create(req: Request, res: Response) {
    return res
      .status(201)
      .json(await this.service.create(createUserSchema.parse(req.body)));
  }

  async findAll(req: Request, res: Response) {
    return res
      .status(200)
      .json(await this.service.findAll(paginationSchema.parse(req.query)));
  }
}
