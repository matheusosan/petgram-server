import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/http/database/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreatePostDto } from './dto/create-post-dto';
import { decode_token } from 'src/utils/decode_token';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async createPost(
    photo: Express.Multer.File,
    createPostDto: CreatePostDto,
    req: Request,
  ) {
    const token = req.header('authorization');
    const { filename, url } = await this.uploadService.create(photo);
    const { id } = decode_token(token);

    console.log(id);

    const post = await this.prisma.post.create({
      data: {
        filename,
        photoUrl: url,
        description: createPostDto.description,
        authorId: Number(id),
      },
    });

    return post;
  }

  async getAll() {
    const data = await this.prisma.post.findMany({
      select: {
        id: true,
        description: true,
        filename: true,
        photoUrl: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    return data;
  }
}
