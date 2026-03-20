import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user.interface';

@Injectable()
export class RefreshTokensProvider {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly generateTokensProvider: GenerateTokensProvider
    ) { }
    public async refreshTokens(refreshTokenDto: RefreshTokenDto) {


        try {

            const { sub } = await this.jwtService.verifyAsync<Pick<ActiveUserData, 'sub'>>(refreshTokenDto.refreshToken, {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer
            })

            const user = await this.usersService.findById(sub)

            return await this.generateTokensProvider.generatedTokens(user)
        } catch (error) {
            throw new UnauthorizedException(error)
        }



    }
}
