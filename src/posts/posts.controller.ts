import { Controller, Get, Param, Post, Body, Patch, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-posts.dto';
import { GetPostsDto } from './dtos/get-post.dto';
import { ActiveUser } from 'src/auth/decorators/active-user-data.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) { }

    @Get()
    public getPosts(
        @Param('userId') userId: number,
        @Query() postQuery: GetPostsDto
    ) {
        return this.postsService.findAll(postQuery, userId)
    }

    @ApiOperation({
        summary: "Creates a new blog posts"
    })
    @ApiResponse({
        status: 201,
        description: " You get a 201 response if you post is created successfully"
    })
    @Post()
    public createPost(@Body() createPostDto: CreatePostDto, @ActiveUser() user: ActiveUserData) {
        return this.postsService.createPost(createPostDto, user)
    }

    @Delete()
    public deletePost(@Query('id', ParseIntPipe) id: number) {
        return this.postsService.deletePost(id)
    }



    @ApiOperation({
        summary: "Update a new blog posts"
    })
    @ApiResponse({
        status: 200,
        description: " You get a 200 response if you post is updated successfully"
    })

    @Patch()
    public updatePost(@Body() patchPostsDto: PatchPostDto) {
        return this.postsService.update(patchPostsDto)
    }

}
