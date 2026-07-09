import { AppError } from "../errors/app_error";
import { CreateProperties, PropertiesRepository } from "../repositories/properties_repository";
import { UserRepository } from "../repositories/user_repository";


export class PropertiesService {
    private repository: PropertiesRepository;
    private users: UserRepository;



    constructor() {
        this.repository = new PropertiesRepository();
        this.users = new UserRepository();
    }

    //O ideal seria trabalhar com o JWT pegando o usuário do token, porém farei dessa forma para agilizar o desenvolvimento;
    async create(data: CreateProperties) {
        const userExists = await this.users.findById(data.ownerId);

        if (!userExists) {
            throw new AppError("Usuário não existe no banco de dados!", 400);
        }


        return this.repository.create(data);
    }


    async findAll() {

        return this.repository.findAll();

    }

}