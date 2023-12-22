import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './http/user/user.module';
import { AuthModule } from './http/auth/auth.module';
import { PostModule } from './http/post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    PostModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
