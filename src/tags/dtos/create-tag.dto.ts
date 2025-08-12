import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength, IsString, Matches, IsOptional, IsJSON, IsUrl } from "class-validator";


export class CreateTagDto {

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(256)
    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(256)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
            'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
    })
    slug: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;  

    @ApiPropertyOptional()
    @IsOptional()
    @IsJSON()
    schema?: string;


    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    @MaxLength(1024)
    featuredImageUrl?: string;
    
}