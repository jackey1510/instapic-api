import { mockUser1 } from '../../mocks/data/users.data.mock';
import { sign } from 'jsonwebtoken';
export const mockRefreshToken = () => {
  const mockUser = mockUser1();
  return sign(
    { username: mockUser.username, sub: mockUser.id },
    process.env.REFRESH_TOKEN_SECRET,
  );
};
