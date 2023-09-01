import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaService } from 'src/database/prisma.service';
import { PostService } from './post.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, PrismaService, PostService],
})
export class UploadModule {}
