import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  userName: string;

  @IsString()
  password: string;
}

export class SignInDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  userName: string;

  @IsString()
  password: string;
}
