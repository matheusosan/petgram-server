import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UploadService } from 'src/http/upload/upload.service';
import { PrismaService } from 'src/http/database/prisma.service';

@Module({
  controllers: [PostController],
  providers: [PostService, UploadService, PrismaService],
})
export class PostModule {}
