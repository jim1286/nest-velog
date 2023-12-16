import { IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}

export class UpdateDto {
  @IsString()
  title?: string;

  @IsString()
  content?: string;
}
