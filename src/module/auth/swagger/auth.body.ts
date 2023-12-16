import { ApiProperty } from '@nestjs/swagger';

export class SignIn {
  @ApiProperty({
    example: 'jimin',
    description: 'userId',
    required: true,
  })
  public userId: string;
  @ApiProperty({
    example: '1234',
    description: 'password',
    required: true,
  })
  public password: string;
}

export class SignUp {
  @ApiProperty({
    example: '황지민',
    description: 'userId',
    required: true,
  })
  public name: string;
  @ApiProperty({
    example: 'jimin',
    description: 'userId',
    required: true,
  })
  public userId: string;
  @ApiProperty({
    example: '1234',
    description: 'password',
    required: true,
  })
  public password: string;
}
