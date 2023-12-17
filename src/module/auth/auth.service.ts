import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from '@/dto';
import { User } from '@/entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from '@/response';
import * as bcrypt from 'bcrypt';
import * as config from 'config';
import { TokenPayload } from '@/interface';
import { v4 as uuid } from 'uuid';

const jwtConfig = config.get('jwt');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: UserDto.SignUpDto) {
    const { name, userName, password } = signUpDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: User = this.userRepository.create({
      userId: uuid(),
      name,
      userName,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('EXIST_USER_ID');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(signInDto: UserDto.SignInDto): Promise<AuthResponse.SignIn> {
    const { userName, password } = signInDto;
    const user = await this.findOneByUserName(userName);

    if (!user) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    const payload: TokenPayload = {
      name: user.name,
      userName: user.userName,
    };

    const accessToken = await this.getAccessToken(payload);
    const refreshToken = await this.getRefreshToken(payload);

    const response = {
      accessToken,
      refreshToken,
    };

    return response;
  }

  async getUser(params: User): Promise<AuthResponse.GetUser> {
    const user = await this.findOneByUserName(params.userName);

    const res = {
      userId: user.userId,
      name: user.name,
      userName: user.userName,
    };

    return res;
  }

  async findOneByUserName(userName: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ userName });

    return user;
  }

  async getAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: jwtConfig.accessSecret,
      expiresIn: jwtConfig.accessExpiresIn,
    });
  }

  async getRefreshToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: jwtConfig.refreshSecret,
      expiresIn: jwtConfig.refreshExpiresIn,
    });
  }
}
