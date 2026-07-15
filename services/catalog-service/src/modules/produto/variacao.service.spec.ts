/**
 * Testes do VariacaoService (grade de tamanhos, padrão varejo BR).
 *
 * Cobre a lógica de negócio com repositórios e cache mockados:
 *  - prever(): geração da matriz (SKU automático, nome, preço herdado, atributos,
 *    desambiguação de SKU com sufixo -2, validação de produto/grade por tenant);
 *  - salvarLoteEmbutido(): normalização tolerante do shape legado da UI (fix 400)
 *    — deriva sku/nome/preço/atributos, ignora a linha "Única", descarta campos
 *    legados (precoCusto/estoque) e devolve o estado atual quando nada é aplicável.
 */

import { NotFoundException } from '@nestjs/common'

import { VariacaoService } from './variacao.service'
import { ProdutoRepository } from './produto.repository'
import { VariacaoRepository } from './variacao.repository'
import { GradeRepository } from '../grade/grade.repository'
import { CacheService } from '../cache/cache.service'

describe('VariacaoService', () => {
  let service: VariacaoService
  let produtoRepo: jest.Mocked<Pick<ProdutoRepository, 'buscarPorId'>>
  let variacaoRepo: jest.Mocked<
    Pick<VariacaoRepository, 'listarPorProduto' | 'buscarPorId' | 'upsertLote' | 'atualizar' | 'remover'>
  >
  let gradeRepo: jest.Mocked<Pick<GradeRepository, 'buscarPorId'>>
  let cache: jest.Mocked<Pick<CacheService, 'invalidar' | 'invalidarPorPrefixo' | 'gerarChave'>>

  const TENANT = '10000000-0000-0000-0000-000000000001'
  const PRODUTO_ID = '50000000-0000-0000-0000-000000000005'
  const GRADE_ID = '60000000-0000-0000-0000-000000000004'

  /** Produto demo com SKU e preço herdável. */
  const produtoDemo = { id: PRODUTO_ID, sku: 'MODA-TENIS-001', precoVenda: '199.90' }

  /** Grade demo com 3 tamanhos já ordenados por `ordem`. */
  const gradeDemo = {
    id: GRADE_ID,
    nome: 'Tênis Adulto',
    tamanhos: [
      { valor: '38', ordem: 0 },
      { valor: '39', ordem: 1 },
      { valor: '40', ordem: 2 },
    ],
  }

  beforeEach(() => {
    produtoRepo = { buscarPorId: jest.fn() }
    variacaoRepo = {
      listarPorProduto: jest.fn().mockResolvedValue([]),
      buscarPorId: jest.fn(),
      upsertLote: jest.fn(),
      atualizar: jest.fn(),
      remover: jest.fn(),
    }
    gradeRepo = { buscarPorId: jest.fn() }
    cache = {
      invalidar: jest.fn().mockResolvedValue(undefined),
      invalidarPorPrefixo: jest.fn().mockResolvedValue(undefined),
      gerarChave: jest.fn((tenantId: string, recurso: string, id?: string) =>
        [tenantId, recurso, id].filter(Boolean).join(':'),
      ),
    }

    service = new VariacaoService(
      produtoRepo as unknown as ProdutoRepository,
      variacaoRepo as unknown as VariacaoRepository,
      gradeRepo as unknown as GradeRepository,
      cache as unknown as CacheService,
    )
  })

  // ── prever() ────────────────────────────────────────────────────────────────

  describe('prever', () => {
    it('gera uma variação por tamanho com SKU/nome/preço/atributos corretos', async () => {
      produtoRepo.buscarPorId.mockResolvedValue(produtoDemo as any)
      gradeRepo.buscarPorId.mockResolvedValue(gradeDemo as any)

      const matriz = await service.prever(TENANT, PRODUTO_ID, {
        valorAtributo: 'Preto',
        gradeId: GRADE_ID,
      } as any)

      expect(matriz).toHaveLength(3)
      expect(matriz[0]).toEqual({
        sku: 'MODA-TENIS-001-PRETO-38',
        nome: 'Preto 38',
        precoVenda: 199.9, // herdado do produto, como number
        gtin: null,
        atributos: [
          { nome: 'Cor', valor: 'Preto' }, // atributo default
          { nome: 'Tamanho', valor: '38' },
        ],
      })
      expect(matriz.map((v) => v.sku)).toEqual([
        'MODA-TENIS-001-PRETO-38',
        'MODA-TENIS-001-PRETO-39',
        'MODA-TENIS-001-PRETO-40',
      ])
    })

    it('usa o atributo informado quando presente (ex: Sabor)', async () => {
      produtoRepo.buscarPorId.mockResolvedValue(produtoDemo as any)
      gradeRepo.buscarPorId.mockResolvedValue(gradeDemo as any)

      const matriz = await service.prever(TENANT, PRODUTO_ID, {
        atributo: 'Sabor',
        valorAtributo: 'Menta',
        gradeId: GRADE_ID,
      } as any)

      expect(matriz[0].atributos[0]).toEqual({ nome: 'Sabor', valor: 'Menta' })
    })

    it('desambigua o SKU com sufixo -2 quando já existe variação com o mesmo SKU', async () => {
      produtoRepo.buscarPorId.mockResolvedValue(produtoDemo as any)
      gradeRepo.buscarPorId.mockResolvedValue(gradeDemo as any)
      // Já existe a variação do tamanho 38 → o gerado deve virar ...-38-2.
      variacaoRepo.listarPorProduto.mockResolvedValue([
        { sku: 'MODA-TENIS-001-PRETO-38' } as any,
      ])

      const matriz = await service.prever(TENANT, PRODUTO_ID, {
        valorAtributo: 'Preto',
        gradeId: GRADE_ID,
      } as any)

      expect(matriz[0].sku).toBe('MODA-TENIS-001-PRETO-38-2')
      // Os demais não colidiam e permanecem sem sufixo.
      expect(matriz[1].sku).toBe('MODA-TENIS-001-PRETO-39')
    })

    it('herda precoVenda null quando o produto não tem preço', async () => {
      produtoRepo.buscarPorId.mockResolvedValue({ ...produtoDemo, precoVenda: null } as any)
      gradeRepo.buscarPorId.mockResolvedValue(gradeDemo as any)

      const matriz = await service.prever(TENANT, PRODUTO_ID, {
        valorAtributo: 'Preto',
        gradeId: GRADE_ID,
      } as any)

      expect(matriz[0].precoVenda).toBeNull()
    })

    it('lança 404 quando o produto não pertence ao tenant', async () => {
      produtoRepo.buscarPorId.mockResolvedValue(null)
      await expect(
        service.prever(TENANT, PRODUTO_ID, { valorAtributo: 'Preto', gradeId: GRADE_ID } as any),
      ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('lança 404 quando a grade não pertence ao tenant', async () => {
      produtoRepo.buscarPorId.mockResolvedValue(produtoDemo as any)
      gradeRepo.buscarPorId.mockResolvedValue(null)
      await expect(
        service.prever(TENANT, PRODUTO_ID, { valorAtributo: 'Preto', gradeId: GRADE_ID } as any),
      ).rejects.toBeInstanceOf(NotFoundException)
    })
  })

  // ── salvarLoteEmbutido() — fix do 400 (shape legado da UI) ────────────────────

  describe('salvarLoteEmbutido', () => {
    it('normaliza o shape legado (tipo/valor/preco) para o canônico e faz upsert', async () => {
      produtoRepo.buscarPorId.mockResolvedValue(produtoDemo as any)
      variacaoRepo.listarPorProduto.mockResolvedValue([])
      variacaoRepo.upsertLote.mockImplementation(async (_id, itens) => itens as any)

      const resultado = await service.salvarLoteEmbutido(TENANT, PRODUTO_ID, [
        { tipo: 'Cor', valor: 'Preto', preco: 59.9, precoCusto: 20, estoque: 5 } as any,
      ])

      expect(variacaoRepo.upsertLote).toHaveBeenCalledTimes(1)
      const [, itens] = variacaoRepo.upsertLote.mock.calls[0]
      expect(itens).toHaveLength(1)
      expect(itens[0]).toMatchObject({
        sku: 'MODA-TENIS-001-PRETO', // composto do valor legado
        nome: 'Cor Preto', // "tipo valor"
        precoVenda: 59.9, // preco legado -> precoVenda
        atributos: [{ nome: 'Cor', valor: 'Preto' }],
      })
      // Campos legados que não pertencem à variação não vazam.
      expect(itens[0]).not.toHaveProperty('precoCusto')
      expect(itens[0]).not.toHaveProperty('estoque')
      expect(resultado).toBeDefined()
    })

    it('ignora a linha "Única" (produto sem variação) sem tocar o repositório', async () => {
      produtoRepo.buscarPorId.mockResolvedValue(produtoDemo as any)
      const atuais = [{ id: 'v-existente', sku: 'X' }]
      variacaoRepo.listarPorProduto.mockResolvedValue(atuais as any)

      const resultado = await service.salvarLoteEmbutido(TENANT, PRODUTO_ID, [
        { tipo: 'Única', estoque: 10 } as any,
      ])

      // Nada aplicável → devolve o estado atual sem chamar upsert.
      expect(variacaoRepo.upsertLote).not.toHaveBeenCalled()
      expect(resultado).toBe(atuais)
    })

    it('prioriza os campos canônicos quando presentes', async () => {
      produtoRepo.buscarPorId.mockResolvedValue(produtoDemo as any)
      variacaoRepo.listarPorProduto.mockResolvedValue([])
      variacaoRepo.upsertLote.mockImplementation(async (_id, itens) => itens as any)

      await service.salvarLoteEmbutido(TENANT, PRODUTO_ID, [
        {
          sku: 'SKU-MANUAL-1',
          nome: 'Nome Canônico',
          precoVenda: 100,
          preco: 1, // legado deve ser ignorado em favor do canônico
          atributos: [{ nome: 'Cor', valor: 'Azul' }],
        } as any,
      ])

      const [, itens] = variacaoRepo.upsertLote.mock.calls[0]
      expect(itens[0]).toMatchObject({
        sku: 'SKU-MANUAL-1',
        nome: 'Nome Canônico',
        precoVenda: 100,
        atributos: [{ nome: 'Cor', valor: 'Azul' }],
      })
    })

    it('desambigua SKUs colidentes dentro do próprio lote (sufixo -2)', async () => {
      produtoRepo.buscarPorId.mockResolvedValue(produtoDemo as any)
      variacaoRepo.listarPorProduto.mockResolvedValue([])
      variacaoRepo.upsertLote.mockImplementation(async (_id, itens) => itens as any)

      await service.salvarLoteEmbutido(TENANT, PRODUTO_ID, [
        { tipo: 'Cor', valor: 'Preto' } as any,
        { tipo: 'Cor', valor: 'Preto' } as any, // mesmo valor → mesmo SKU base
      ])

      const [, itens] = variacaoRepo.upsertLote.mock.calls[0]
      expect(itens.map((i: any) => i.sku)).toEqual([
        'MODA-TENIS-001-PRETO',
        'MODA-TENIS-001-PRETO-2',
      ])
    })

    it('lança 404 quando o produto não pertence ao tenant', async () => {
      produtoRepo.buscarPorId.mockResolvedValue(null)
      await expect(
        service.salvarLoteEmbutido(TENANT, PRODUTO_ID, [{ tipo: 'Cor', valor: 'Preto' } as any]),
      ).rejects.toBeInstanceOf(NotFoundException)
    })
  })

  // ── operações individuais ─────────────────────────────────────────────────────

  describe('atualizarVariacao / removerVariacao', () => {
    it('atualiza campos parciais e invalida cache', async () => {
      produtoRepo.buscarPorId.mockResolvedValue(produtoDemo as any)
      variacaoRepo.buscarPorId.mockResolvedValue({ id: 'v1', produtoId: PRODUTO_ID } as any)
      variacaoRepo.atualizar.mockResolvedValue({ id: 'v1', nome: 'Novo' } as any)

      await service.atualizarVariacao(TENANT, PRODUTO_ID, 'v1', { nome: '  Novo  ' } as any)

      const [, , dados] = variacaoRepo.atualizar.mock.calls[0]
      expect(dados).toEqual({ nome: 'Novo' }) // trimado, só o campo enviado
      expect(cache.invalidar).toHaveBeenCalled()
    })

    it('lança 404 ao atualizar variação inexistente no produto', async () => {
      produtoRepo.buscarPorId.mockResolvedValue(produtoDemo as any)
      variacaoRepo.buscarPorId.mockResolvedValue(null)
      await expect(
        service.atualizarVariacao(TENANT, PRODUTO_ID, 'nope', { nome: 'X' } as any),
      ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('remove a variação existente e invalida cache', async () => {
      produtoRepo.buscarPorId.mockResolvedValue(produtoDemo as any)
      variacaoRepo.buscarPorId.mockResolvedValue({ id: 'v1', produtoId: PRODUTO_ID } as any)
      variacaoRepo.remover.mockResolvedValue({ count: 1 } as any)

      await service.removerVariacao(TENANT, PRODUTO_ID, 'v1')

      expect(variacaoRepo.remover).toHaveBeenCalledWith(PRODUTO_ID, 'v1')
      expect(cache.invalidar).toHaveBeenCalled()
    })
  })
})
