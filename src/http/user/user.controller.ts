import { Controller, Post, Body, Get, Param, Req } from '@nestjs/common';
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

  @Get('find')
  async getUserByCookie(@Req() req: Request) {
    return await this.userService.getUserByCookie(req);
  }

  @Public()
  @Get('')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get('posts/:id')
  async getUserWithPosts(@Param('id') id: number) {
    return await this.userService.getUserWithPosts(id);
  }
}
