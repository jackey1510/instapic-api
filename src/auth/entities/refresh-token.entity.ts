import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: Promise<User>;

  @RelationId((refreshToken: RefreshToken) => refreshToken.user)
  @Column()
  userId: string;

  @Column()
  token: string;

  @Column(() => Date)
  exp: Date;
}
