import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  description?: string;
  @IsNotEmpty()
  @IsNumber()
  authorId: number;

  photoUrl: string;
}
