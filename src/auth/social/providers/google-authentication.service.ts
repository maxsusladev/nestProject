import { Injectable } from '@nestjs/common';
import { Controller, forwardRef, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from "google-auth-library"
import jwtConfig from 'src/auth/config/jwt.config';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { GoogleTokenDto } from '../dots/google.token.dto';


@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
    private oauthClient: OAuth2Client

    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly generateTokensProvider: GenerateTokensProvider
    ) { }

    onModuleInit() {
        const clientId = this.jwtConfiguration.googleClientId
        const clientSecret = this.jwtConfiguration.googleClientSecret
        this.oauthClient = new OAuth2Client(clientId, clientSecret)
    }

    public async authentication(googleTokenDto: GoogleTokenDto) {
        const loginTicket = await this.oauthClient.verifyIdToken({
            idToken: googleTokenDto.token,
        })

        const payload = loginTicket.getPayload()
        if (!payload) {
            throw new Error("Ivalid Google token!")
        }

        const {
            email,
            sub: googleId,
            given_name: firstName,
            family_name: lastName,
        } = payload
        const user = await this.usersService.findOneByGoogleId(googleId)

        if (user) {
            return this.generateTokensProvider.generatedTokens(user)
        }

        if (!email || !googleId) {
            throw new Error("Invalid Google payload")
        }

        const newUser = await this.usersService.createGoogleUser({
            email,
            firstName: firstName ?? " ",
            lastName: lastName ?? " ",
            googleId

        })
        if (!newUser) {
            throw new Error("Problem connecction please try again")
        }


        return this.generateTokensProvider.generatedTokens(newUser)

    }
}
