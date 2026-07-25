import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AnveshakHub Enterprise Backend E2E Test Suite', () => {
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

  it('/health (GET) - Service Health Diagnostics', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBeDefined();
        expect(res.body.service).toContain('AnveshakHub');
      });
  });

  it('/health/liveness (GET) - Liveness Probe', () => {
    return request(app.getHttpServer())
      .get('/health/liveness')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('UP');
      });
  });

  it('/health/readiness (GET) - Readiness Probe', () => {
    return request(app.getHttpServer())
      .get('/health/readiness')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('READY');
      });
  });

  it('/api/v1/auth/login (POST) - Unauthorized on bad credentials', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'nonexistent@anveshakhub.com', password: 'WrongPassword123' })
      .expect(401);
  });
});
