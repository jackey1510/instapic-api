import { User } from './../../users/entities/users.entity';
import {
  Entity,
  PrimaryColumn,
  //   RelationId,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Like {
  @PrimaryColumn()
  userId: string;
  //   @RelationId((post: Post) => post.likes)
  @PrimaryColumn()
  postId: string;

  @ManyToOne(() => Post, (post) => post.likes)
  post: Promise<Post>;

  @OneToMany(() => User, (user) => user.likes)
  user: Promise<User>;

  constructor(postId?: string, userId?: string) {
    if (postId && userId) {
      this.postId = postId;
      this.userId = userId;
    }
  }
}
