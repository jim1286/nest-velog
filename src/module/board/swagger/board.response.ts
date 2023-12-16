import { ApiProperty } from '@nestjs/swagger';

export class SignIn {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiVVNFUiIsInVzZXJJZCI6IjUiLCJyb2xlIjoidXNlciIsImlhdCI6MTY4MDc2NDU3OSwiZXhwIjoxNjg1OTQ4NTc5fQ.QO5suL8rQ8r2iHwWlq__nAhCuWz_BXitvrp_bUH7Vpg',
  })
  accessToken: string;
}

export class GetUser {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'John123' })
  userId: string;
}
