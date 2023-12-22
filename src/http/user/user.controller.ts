import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/decorators/is-public.decorator';

import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('create')
  async create(@Body() data: CreateUserDto) {
    return await this.userService.create(data);
  }

  @Get('')
  async findById(@Req() req: Request) {
    return await this.userService.findById(req);
  }

  @Get('posts')
  async getUserWithPosts(@Req() req: Request) {
    return await this.userService.getUserWithPosts(req);
  }
}
