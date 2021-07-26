import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Length } from 'class-validator';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: Promise<User>;

  @RelationId((post: Post) => post.user)
  @Column()
  userId: string;

  @Column({ length: 300 })
  @Length(1, 300)
  text: string;

  @Column()
  photoUrl: string;

  @Column()
  fileName: string;
}
