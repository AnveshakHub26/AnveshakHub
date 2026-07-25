import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/auth/login (POST) - fails on invalid email', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'invalid-email', password: '123' })
      .expect(400);
  });

  it('/api/v1/auth/forgot-password (POST) - fails on missing email', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/forgot-password')
      .send({})
      .expect(400);
  });
});
