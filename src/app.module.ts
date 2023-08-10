import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PostsModule, AuthModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
