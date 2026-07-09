import { Request, Response } from "express";
import { UserService } from "../services/user_service";
import { createUserSchema } from "../validators/user_validator";
import { RentalProposalMachine } from "../state_machine/state_machine";
import { RentalProposalAction, RentalProposalStatus } from "../state_machine/states";
import { prisma } from "../database/prisma";

export class UserController {

    private UserService: UserService;

    constructor() {
        this.UserService = new UserService();
    }


    async create(req: Request, res: Response) {
         const data = createUserSchema.parse(req.body);

        const user = await this.UserService.create(data);

        return res.status(201).json(user);
    }

    async findAll(req: Request, res: Response) {
        const users = await this.UserService.findAll();

        return res.status(200).json(users);
    }

}