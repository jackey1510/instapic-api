import { Inject, Injectable } from '@nestjs/common';
import { UtilService } from 'src/util/util.service';
import { Repository } from 'typeorm';
import { postCreatedDto } from './dtos/post-created.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POST_REPOSITORY')
    private readonly postRepository: Repository<Post>,
    private readonly utilService: UtilService,
  ) {}

  async createPost(userId: string, text: string): Promise<postCreatedDto> {
    const fileName = userId + '/' + new Date().getTime().toString();
    const signedUrl = await this.utilService.generateV4UploadSignedUrl(
      fileName,
    );
    const photoUrl = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${fileName}`;
    await this.postRepository.insert({ userId, fileName, photoUrl, text });
    return {
      fileName,
      photoUrl,
      signedUrl,
    };
  }
}
