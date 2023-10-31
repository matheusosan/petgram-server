import { ConflictException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/http/database/prisma.service';

import { Request } from 'express';

import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { decode_token } from 'src/utils/decode_token';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(data: CreateUserDto) {
    const { email, password, username } = data;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email,

        OR: [{ username }],
      },
    });

    if (userAlreadyExists) {
      throw new ConflictException('Usuário e/ou email já cadastrado');
    }

    const createdUser = await this.prisma.user.create({
      data: {
        email,
        password: hashPassword,
        username,
      },
    });

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async findById(req: Request) {
    const token = req.header('authorization');
    const { id } = decode_token(token);

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return {
      ...user,
      password: undefined,
    };
  }
}
