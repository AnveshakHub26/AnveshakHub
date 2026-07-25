import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProjectsModule (e2e)', () => {
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

  it('/api/v1/projects (GET) - lists projects with 200 status', () => {
    return request(app.getHttpServer())
      .get('/api/v1/projects')
      .expect(200);
  });

  it('/api/v1/projects/statistics (GET) - returns statistics', () => {
    return request(app.getHttpServer())
      .get('/api/v1/projects/statistics')
      .expect(200);
  });
});
