import { IsDateString, IsNumberString } from 'class-validator';

export class getPostsDto {
  @IsNumberString()
  limit?: number;
  @IsDateString()
  cursor?: string;
}
