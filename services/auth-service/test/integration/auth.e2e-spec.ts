/**
 * Testes E2E do Auth Service.
 *
 * Testa fluxos completos:
 * - Registro → Login → Tokens → Refresh
 * - CRUD de usuários
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Auth Service (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/registrar', () => {
    it('deve registrar um novo tenant', () => {
      // TODO: Implementar teste
      // 1. Fazer POST /auth/registrar
      // 2. Verificar status 201
      // 3. Verificar se retorna tokens
      return request(app.getHttpServer())
        .post('/api/v1/auth/registrar')
        .send({
          nome: 'Teste',
          email: 'novo@teste.com',
          senha: 'Senha@123',
          nomeEmpresa: 'Nova Empresa',
        })
        .expect(201);
    });

    it('deve validar campos obrigatórios', () => {
      // TODO: Implementar teste
      return request(app.getHttpServer())
        .post('/api/v1/auth/registrar')
        .send({})
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('deve fazer login com credenciais válidas', () => {
      // TODO: Implementar teste
      // 1. Registrar um usuário
      // 2. Fazer POST /auth/login
      // 3. Verificar se retorna tokens
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'teste@teste.com',
          senha: 'Senha123',
        })
        .expect(200);
    });

    it('deve rejeitar credenciais inválidas', () => {
      // TODO: Implementar teste
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'inexistente@teste.com',
          senha: 'senhaErrada',
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/auth/perfil', () => {
    it('deve retornar perfil do usuário autenticado', () => {
      // TODO: Implementar teste
      // 1. Fazer login e obter token
      // 2. Fazer GET /auth/perfil com Authorization header
      // 3. Verificar se retorna dados do usuário
      return request(app.getHttpServer())
        .get('/api/v1/auth/perfil')
        .set('Authorization', 'Bearer <token>')
        .expect(200);
    });

    it('deve rejeitar requisição sem token', () => {
      // TODO: Implementar teste
      return request(app.getHttpServer())
        .get('/api/v1/auth/perfil')
        .expect(401);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('deve renovar o access token', () => {
      // TODO: Implementar teste
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: '<valid_refresh_token>',
        })
        .expect(200);
    });

    it('deve rejeitar refresh token inválido', () => {
      // TODO: Implementar teste
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: 'token_invalido',
        })
        .expect(401);
    });
  });

  describe('Fluxo Completo', () => {
    it('deve completar fluxo: Registrar → Login → Renovar → Acessar Perfil', async () => {
      // TODO: Implementar teste completo
      // 1. Registrar novo tenant
      // 2. Fazer login
      // 3. Usar access token para acessar /perfil
      // 4. Renovar token com refresh token
      // 5. Usar novo access token para acessar /perfil novamente
    });
  });
});
