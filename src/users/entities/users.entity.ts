import { Post } from './../../posts/entities/post.entity';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: Promise<RefreshToken[]>;

  @OneToMany(() => Post, (post) => post.user)
  posts: Promise<Post[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
