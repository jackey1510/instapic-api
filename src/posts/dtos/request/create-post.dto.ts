import { IsBoolean, IsString } from 'class-validator';

export class createPostDto {
  @IsString()
  text: string;
  @IsBoolean()
  public: boolean;
  @IsString()
  fileType: string;
}
