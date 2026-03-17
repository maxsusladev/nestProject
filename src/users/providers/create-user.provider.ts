import { BadRequestException, forwardRef, ForwardReference, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateUserProvider {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,


        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider
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

        let newUser = this.usersRepository.create({
            ...createUserDto,
            password: await this.hashingProvider.hashPassword(createUserDto.password)

        })

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
}
function inject(arg0: ForwardReference<any>): (target: typeof CreateUserProvider, propertyKey: undefined, parameterIndex: 1) => void {
    throw new Error('Function not implemented.');
}

