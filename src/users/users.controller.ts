import { Controller, Get, Param, Query, Post, Body, Req, ParseIntPipe, ValidationPipe, Patch } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUSersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user-dto';
import { UsersService } from './providers/users.service';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-user.dto';


@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService
    ) {

    }

    @Get('{/:id}')
    @ApiOperation({
        summary: "fetches a list of registred users on the application",
    })
    @ApiResponse({
        status: 200,
        description: 'users fetched successfully based on the query'
    })
    @ApiQuery({
        name: 'limit',
        type: 'number',
        required: false,
        description: 'the number of entries returned per query',
        example: 10,
    })
    @ApiQuery({
        name: 'page',
        type: 'number',
        required: false,
        description: 'the position of the number that you wants',
        example: 2,
    })
    public getUsers(
        @Param() getUsersPaaramDto: GetUSersParamDto,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('page', ParseIntPipe) page: number,
    ) {

        return this.userService.findAll(getUsersPaaramDto, limit, page)
    }
    @Post()
    public createUsers(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Post('create-many')
    public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
        return this.userService.createMany(createManyUsersDto);
    }

    @Patch()
    public patchUser(@Body() patchUserDto: PatchUserDto) {
        return patchUserDto;
    }
}

