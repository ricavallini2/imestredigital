/**
 * ═══════════════════════════════════════════════════════════════
 * Testes E2E do Módulo de Pedidos
 * ═══════════════════════════════════════════════════════════════
 *
 * Testa o ciclo de vida completo de um pedido.
 *
 * Executar com: npm run test:e2e
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('Pedidos E2E Tests', () => {
  let app: INestApplication;
  let pedidoId: string;
  const tenantId = 'tenant-teste-e2e';
  const token = 'token-teste'; // Em produção, usar token real

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /pedidos - Criar Pedido', () => {
    it('deve criar um novo pedido', () => {
      return request(app.getHttpServer())
        .post('/api/v1/pedidos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          clienteNome: 'João Teste',
          clienteEmail: 'joao@teste.com',
          clienteCpfCnpj: '123.456.789-00',
          origem: 'ECOMMERCE',
          canalOrigem: 'SITE',
          itens: [
            {
              produtoId: 'prod-teste-001',
              sku: 'SKU-TESTE',
              titulo: 'Produto Teste',
              quantidade: 1,
              valorUnitario: 100.00,
              peso: 0.5,
            },
          ],
          valorFrete: 10.00,
          enderecoEntrega: {
            cep: '12345-678',
            rua: 'Rua Teste',
            numero: '123',
            bairro: 'Bairro',
            cidade: 'São Paulo',
            uf: 'SP',
          },
        })
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.status).toBe('RASCUNHO');
          expect(res.body.clienteNome).toBe('João Teste');
          expect(res.body.itens).toHaveLength(1);
          pedidoId = res.body.id;
        });
    });

    it('deve rejeitar pedido sem itens', () => {
      return request(app.getHttpServer())
        .post('/api/v1/pedidos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          clienteNome: 'João Teste',
          itens: [],
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /pedidos/:id - Buscar Pedido', () => {
    it('deve retornar o pedido criado', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/pedidos/${pedidoId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body.id).toBe(pedidoId);
          expect(res.body.status).toBe('RASCUNHO');
        });
    });

    it('deve retornar 404 para pedido inexistente', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/pedidos/inexistente`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('GET /pedidos - Listar Pedidos', () => {
    it('deve listar pedidos', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pedidos')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toHaveProperty('pedidos');
          expect(res.body).toHaveProperty('paginacao');
        });
    });

    it('deve filtrar por status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pedidos?status=RASCUNHO')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('PATCH /pedidos/:id/confirmar - Confirmar Pedido', () => {
    it('deve confirmar o pedido', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/pedidos/${pedidoId}/confirmar`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body.status).toBe('CONFIRMADO');
        });
    });
  });

  describe('Workflow Completo', () => {
    it('deve seguir o workflow: SEPARANDO -> SEPARADO -> FATURADO -> ENVIADO -> ENTREGUE', async () => {
      // SEPARANDO
      await request(app.getHttpServer())
        .patch(`/api/v1/pedidos/${pedidoId}/separando`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      // SEPARADO
      await request(app.getHttpServer())
        .patch(`/api/v1/pedidos/${pedidoId}/separado`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      // FATURADO
      await request(app.getHttpServer())
        .patch(`/api/v1/pedidos/${pedidoId}/faturar`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      // ENVIADO
      await request(app.getHttpServer())
        .patch(`/api/v1/pedidos/${pedidoId}/enviar`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          codigoRastreio: 'BR123456789BR',
          transportadora: 'Sedex',
          prazoEntrega: 2,
        })
        .expect(HttpStatus.OK);

      // ENTREGUE
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/pedidos/${pedidoId}/entregar`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(res.body.status).toBe('ENTREGUE');
    });
  });

  describe('DELETE /pedidos/:id/cancelar - Cancelar Pedido', () => {
    it('deve cancelar o pedido', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/pedidos/${pedidoId}/cancelar`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          motivo: 'Cliente solicitou cancelamento da compra',
        })
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body.status).toBe('CANCELADO');
        });
    });
  });

  describe('Health Check', () => {
    it('deve retornar status de saúde', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(HttpStatus.OK);
    });
  });
});
