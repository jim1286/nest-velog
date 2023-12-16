import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Board, Comment } from '.';

@Entity()
@Unique(['userId'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: string;

  @Column()
  password: string;

  @OneToMany(() => Board, (board) => board.user)
  boardList: Board[];

  @OneToMany(() => Comment, (comment) => comment.user)
  commentList: Comment[];
}
