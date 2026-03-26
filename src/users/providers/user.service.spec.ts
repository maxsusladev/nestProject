import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-emai.provider';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';


describe('UserService', () => {
    let service: UsersService;

    const mockCreateUserProvider: Partial<CreateUserProvider> = {
        createUser: (createUserDto: CreateUserDto) => Promise.resolve({
            id: 12,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName ?? "",
            email: createUserDto.email,
            password: createUserDto.password

        })
    }
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: DataSource, useValue: {} },
                { provide: getRepositoryToken(User), useValue: {} },
                { provide: CreateGoogleUserProvider, useValue: {} },
                { provide: FindOneByGoogleIdProvider, useValue: {} },
                { provide: FindOneUserByEmailProvider, useValue: {} },
                { provide: CreateUserProvider, useValue: mockCreateUserProvider },
                { provide: UsersCreateManyProvider, useValue: {} },

            ]
        }).compile();


        service = module.get<UsersService>(UsersService)
    });



    it('Shoud be defined', () => {
        expect(service).toBeDefined()
    });

    describe('createUser', () => {
        it('shoud be defined', () => {
            expect(service.createUser).toBeDefined()
        })
        it("shoud call crateUser on CreateUserProvider", async () => {
            let user = await service.createUser({
                firstName: "John",
                lastName: "Doe",
                email: "jonDoe@email.com",
                password: "password"
            })

            expect(user.firstName).toEqual("John")
        })
    })

});
