import { CommentDto } from '@/dto';
import { Board, User, Comment } from '@/entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async createComment(createDto: CommentDto.CreateDto, user: User) {
    const { content, boardId } = createDto;
    const board = await this.boardRepository.findOneBy({ id: boardId });

    const comment: Comment = this.commentRepository.create({
      content,
      board,
      user,
    });

    try {
      await this.commentRepository.save(comment);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing Comment');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateComment(updateDto: CommentDto.UpdateDto) {
    const { content, boardId } = updateDto;

    await this.commentRepository.update(boardId, { content });
  }

  async deleteComment(deleteDto: CommentDto.DeleteDto) {
    const { id } = deleteDto;
    const result = await this.commentRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`NOT_FOUND ${id}`);
    }
  }
}
