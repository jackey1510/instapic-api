import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { Like } from './../../posts/entities/like.entity';
import { Post } from './../../posts/entities/post.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @IsEmail()
  @Column({ length: 100 })
  email!: string;

  @ApiProperty()
  @Column()
  password!: string;

  @ApiProperty()
  @Column()
  @Length(6)
  username!: string;

  @ApiProperty()
  @Column({ length: 300, nullable: true })
  bio: string;

  @OneToMany(() => Like, (like) => like.user)
  likes: Promise<Like[]>;

  @Exclude()
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: Promise<RefreshToken[]>;

  @Exclude()
  @OneToMany(() => Post, (post) => post.user)
  posts: Promise<Post[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
