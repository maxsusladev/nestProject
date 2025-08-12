import { Controller, Get, Param, Post, Body, Patch, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-posts.dto';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService 
    ){}

    @Get()
    public getPosts(@Param('userId') userId: number){
        console.log('ssss')
        return this.postsService.findAll(userId)
    }
    
    @ApiOperation({
        summary: "Creates a new blog posts"
    })
    @ApiResponse({
        status: 201,
        description: " You get a 201 response if you post is created successfully"
    })
    @Post()
    public createPost(@Body() createPostDto: CreatePostDto){
       return this.postsService.createPost(createPostDto)
    }

    @Delete()
    public deletePost(@Query('id', ParseIntPipe) id:number) {
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
        public updatePost(@Body() patchPostsDto: PatchPostDto){
                console.log(patchPostsDto)
        }
    
}
