import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { decode_token } from '../../utils/decode_token';

import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
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

  async getAllUsers() {
    return await this.userRepository.getAll();
  }

  async getUserByCookie(req: Request) {
    const { id } = decode_token(req.cookies.access_token);

    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          username: true,
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

  async getUserWithPosts(id: number) {
    const user = await this.userRepository.getUserAndPosts(id);

    return user;
  }
}
