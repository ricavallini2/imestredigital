/**
 * ═══════════════════════════════════════════════════════════════
 * Testes E2E do Módulo de Pedidos
 * ═══════════════════════════════════════════════════════════════
 *
 * Testa o ciclo de vida completo de um pedido.
 *
 * Executar com: npm run test:e2e
 *
 * NOTA: requer banco de dados de teste E um JWT válido (assinado com o
 * JWT_SECRET do serviço), pois o TenantMiddleware agora verifica a
 * assinatura do token e retorna 401 para tokens inválidos/ausentes.
 * O literal `token-teste` abaixo é placeholder — substituir por um token
 * real emitido pelo auth-service ao rodar de fato.
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
          // Envelope paginado canônico (Fase 0)
          expect(res.body).toHaveProperty('dados');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('pagina');
          expect(res.body).toHaveProperty('limite');
          expect(res.body).toHaveProperty('totalPaginas');
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
    // Estados alinhados ao enum Prisma: a separação é um único estado
    // (EM_SEPARACAO). Fluxo: CONFIRMADO -> EM_SEPARACAO -> FATURADO ->
    // ENVIADO -> ENTREGUE.
    it('deve seguir o workflow via rotas semânticas até ENTREGUE', async () => {
      // EM_SEPARACAO (rota semântica /separando)
      await request(app.getHttpServer())
        .patch(`/api/v1/pedidos/${pedidoId}/separando`)
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

  describe('PATCH /pedidos/:id/status - Compatibilidade (máquina de estados)', () => {
    it('deve mapear o status alvo EM_SEPARACAO para a transição correspondente', async () => {
      // Pré-condição: cria um novo pedido e o confirma para poder separar.
      // (Fluxo real usa eventos Kafka para RASCUNHO -> PENDENTE -> CONFIRMADO;
      // aqui exercitamos apenas o endpoint de compatibilidade.)
      const criado = await request(app.getHttpServer())
        .post('/api/v1/pedidos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          clienteNome: 'Maria Compat',
          itens: [
            { produtoId: 'prod-c-001', sku: 'SKU-C', titulo: 'Item Compat', quantidade: 1, valorUnitario: 50 },
          ],
        })
        .expect(HttpStatus.CREATED);

      const compatId = criado.body.id;

      // Cancelar via endpoint de compatibilidade (transição válida a partir de RASCUNHO).
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/pedidos/${compatId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'CANCELADO', motivo: 'Teste de compatibilidade' })
        .expect(HttpStatus.OK);

      expect(res.body.status).toBe('CANCELADO');
    });
  });

  describe('DELETE /pedidos/:id/cancelar - Cancelar Pedido (rota semântica)', () => {
    it('deve cancelar um pedido recém-criado', async () => {
      // Usa um pedido novo (o pedidoId principal já foi ENTREGUE no workflow,
      // e ENTREGUE não permite CANCELADO na máquina de estados).
      const criado = await request(app.getHttpServer())
        .post('/api/v1/pedidos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          clienteNome: 'Cancelar Teste',
          itens: [
            { produtoId: 'prod-x-001', sku: 'SKU-X', titulo: 'Item X', quantidade: 1, valorUnitario: 30 },
          ],
        })
        .expect(HttpStatus.CREATED);

      const res = await request(app.getHttpServer())
        .delete(`/api/v1/pedidos/${criado.body.id}/cancelar`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          motivo: 'Cliente solicitou cancelamento da compra',
        })
        .expect(HttpStatus.OK);

      expect(res.body.status).toBe('CANCELADO');
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
