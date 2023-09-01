import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UploadService } from './upload.service';
import { CreatePostDto } from './dto/create-post-dto';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async createPost(photo: Express.Multer.File, createPostDto: CreatePostDto) {
    const photoUrl = await this.uploadService.create(photo);

    const post = await this.prisma.post.create({
      data: {
        photoUrl,
        description: createPostDto.description,
      },
    });

    return post;
  }
}
