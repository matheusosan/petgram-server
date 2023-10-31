import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { Response, Request } from 'express';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/http/database/prisma.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(response: Response, request: Request) {
    const { email, password } = request.body;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

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
      secure: true,
      domain: '.localhost',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    return;
  }
}
