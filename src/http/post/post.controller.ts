import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post-dto';
import { S3Service } from '../s3/s3.service';
import { Request } from 'express';

@Controller('post')
export class PostController {
  constructor(
    private readonly uploadService: S3Service,
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

  @Get()
  async get() {
    return await this.postService.getAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.postService.deleteById(id);
  }
}
