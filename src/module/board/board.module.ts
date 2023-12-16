import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board, User, Comment } from '@/entity';
import { AuthModule } from '..';
import { FileService } from '../file/file.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '@/config';
import { JwtStrategy } from '@/strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Board, Comment]),
    AuthModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [BoardController],
  providers: [BoardService, FileService, JwtStrategy],
  exports: [BoardService],
})
export class BoardModule {}
