import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [UploadModule, ConfigModule.forRoot({ isGlobal: true }), UserModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
