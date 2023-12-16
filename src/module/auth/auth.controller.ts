import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from '@/dto';
import { AuthService } from './auth.service';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthResponse } from '@/response';
import { SwaggerBody, SwaggerParams, SwaggerResponse } from './swagger';
import { GetUser } from '@/decorator';
import { User } from '@/entity';
import { AuthGuard } from '@/guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({
    summary: '유저 회원가입',
    description: '유저 회원가입을 위해 name, userId, password를 보낸다.',
  })
  @ApiBody({ type: SwaggerBody.SignUp })
  @ApiQuery(SwaggerParams.SignUp)
  signUp(@Body(ValidationPipe) signUpDto: UserDto.SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  @ApiOperation({
    summary: '유저 로그인',
    description: '유저 로그인을 위해 userId, password를 보낸다.',
  })
  @ApiBody({ type: SwaggerBody.SignIn })
  @ApiQuery(SwaggerParams.SignIn)
  signIn(
    @Body(ValidationPipe) signInDto: UserDto.SignInDto,
  ): Promise<AuthResponse.SignIn> {
    return this.authService.signIn(signInDto);
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '유저 정보 가져오기' })
  @ApiCreatedResponse({
    description: '유저의 정보를 가져온다',
    type: SwaggerResponse.GetUser,
  })
  getUser(@GetUser() user: User): Promise<AuthResponse.GetUser> {
    return this.authService.getUser(user);
  }
}
