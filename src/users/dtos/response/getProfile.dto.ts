import { User } from '../../../users/entities/users.entity';
export class getProfileDto {
  email: string;
  username: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.email = user.email;
    this.username = user.username;
    this.bio = user.bio;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
