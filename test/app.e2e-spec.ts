import { mockAccessTokenSecret } from './../src/mocks/mock_env';
import { MockAppModule } from './../src/mocks/module/app.module.mock';
import { sign } from 'jsonwebtoken';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { mockUser1 } from '../src/mocks/data/users.data.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MockAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/ (GET)', () => {
    it('not authorized', () => {
      return request(app.getHttpServer()).get('/').expect(401);
    });
    it('is Authorized', async () => {
      const mockUser = mockUser1();
      const accessToken = sign(
        {
          userId: mockUser.id,
          username: mockUser.username,
        },
        mockAccessTokenSecret,
      );

      request(app.getHttpServer())
        .get('/')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect('Hello World!');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
