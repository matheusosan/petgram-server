import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { S3Service } from '../s3/s3.service';
import { CreatePostDto } from './dto/create-post-dto';
import { decode_token } from 'src/utils/decode_token';
import { PostRepository } from './repositories/post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly uploadService: S3Service,
  ) {}

  async createPost(
    photo: Express.Multer.File,
    createPostDto: CreatePostDto,
    req: Request,
  ) {
    const { id } = decode_token(req.cookies.access_token);
    const { description } = createPostDto;
    const { filename, url } = await this.uploadService.create(photo);

    return await this.postRepository.create(filename, url, description, id);
  }

  async getAll() {
    return await this.postRepository.getAllPosts();
  }

  async deleteById(id: string) {
    await this.postRepository.deletePost(id);
  }
}
