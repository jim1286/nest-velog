import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board, Comment } from '@/entity';
import { AuthModule } from '../auth';
import { JwtStrategy } from '@/strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Board]), AuthModule],
  controllers: [CommentController],
  providers: [CommentService, JwtStrategy],
})
export class CommentModule {}
