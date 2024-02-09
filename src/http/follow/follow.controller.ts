import { Controller, Get, Param, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { FollowService } from './follow.service';

@Controller('')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Put('follow/:id')
  async follow(@Param('id') id: string, @Req() req: Request) {
    await this.followService.follow(id, req);
  }

  @Put('unfollow/:id')
  async unfollow(@Param('id') id: string, @Req() req: Request) {
    await this.followService.unfollow(id, req);
  }

  @Get('followers/:id')
  async getFollowers(@Param('id') id: string) {
    return await this.followService.getFollowers(id);
  }
}
