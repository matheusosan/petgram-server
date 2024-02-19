import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from '../src/http/user/user.module';
import { UserService } from '../src/http/user/user.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userService: { getAllUsers: () => ['test1', 'test2'] };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/user');

    expect(response.status).toEqual(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
