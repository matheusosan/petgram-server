import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Min(3, {
    message: 'O nome de usuário precisa conter no mínimo 3 caractéres.',
  })
  username: string;
  @IsString()
  @IsNotEmpty()
  @Min(5, { message: 'A senha precisa conter no mínimo 5 caractéres.' })
  password: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
