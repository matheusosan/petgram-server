import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post-dto';
import { UploadService } from 'src/http/upload/upload.service';
import { Public } from 'src/decorators/is-public.decorator';
import { Request } from 'express';

@Controller('post')
export class PostController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly postService: PostService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
  ) {
    await this.uploadService.create(file);
    await this.postService.createPost(file, createPostDto, req);
  }

  @Public()
  @Get()
  async get() {
    return await this.postService.getAll();
  }
}
