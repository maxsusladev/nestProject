import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.entity';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class CreatePostProvider {
    constructor(
        @InjectRepository(Post)
        private postsRepositiry: Repository<Post>,
        private readonly userService: UsersService,
        private readonly tagsService: TagsService,
    ) { }
    public async createPost(createPostDto: CreatePostDto, user: ActiveUserData) {
        let author
        let tags;
        try {
            author = await this.userService.findById(user.sub)
            if (createPostDto.tags) {
                tags = await this.tagsService.findultipleTAgs(createPostDto.tags)
            }

        } catch (error) {
            throw new ConflictException(error)
        }
        console.log(createPostDto.tags, tags)
        if (createPostDto.tags?.length !== tags.length) {
            throw new BadRequestException("Please check your tag Ids")
        }

        let post = this.postsRepositiry.create({
            ...createPostDto,
            author,
            tags,
        })

        try {
            return await this.postsRepositiry.save(post)
        } catch (error) {
            throw new ConflictException("error", {
                description: "Ensure post slug is unique and not a duplicate"
            })
        }
    }
}
