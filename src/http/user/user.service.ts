import { ConflictException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';

import { Request } from 'express';

import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { decode_token } from 'src/utils/decode_token';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: CreateUserDto) {
    const { email, password, username } = data;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    return await this.userRepository.create(email, username, hashPassword);
  }

  async findById(req: Request) {
    const { id } = decode_token(req.cookies.access_token);

    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      return {
        ...user,
        password: undefined,
      };
    } catch (e) {
      throw e;
    }
  }

  async getUserWithPosts(req: Request) {
    const { id } = decode_token(req.cookies.access_token);

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        username: true,
        id: true,
        posts: {
          select: {
            description: true,
            id: true,
            photoUrl: true,
          },
        },
      },
    });

    return user;
  }
}
