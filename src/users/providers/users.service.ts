import { Injectable, Inject, forwardRef, RequestTimeoutException, BadRequestException } from "@nestjs/common";
import { GetUSersParamDto } from "../dtos/get-users-param.dto";
import { AuthService } from "src/auth/provider/auth.service";
import { DataSource, Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ConfigType } from "@nestjs/config";
import profileConfig from "../config/profile.config";
import { UsersCreateManyProvider } from "./users-create-many.provider";
import { CreateManyUsersDto } from "../dtos/create-many-user.dto";

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
        private readonly profileConfiguration: ConfigType<typeof profileConfig>,

        private readonly usersCreateManyProvider: UsersCreateManyProvider,
    ) { }
    public async createUser(createUserDto: CreateUserDto) {

        let existingUser;

        try {
            existingUser = await this.usersRepository.findOne({
                where: { email: createUserDto.email }
            })
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to procces your request at the moment pls try again later',
                {
                    description: "Error connecting to the database!"
                })

        }
        if (existingUser) {
            throw new BadRequestException(
                "The user already exist, please check you email"
            )
        }

        let newUser = this.usersRepository.create(createUserDto)

        try {
            newUser = await this.usersRepository.save(newUser)
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to procces your request at the moment pls try again later',
                {
                    description: "Error connecting to the database!"
                })
        }


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
        let user;
        try {
            user = await this.usersRepository.findOneBy({ id })
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to procces your request at the moment pls try again later',
                {
                    description: "Error connecting to the database!"
                })
        }

        if (!user) {
            throw new BadRequestException("The user does not exist")
        }
        return user
    }

    public async createMany(createManyUsersDto: CreateManyUsersDto) {
        return await this.usersCreateManyProvider.createMany(createManyUsersDto)

    }


}