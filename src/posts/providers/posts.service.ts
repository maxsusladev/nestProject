import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-posts.dto';


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


        if (createPostDto.tags) {
            tags = await this.tagsService.findultipleTAgs(createPostDto.tags)
        }
        if (author) {
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

    public async update(patchPostDto: PatchPostDto) {
        let tags;
        let post;

        try {
            tags = await this.tagsService.findultipleTAgs(patchPostDto.tags ?? [])
        } catch (error) {
            throw new RequestTimeoutException("Unable to process your request at the moment please try again later")
        }

        if (!tags || tags.lengs !== patchPostDto.tags?.length) {
            throw new BadRequestException("Please check your tags id's and ensure they are correct")
        }

        try {
            post = await this.postsRepositiry.findOneBy({ id: patchPostDto.id })
        } catch (error) {
            throw new RequestTimeoutException("Unable to process your request at the moment please try again later")
        }

        if (!post) {
            throw new BadRequestException(`Post with id ${patchPostDto.id} not found`)
        }

        Object.assign(post, {
            title: patchPostDto.title ?? post.title,
            content: patchPostDto.content ?? post.content,
            status: patchPostDto.status ?? post.status,
            postType: patchPostDto.postType ?? post.postType,
            slug: patchPostDto.slug ?? post.slug,
            schema: patchPostDto.schema ?? post.schema,
            featuredImageUrl: patchPostDto.featuredImageUrl ?? post.featuredImageUrl,
            publishOn: patchPostDto.publishOn ?? post.publishOn,
        })


        try {
            await this.postsRepositiry.save(post)
        } catch (error) {
            throw new RequestTimeoutException("Unable to process your request at the moment please try again later")
        }
        return post
    }
}
