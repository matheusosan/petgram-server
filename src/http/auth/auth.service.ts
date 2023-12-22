import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { Response } from 'express';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from '../user/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(response: Response, loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches || email !== user.email) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
    };

    const access_token = await this.jwtService.signAsync(payload);

    response.cookie('access_token', access_token, {
      httpOnly: true,
      domain: '.localhost',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    return;
  }
}
