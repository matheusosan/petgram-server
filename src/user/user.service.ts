import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const { email, password, username } = data;

    return await this.prisma.user.create({
      data: {
        email,
        password,
        username,
      },
    });
  }
}
