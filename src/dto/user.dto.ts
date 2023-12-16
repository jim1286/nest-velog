import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  userName: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english and number',
  })
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
