import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';


@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepositiry: Repository<Post>,
        @InjectRepository(MetaOption)
        private postsMetaOptionRepository: Repository<MetaOption>,
        private readonly userService: UsersService,

        private readonly tagsService: TagsService
    ) { }


    public async createPost(createPostDto: CreatePostDto) {

        let author = await this.userService.findById(createPostDto.authorId)
        let post;
        let tags;


        if(createPostDto.tags) {
            tags = await this.tagsService.findultipleTAgs(createPostDto.tags)
        }
        if(author) {
            post = this.postsRepositiry.create({
                ...createPostDto,
                author,
                tags,
            })
        }
        
       
        return await this.postsRepositiry.save(post)
    }


    public async findAll(userId: number) {
        const user = this.userService.findById(userId)
        console.log('ddd')
        let posts = await this.postsRepositiry.find({
           relations: {
            metaOptions: true,
            author: true,
            tags: true
           }

        })
        return posts

    }

    public async deletePost(id: number) {
       
        await this.postsRepositiry.delete(id)

       return {
        id,
        deleted: true
       }
    }
}
