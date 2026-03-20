import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { User } from 'src/users/user.entity';

@Injectable()
export class SignInProvider {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly hasingProvider: HashingProvider,
        private readonly generateTokensProvider: GenerateTokensProvider
    ) { }
    public async signIn(signInDto: SignInDto) {
        let user = await this.usersService.findOneByEmail(signInDto.email)


        let isEqual: boolean = false;

        try {
            isEqual = await this.hasingProvider.comparePassword(
                signInDto.password,
                user.password,
            );

        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: "Coud not compare passwords"
            })
        }

        if (!isEqual) {
            throw new UnauthorizedException(" Incorrect password")
        }


        return this.generateTokensProvider.generatedTokens(user)
    }
}
