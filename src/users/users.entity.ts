import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: number;

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
}
