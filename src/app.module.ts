import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './http/user/user.module';
import { AuthModule } from './http/auth/auth.module';
import { PostModule } from './http/post/post.module';
import { FollowModule } from './http/follow/follow.module';
import { PrismaModule } from './http/database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    FollowModule,
    AuthModule,
    PostModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
