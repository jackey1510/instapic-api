import { IsString } from 'class-validator';

export class loginDto {
  @IsString()
  usernameOrEmail: string;
  @IsString()
  password: string;
}
