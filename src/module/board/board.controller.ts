import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardDto } from '@/dto';
import { GetUser } from '@/decorator';
import { Board, User } from '@/entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/guard';

@ApiTags('Board')
@UseGuards(AuthGuard)
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/all')
  @ApiOperation({
    summary: '모든 게시판 가져오기',
  })
  getAllBoardList(): Promise<Board[]> {
    return this.boardService.getAllBoards();
  }

  @Get('/:id')
  @ApiOperation({
    summary: '모든 게시판 가져오기',
  })
  getBoardById(@Param('id', ParseIntPipe) id: number): Promise<Board> {
    return this.boardService.getBoardById(id);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: '게시판 지우기',
  })
  deleteBoardById(@Param('id', ParseIntPipe) id: number) {
    return this.boardService.deleteBoardById(id);
  }

  @Put('/:id')
  @ApiOperation({
    summary: '게시판 업데이트',
    description: 'title과 content를 보낸다.',
  })
  @UseInterceptors(FileInterceptor('file'))
  updateBoardById(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateDto: BoardDto.UpdateDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Board> {
    return this.boardService.updateBoardById(updateDto, id, file);
  }

  @Post('/create')
  @ApiOperation({
    summary: '게시판 생성',
    description: 'title과 content를 보낸다.',
  })
  @UseInterceptors(FileInterceptor('file'))
  createBoard(
    @Body(ValidationPipe) createDto: BoardDto.CreateDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.boardService.createBoard(createDto, user, file);
  }
}
