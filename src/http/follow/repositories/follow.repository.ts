import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/http/database/prisma.service';

@Injectable()
export class FollowRepository {
  constructor(private readonly prisma: PrismaService) {}
  async follow(paramId: string, id: number) {
    const toFollow = Number(paramId);

    const result = await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          id: toFollow,
        },
        data: {
          followedBy: {
            connect: {
              id,
            },
          },
        },
      }),
      this.prisma.user.update({
        where: {
          id,
        },
        data: {
          following: {
            connect: {
              id: toFollow,
            },
          },
        },
      }),
    ]);

    return result;
  }

  async unfollow(paramId: string, id: number) {
    const toUnfollow = Number(paramId);

    const result = await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          id: toUnfollow,
        },
        data: {
          followedBy: {
            disconnect: {
              id,
            },
          },
        },
      }),
      this.prisma.user.update({
        where: {
          id,
        },
        data: {
          following: {
            disconnect: {
              id: toUnfollow,
            },
          },
        },
      }),
    ]);

    return result;
  }

  async getFollowers(paramId: string) {
    const result = await this.prisma.user.findUnique({
      where: {
        id: Number(paramId),
      },
      select: {
        followedBy: {
          select: {
            id: true,
          },
        },
      },
    });

    return result;
  }
}
