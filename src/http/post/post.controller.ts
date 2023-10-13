import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Public } from 'src/decorators/is-public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post-dto';
import { UploadService } from 'src/http/upload/upload.service';

@Controller('post')
export class PostController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly postService: PostService,
  ) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    await this.uploadService.create(file);
    await this.postService.createPost(file, createPostDto);
  }

  @Public()
  @Get()
  async get() {
    return await this.postService.getAll();
  }
}
