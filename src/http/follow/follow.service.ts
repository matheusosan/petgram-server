import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { FollowRepository } from './repositories/follow.repository';
import { decode_token } from 'src/utils/decode_token';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository) {}

  async follow(paramId: string, req: Request) {
    const { id } = decode_token(req.cookies.access_token);

    await this.followRepository.follow(paramId, id);

    return;
  }

  async unfollow(paramId: string, req: Request) {
    const { id } = decode_token(req.cookies.access_token);

    await this.followRepository.unfollow(paramId, id);

    return;
  }

  async getFollowers(paramId: string) {
    return await this.followRepository.getFollowers(paramId);
  }
}
