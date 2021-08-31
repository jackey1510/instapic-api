import { Like } from './../../posts/entities/like.entity';
import { User } from '../../users/entities/users.entity';
import { gcp_storage_url } from './../../constants';
import { mockUser1 } from '../../mocks/data/users.data.mock';
import { Post } from '../../posts/entities/post.entity';
import { mockBucketName } from '../mock_env';
import { PostDto } from '../../posts/dtos/response/post.dto';

export const mockPosts = (): Post[] => {
  const mockUser = mockUser1();
  const fileType = 'png';

  const fileName = `${mockUser.id}/image.${fileType}`;

  const photoUrl = `${gcp_storage_url}/${mockBucketName}/${fileName}`;
  const mockPost1 = {
    id: '57ad6f0e-541d-4364-ad74-7001615becb1',
    createdAt: new Date('2021-01-01'),
    fileName,
    photoUrl,
    public: false,
    text: 'hi',
    updatedAt: new Date('2021-01-01'),
    user: new Promise<User>(() => mockUser),
    userId: mockUser.id,
    likes: new Promise<Like[]>(() => []),
  };

  const fileName2 = `${mockUser.id}/image.${fileType}`;
  const photoUrl2 = `${gcp_storage_url}/${mockBucketName}/${fileName2}`;

  const mockPost2: Post = {
    id: 'a47865ff-e5f9-4492-be03-f6a697a7d633',
    createdAt: new Date('2021-01-01'),
    fileName: fileName2,
    photoUrl: photoUrl2,
    public: false,
    text: 'hi',
    updatedAt: new Date('2021-01-01'),
    user: new Promise<User>(() => mockUser),
    userId: mockUser.id,
    likes: new Promise(() => []),
  };

  return [mockPost1, mockPost2];
};

export const mockPostsDto = (): PostDto[] => {
  const mockUser = mockUser1();
  const fileType = 'png';

  const fileName = `${mockUser.id}/image.${fileType}`;

  const mockPost1: PostDto = {
    id: 'ifhsaif',
    createdAt: new Date('2021-01-01'),
    fileName,
    username: mockUser.username,
    text: 'hi',
    likes: 0,
    updatedAt: new Date('2021-01-01'),
  };

  const fileName2 = `${mockUser.id}/image.${fileType}`;

  const mockPost2: PostDto = {
    id: 'asdhihdais',
    createdAt: new Date('2021-01-01'),
    fileName: fileName2,
    username: mockUser.username,
    text: 'hi',
    likes: 0,
    updatedAt: new Date('2021-01-01'),
  };

  return [mockPost1, mockPost2];
};
