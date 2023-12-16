import { Board, User } from '@/entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardDto } from '@/dto';
import { FileService } from '../file/file.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    private readonly fileService: FileService,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    const boardList = await this.boardRepository.find();

    return boardList;
  }

  async getBoardById(id: number): Promise<Board> {
    const board = await this.boardRepository.findOneBy({ id: id });

    return board;
  }

  async deleteBoardById(id: number) {
    const result = await this.boardRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`NOT_FOUND ${id}`);
    }
  }

  async updateBoardById(
    updateDto: BoardDto.UpdateDto,
    id: number,
    file: Express.Multer.File,
  ): Promise<Board> {
    const { title, content } = updateDto;

    const params = {
      title,
      content,
      filePath: '',
    };

    if (file) {
      const filePath = this.fileService.fileUpload(file);
      params.filePath = filePath;
    }

    if (!file) {
      delete params.filePath;
    }

    await this.boardRepository.update(id, params);

    const board = await this.boardRepository.findOneBy({ id: id });

    return board;
  }

  async createBoard(
    createDto: BoardDto.CreateDto,
    user: User,
    file: Express.Multer.File,
  ) {
    const { title, content } = createDto;

    const params = {
      title,
      content,
      filePath: '',
    };

    if (file) {
      const filePath = this.fileService.fileUpload(file);
      params.filePath = filePath;
    }

    const board: Board = this.boardRepository.create({
      ...params,
      user,
      commentList: [],
    });

    try {
      await this.boardRepository.save(board);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing Board');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
