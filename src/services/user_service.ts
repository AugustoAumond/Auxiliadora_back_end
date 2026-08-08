import bcrypt from "bcryptjs";
import { AppError } from "../errors/app_error";
import { CreateUserDTO, UserRepository } from "../repositories/user_repository";
import { Pagination } from "../types/pagination";

export class UserService {
  private readonly repository = new UserRepository();

  async create(data: CreateUserDTO) {
    const userExists = await this.repository.findByEmail(data.email);

    if (userExists) {
      throw new AppError("Usuário já cadastrado", 409);
    }

    return this.repository.create({
      ...data,
      password: await bcrypt.hash(data.password, 12),
    });
  }

  async findAll(pagination: Pagination) {
    return this.repository.findAll(pagination);
  }
}
