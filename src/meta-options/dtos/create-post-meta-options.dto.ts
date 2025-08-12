import { IsJSON, IsNotEmpty, IsString } from "class-validator";


export class CreatePostMetaOPtionsDto {
    @IsNotEmpty()
    @IsJSON()
    metaValue: string;
}