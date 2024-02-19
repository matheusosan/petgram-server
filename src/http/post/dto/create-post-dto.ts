import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  description?: string;

  photoUrl: string;
}
