import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string, username: string, hashPassword: string) {
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

  async userExists(username: string, email: string) {
    return await this.prisma.user.findUnique({
      where: {
        username,

        OR: [{ email }],
      },
    });
  }

  async getAll() {
    const allUsers = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
    });

    return allUsers;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async findByUsername(username: string) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: username,
            },
          },
          {
            username: {
              contains: username.charAt(0).toUpperCase() + username.slice(1),
            },
          },
          {
            username: {
              contains: username.charAt(0).toLowerCase() + username.slice(1),
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
      },
      take: 5,
    });

    return users;
  }

  async findAuthenticatedUser(id: number) {
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
          followedBy: {
            select: {
              username: true,
              id: true,
            },
          },
          following: {
            select: {
              username: true,
              id: true,
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
