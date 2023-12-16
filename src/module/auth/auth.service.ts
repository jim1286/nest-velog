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

const jwtConfig = config.get('jwt');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: UserDto.SignUpDto) {
    const { name, userId, password } = signUpDto;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: User = this.userRepository.create({
      name,
      userId,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('EXIST_USER_ID');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(signInDto: UserDto.SignInDto): Promise<AuthResponse.SignIn> {
    const { userId, password } = signInDto;

    const user = await this.findOneByUserId(userId);

    if (!user) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    const payload: TokenPayload = {
      userId,
      name: user.name,
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
    const user = await this.findOneByUserId(params.userId);

    const res = {
      id: user.id,
      name: user.name,
      userId: user.userId,
    };

    return res;
  }

  async findOneByUserId(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ userId: userId });

    return user;
  }

  async getAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.sign(payload, {
      expiresIn: jwtConfig.accessExpiresIn,
    });
  }

  async getRefreshToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.sign(payload, {
      expiresIn: jwtConfig.refreshExpiresIn,
    });
  }
}
