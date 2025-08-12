import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';


@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagsRepository: Repository<Tag>
    ){}


    public async create(createTagDto: CreateTagDto) {

        let tag = this.tagsRepository.create(createTagDto)
        return await this.tagsRepository.save(tag)
    }


    public async findultipleTAgs(tags: number[]){
        let results = await this.tagsRepository.find({
            where: {
                id: In(tags)
            }
        });

        return results;
    }
}
