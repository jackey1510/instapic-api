import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @IsEmail()
  @Column({ length: 100 })
  email!: string;

  @Column()
  password!: string;

  @Column()
  username!: string;

  @Column({ length: 300 })
  bio: string;
}
