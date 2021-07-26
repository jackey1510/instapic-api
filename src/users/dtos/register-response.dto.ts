import { UserDto } from './user.dto';
export class registerResponseDto {
  user?: UserDto;
  errors?: userError[];
}

export interface userError {
  field: string;
  error: string;
}
