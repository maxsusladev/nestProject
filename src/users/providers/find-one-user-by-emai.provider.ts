import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
    constructor(
        @InjectRepository(User)
        private readonly usersReposity: Repository<User>
    ) { }


    public async findOneByEmail(email: string) {
        let user: User | null = null;

        try {
            user = await this.usersReposity.findOneBy({
                email: email
            })

        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: "Could not found current user"
            })
        }

        if (!user) {
            throw new UnauthorizedException("User does not exist")
        }

        return user
    }
}
