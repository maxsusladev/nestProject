import { IsArray, IsEnum, IsInt, IsISO8601, IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength, ValidateNested } from "class-validator";
import { postType } from "../enums/post.Type.enum";
import { postStatus } from "../enums/postStatus.enum";
import { CreatePostMetaOPtionsDto } from "../../meta-options/dtos/create-post-meta-options.dto";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty({
        example: " This is a title",
        title: "This is the title for blog post"
    })
    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    @MaxLength(512)
    title: string;

    @ApiProperty({
        enum: postType,
        example: " This is a Posttype",
        description: " Possiblevalues : 'post','page', 'story', 'series' "
    })
    @IsEnum(postType)
    @IsNotEmpty()
    postType: postType;


    @ApiProperty({
        example: " my-blog-post",
        description: "my-url"
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(256)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
      })
    slug: string;


    @ApiProperty({
        enum: postStatus,
        description: " Possiblevalues : 'draft','sheduled, 'review', 'published"
    })
    @IsEnum(postStatus)
    @IsNotEmpty()
    status: postStatus;


    
    @ApiPropertyOptional({
        description: " Shoud be some content here"
    })
    @IsString()
    @IsOptional()
    content?: string;


    @ApiProperty({
        description: "Serialize your JSON object",
        example: "{\r\n    \"@context\": \"https:\/\/schema.org\",\r\n    \"@type\": \"Person\"\r\n  }"
    })
    @IsOptional()
    @IsJSON()
    schema: string;


    @ApiPropertyOptional({
        description: "Image for your blog post",
        example: "http://localhost.com/images/image1.jpg"
    })
    @IsOptional()
    @IsUrl()
    @MaxLength(1024)
    featuredImageUrl?: string;


    @ApiPropertyOptional({
        description: "The date",
        example: "2024-03-16T07:46:32+0000",

    })
    @IsISO8601()
    @IsOptional()
    publishOn?: Date;


    @ApiPropertyOptional({
        description: " Arrey of tags ",
        example: [1,2]
    })
    @IsOptional()
    @IsInt({each: true})
    @IsArray()
    tags?: number[];

   // @ApiPropertyOptional({
      //  type: 'object',
        //required: false,
        //items: {
        //  type: 'object',
        //  properties: {
         //   metavalue: {
           //   type: 'json',
           //   description: 'The metaValue is a JSON string',
             // example: '{"sidebarEnabled": true,}',
          //  },
         // },
       //},
     // })
    @IsOptional()
    @ValidateNested({each: true})
    @Type(()=> CreatePostMetaOPtionsDto)
    metaOptions?: CreatePostMetaOPtionsDto | null;


    @ApiProperty({
        type: 'integer',
        required: true,
        example: 1
    })
    @IsInt()
    @IsNotEmpty()
    authorId: number;
}