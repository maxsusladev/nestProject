import { IsOptional, IsInt } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetUSersParamDto {
    @ApiPropertyOptional({
        description: 'get user with specific id',
        example: 1234
    })
    @IsOptional()
    @IsInt()
    @Type(()=> Number)
    id?: number;
}