import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from '../database/prisma.service';
import { User } from './entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

const usersList: User[] = [
  { id: 1, email: 'email1@email.com', username: 'teste1', password: '12345' },
  { id: 2, email: 'email2@email.com', username: 'teste2', password: '12345' },
  { id: 3, email: 'email3@email.com', username: 'teste3', password: '12345' },
];

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        PrismaService,
        UserService,
        UserRepository,
        {
          provide: UserService,
          useValue: {
            getAllUsers: jest.fn().mockResolvedValue(usersList),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    const result = await controller.getAllUsers();

    expect(result).toEqual(usersList);
    expect(userService.getAllUsers).toHaveBeenCalled();
  });

  it('should throw an exception', () => {
    jest.spyOn(userService, 'getAllUsers').mockImplementationOnce(() => {
      throw new NotFoundException('Dados não encontrados');
    });

    const result = controller.getAllUsers();

    expect(result).rejects.toThrowError(NotFoundException);
    expect(userService.getAllUsers).toHaveBeenCalled();
  });

  it('should create a new user', async () => {
    const dto: CreateUserDto = {
      email: 'email@email.com',
      password: '12345',
      username: 'test1',
    };
    const createUserSpy = jest
      .spyOn(userService, 'create')
      .mockResolvedValueOnce({ id: 1, ...dto });

    await controller.create(dto);

    expect(createUserSpy).toHaveBeenCalledWith(dto);
    expect(userService.create).toHaveBeenCalled();
  });

  it('should throw a exception if user exists', async () => {
    const dto: User = {
      id: 1,
      password: '12345',
      email: 'test@test.com',
      username: 'test1',
    };

    jest.spyOn(userService, 'create').mockImplementationOnce(() => {
      throw new ConflictException('Usuário já existe.');
    });

    const result = controller.create(dto);

    expect(result).rejects.toThrowError(ConflictException);
    expect(userService.create).toHaveBeenCalled();
  });
});
