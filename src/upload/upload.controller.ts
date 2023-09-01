import { PostService } from './post.service';
import { UploadService } from './upload.service';
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post-dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly postService: PostService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    createPostDto: CreatePostDto,
  ) {
    await this.uploadService.create(file);

    const post = await this.postService.createPost(file, createPostDto);

    return post;
  }

  @Get()
  async get() {
    return await this.uploadService.getAll();
  }
}
