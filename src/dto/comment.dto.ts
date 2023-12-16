import { IsNumber, IsString } from 'class-validator';

export class CreateDto {
  @IsNumber()
  boardId: number;

  @IsString()
  content: string;
}

export class UpdateDto {
  @IsNumber()
  boardId: number;

  @IsString()
  content: string;
}

export class DeleteDto {
  @IsNumber()
  id: number;
}
