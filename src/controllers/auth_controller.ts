import { Request, Response } from "express";
import { AuthService } from "../services/auth_service";
import { loginSchema } from "../validators/auth_validator";

export class AuthController {
  private readonly service = new AuthService();

  async login(req: Request, res: Response) {
    const credentials = loginSchema.parse(req.body);
    const result = await this.service.login(credentials);
    return res.status(200).json(result);
  }
}
