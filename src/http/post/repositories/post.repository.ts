import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/http/database/prisma.service';
import { S3Service } from 'src/http/s3/s3.service';

@Injectable()
export class PostRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3service: S3Service,
  ) {}

  async create(filename: string, url: string, description: string, id: number) {
    try {
      const post = await this.prisma.post.create({
        data: {
          filename,
          photoUrl: url,
          description,
          authorId: Number(id),
        },
      });
      return post;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Post não encontrado', { cause: e });
        }
      }
      throw e;
    }
  }

  async getAllPosts() {
    try {
      const data = await this.prisma.post.findMany({
        select: {
          id: true,
          description: true,
          filename: true,
          photoUrl: true,
          createdAt: true,
          author: {
            select: {
              username: true,
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return data;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            'Posts não encontrados ou não existentes.',
          );
        }
        throw error;
      }
    }
  }

  async deletePost(id: string) {
    try {
      const postToDelete = await this.prisma.post.delete({
        where: {
          id: parseInt(id),
        },
      });

      await this.s3service.delete(postToDelete.filename);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Post não encontrado', { cause: e });
        }
      }
      throw e;
    }
  }
}
