import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { GetUSersParamDto } from "../dtos/get-users-param.dto";
import { AuthService } from "src/auth/provider/auth.service";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ConfigType } from "@nestjs/config";
import profileConfig from "../config/profile.config";

/**
 * Class to content to Users table and perform buisness operation
 */
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,


        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        @Inject(profileConfig.KEY)
        private readonly profileConfiguration: ConfigType<typeof profileConfig>
    ) { }


    public async createUser(createUserDto: CreateUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email }
        })

        let newUser = this.usersRepository.create(createUserDto)
        newUser = await this.usersRepository.save(newUser)

        return newUser;
    }


    public findAll(
        getUsersPaaramDto: GetUSersParamDto,
        limit: number,
        page: number,

    ) {

        const isAuth = this.authService.isAuth()
        console.log(this.profileConfiguration)
        return [
            {
                firstName: 'john',
                email: "jouen@email.com"

            },
            {
                firstName: 'Conor',
                email: "Conor@email.com"

            }
        ]
    }


    public async findById(id: number) {

        return await this.usersRepository.findOneBy({
            id,
        })



    }
}