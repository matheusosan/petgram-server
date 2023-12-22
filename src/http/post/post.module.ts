import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { S3Service } from 'src/http/s3/s3.service';
import { PrismaService } from 'src/database/prisma.service';
import { PostRepository } from './repositories/post.repository';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository, S3Service, PrismaService],
})
export class PostModule {}
