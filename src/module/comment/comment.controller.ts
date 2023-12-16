import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { GetUser } from '@/decorator';
import { User } from '@/entity';
import { CommentDto } from '@/dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenStrategy } from '@/strategy';

@ApiTags('Comment')
@UseGuards(AccessTokenStrategy)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({
    summary: '댓글 생성',
    description: 'board의 id와 content를 보낸다.',
  })
  createComment(
    @Body(ValidationPipe) createDto: CommentDto.CreateDto,
    @GetUser() user: User,
  ) {
    this.commentService.createComment(createDto, user);

    return 'success';
  }

  @Put()
  @ApiOperation({
    summary: '댓글 업데이트',
    description: 'board의 id와 content를 보낸다.',
  })
  updateComment(@Body(ValidationPipe) updateDto: CommentDto.UpdateDto) {
    this.commentService.updateComment(updateDto);
  }

  @Delete()
  @ApiOperation({
    summary: '댓글 삭제',
    description: 'comment의 id를 보낸다.',
  })
  deleteComment(@Body(ValidationPipe) deleteDto: CommentDto.DeleteDto) {
    this.commentService.deleteComment(deleteDto);
  }
}
