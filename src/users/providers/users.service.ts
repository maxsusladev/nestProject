import { Injectable, Inject, forwardRef, RequestTimeoutException, BadRequestException } from "@nestjs/common";
import { GetUSersParamDto } from "../dtos/get-users-param.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { DataSource, Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ConfigType } from "@nestjs/config";
import profileConfig from "../config/profile.config";
import { UsersCreateManyProvider } from "./users-create-many.provider";
import { CreateManyUsersDto } from "../dtos/create-many-user.dto";
import { CreateUserProvider } from "./create-user.provider";
import { FindOneUserByEmailProvider } from "./find-one-user-by-emai.provider";
import { FindOneByGoogleIdProvider } from "./find-one-by-google-id.provider";
import { CreateGoogleUserProvider } from "./create-google-user.provider";
import { GoogleUser } from "../interfaces/google-user.interface";

/**
 * Class to content to Users table and perform buisness operation
 */
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        private readonly usersCreateManyProvider: UsersCreateManyProvider,

        private readonly createUserProvider: CreateUserProvider,
        private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,


        private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,

        private readonly createGoogleUserProvider: CreateGoogleUserProvider,

    ) { }
    public async createUser(createUserDto: CreateUserDto) {
        return this.createUserProvider.createUser(createUserDto);
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
    public async findOneByEmail(email: string) {

        return await this.findOneUserByEmailProvider.findOneByEmail(email)
    }

    public async findOneByGoogleId(googleId: string) {
        return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId)

    }

    public async createGoogleUser(googleUser: GoogleUser) {
        return await this.createGoogleUserProvider.createGoogleUser(googleUser)
    }


}