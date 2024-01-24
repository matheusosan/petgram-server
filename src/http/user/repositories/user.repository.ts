import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string, username: string, hashPassword: string) {
    try {
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
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException('Usuário já existe.');
        }
      }
      throw new Error('Ocorreu um erro: ' + e);
    }
  }

  async getAll() {
    try {
      const allUsers = await this.prisma.user.findMany({
        select: {
          id: true,
          username: true,
        },
      });

      return allUsers;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Dados não encontrados.');
        }
      }
      throw new Error('Ocorreu um erro: ' + e);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }

  async findByUsername(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username,
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

  async getUserAndPosts(id: number) {
    const userId = Number(id);

    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
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
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Usuário não encontrado.');
        }
      }
      throw new Error('Ocorreu um erro: ' + e);
    }
  }
}
