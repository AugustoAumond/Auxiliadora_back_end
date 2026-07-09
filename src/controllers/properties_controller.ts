import { Request, Response } from "express";
import { PropertiesService } from "../services/properties_service";
import { createPropertiesSchema } from "../validators/properties_validator";

export class PropertiesController {

    private PropertiesService: PropertiesService;

    constructor() {
        this.PropertiesService = new PropertiesService();
    }


    async create(req: Request, res: Response) {
        const data = createPropertiesSchema.parse(req.body);

        const properties = await this.PropertiesService.create(data);

        return res.status(201).json(properties);

    }

    async findAll(req: Request, res: Response) {

        const properties = await this.PropertiesService.findAll();

        return res.status(200).json(properties);

    }

}