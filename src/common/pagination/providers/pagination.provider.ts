import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from "@nestjs/core"
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
    constructor(
        @Inject(REQUEST)
        private readonly request: Request,
    ) { }
    public async paginateQuery<T extends ObjectLiteral>(
        paginateQuery: PaginationQueryDto,
        repository: Repository<T>,
    ): Promise<Paginated<T>> {
        const page = paginateQuery.page ?? 1
        const limit = paginateQuery.limit ?? 10
        let results = await repository.find({
            take: limit,
            skip: (page - 1) * limit
        })

        const baseURL = this.request.protocol + '://' + this.request.headers.host + "/";
        const newUrl = new URL(this.request.url, baseURL);

        const totalItems = await repository.count()
        const totalPages = Math.ceil(totalItems / limit)
        const nextPage = page === totalPages ? page : page + 1
        const previousPage = page === 1 ? page : page - 1

        const finalResponse: Paginated<T> = {
            data: results,
            meta: {
                itemsPerPage: limit,
                totalItems: totalItems,
                currentPage: page,
                totalPages: totalPages
            },
            links: {
                first: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=1`,
                last: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPages}`,
                current: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${page}`,
                next: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPage}`,
                previous: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${previousPage}`,
            }
        }

        return finalResponse;
    }
}
