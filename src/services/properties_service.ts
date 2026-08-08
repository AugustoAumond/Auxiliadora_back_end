import { AppError } from "../errors/app_error";
import {
  CreateProperties,
  PropertiesRepository,
} from "../repositories/properties_repository";
import { UserRepository } from "../repositories/user_repository";
import { Pagination } from "../types/pagination";

export class PropertiesService {
  private readonly repository = new PropertiesRepository();
  private readonly users = new UserRepository();

  async create(ownerId: string, data: CreateProperties) {
    if (!(await this.users.findById(ownerId))) {
      throw new AppError("Usuário não existe", 404);
    }

    return this.repository.create(ownerId, data);
  }

  async findAll(pagination: Pagination) {
    return this.repository.findAll(pagination);
  }
}
