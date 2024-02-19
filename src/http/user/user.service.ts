import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { decode_token } from '../../utils/decode_token';
import { hash_password } from './../../utils/hash-password';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserDto) {
    const { email, password, username } = data;
    const { hashPassword } = await hash_password(password);

    const userExists = await this.userRepository.userExists(username, email);

    if (userExists) {
      throw new ConflictException('Usuário ou email já cadastrado');
    }

    await this.userRepository.create(email, username, hashPassword);
    return;
  }

  async getAllUsers() {
    const allUsers = await this.userRepository.getAll();

    if (allUsers.length === 0) {
      throw new NotFoundException('Não há usuários cadastros.');
    }

    return allUsers;
  }

  async findByUsername(username: string) {
    if (username.length < 3) {
      throw new BadRequestException(
        'Digite ao menos 3 caracteres para realizar busca.',
      );
    }
    const users = await this.userRepository.findByUsername(username);

    if (users.length === 0) {
      throw new NotFoundException(
        `Usuário com username '${username}' não encontrado.`,
      );
    }

    return users;
  }

  async getUserByCookie(req: Request) {
    const { id } = decode_token(req.cookies.access_token);

    return await this.userRepository.findAuthenticatedUser(id);
  }

  async getUserWithPosts(id: number) {
    const user = await this.userRepository.getUserAndPosts(id);

    return user;
  }
}
