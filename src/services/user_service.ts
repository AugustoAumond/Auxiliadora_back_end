import { AppError } from "../errors/app_error";
import { UserRepository } from "../repositories/user_repository";
import crypto from "crypto";

interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}


export function md5(value: string) {
  return crypto
    .createHash("md5")
    .update(value)
    .digest("hex");
}


export class UserService {

    private repository: UserRepository;


    constructor() {
        this.repository = new UserRepository();
    }


    async create(data: CreateUserDTO) {

        const userExists = await this.repository.findByEmail(data.email);

        if (userExists) {
            throw new AppError("Usuário já cadastrado!", 400);
        }

        data.password = md5(data.password);

        return this.repository.create(data);
    }


    async findAll() {
        return this.repository.findAll();
    }

}