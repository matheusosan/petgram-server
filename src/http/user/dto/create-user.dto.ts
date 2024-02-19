import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
