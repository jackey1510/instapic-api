import { User } from '../entities/users.entity';
export class registerResponseDto {
  user?: User;
  errors?: userError[];
}

export interface userError {
  field: string;
  error: string;
}
