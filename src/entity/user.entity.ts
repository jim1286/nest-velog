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
@Unique(['userName'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @OneToMany(() => Board, (board) => board.user)
  boardList: Board[];

  @OneToMany(() => Comment, (comment) => comment.user)
  commentList: Comment[];
}
