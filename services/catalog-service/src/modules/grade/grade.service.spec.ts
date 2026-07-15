/**
 * Testes do GradeService (regras de negócio de grades de tamanhos).
 *
 * Foca a lógica pura do service com repositório e cache mockados:
 *  - normalização/ordenação de tamanhos (trim, dedup, `ordem` sequencial);
 *  - rejeição de lista vazia (400);
 *  - unicidade de nome por tenant (409) na criação e na atualização;
 *  - 404 ao buscar/atualizar/remover grade inexistente;
 *  - repasse condicional de tamanhos no update (só quando enviados).
 */

import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common'

import { GradeService } from './grade.service'
import { GradeRepository } from './grade.repository'
import { CacheService } from '../cache/cache.service'

describe('GradeService', () => {
  let service: GradeService
  let repo: jest.Mocked<Pick<
    GradeRepository,
    'criar' | 'listar' | 'buscarPorId' | 'buscarPorNome' | 'atualizar' | 'desativar'
  >>
  let cache: jest.Mocked<Pick<CacheService, 'invalidarPorPrefixo' | 'gerarChave'>>

  beforeEach(() => {
    repo = {
      criar: jest.fn(),
      listar: jest.fn(),
      buscarPorId: jest.fn(),
      buscarPorNome: jest.fn(),
      atualizar: jest.fn(),
      desativar: jest.fn(),
    }
    cache = {
      invalidarPorPrefixo: jest.fn().mockResolvedValue(undefined),
      gerarChave: jest.fn((tenantId: string, recurso: string) => `tenant:${tenantId}:${recurso}`),
    }
    service = new GradeService(repo as unknown as GradeRepository, cache as unknown as CacheService)
  })

  const TENANT = '10000000-0000-0000-0000-000000000001'

  describe('criar', () => {
    it('normaliza tamanhos: trim, dedup e ordem sequencial preservando a sequência', async () => {
      repo.buscarPorNome.mockResolvedValue(null)
      repo.criar.mockImplementation(async (_t, dados) => ({ id: 'g1', ...dados }) as any)

      await service.criar(TENANT, {
        nome: 'Camiseta',
        tamanhos: ['  PP ', 'P', 'P', 'M', '', '  ', 'G'],
      } as any)

      expect(repo.criar).toHaveBeenCalledTimes(1)
      const [, dados] = repo.criar.mock.calls[0]
      // Vazios descartados, duplicado 'P' colapsado, ordem 0..n na sequência enviada.
      expect(dados.tamanhos).toEqual([
        { valor: 'PP', ordem: 0 },
        { valor: 'P', ordem: 1 },
        { valor: 'M', ordem: 2 },
        { valor: 'G', ordem: 3 },
      ])
    })

    it('faz trim do nome e normaliza descricao vazia para undefined', async () => {
      repo.buscarPorNome.mockResolvedValue(null)
      repo.criar.mockImplementation(async (_t, dados) => ({ id: 'g1', ...dados }) as any)

      await service.criar(TENANT, { nome: '  Calça  ', descricao: '   ', tamanhos: ['36'] } as any)

      const [, dados] = repo.criar.mock.calls[0]
      expect(dados.nome).toBe('Calça')
      expect(dados.descricao).toBeUndefined()
      expect(dados.ativa).toBe(true)
    })

    it('rejeita lista de tamanhos vazia após limpeza (400)', async () => {
      repo.buscarPorNome.mockResolvedValue(null)
      await expect(
        service.criar(TENANT, { nome: 'X', tamanhos: ['', '   '] } as any),
      ).rejects.toBeInstanceOf(BadRequestException)
      expect(repo.criar).not.toHaveBeenCalled()
    })

    it('rejeita nome já existente no tenant (409)', async () => {
      repo.buscarPorNome.mockResolvedValue({ id: 'outro', nome: 'Camiseta' } as any)
      await expect(
        service.criar(TENANT, { nome: 'Camiseta', tamanhos: ['P'] } as any),
      ).rejects.toBeInstanceOf(ConflictException)
      expect(repo.criar).not.toHaveBeenCalled()
    })

    it('invalida o cache do tenant após criar', async () => {
      repo.buscarPorNome.mockResolvedValue(null)
      repo.criar.mockResolvedValue({ id: 'g1' } as any)
      await service.criar(TENANT, { nome: 'Nova', tamanhos: ['U'] } as any)
      expect(cache.invalidarPorPrefixo).toHaveBeenCalledTimes(1)
    })
  })

  describe('buscarPorId', () => {
    it('retorna a grade quando existe', async () => {
      repo.buscarPorId.mockResolvedValue({ id: 'g1', nome: 'Camiseta' } as any)
      await expect(service.buscarPorId(TENANT, 'g1')).resolves.toMatchObject({ id: 'g1' })
    })

    it('lança 404 quando não existe', async () => {
      repo.buscarPorId.mockResolvedValue(null)
      await expect(service.buscarPorId(TENANT, 'inexistente')).rejects.toBeInstanceOf(
        NotFoundException,
      )
    })
  })

  describe('atualizar', () => {
    it('só recalcula tamanhos quando a lista é enviada', async () => {
      repo.buscarPorId.mockResolvedValue({ id: 'g1', nome: 'Camiseta' } as any)
      repo.atualizar.mockResolvedValue({ id: 'g1' } as any)

      // Sem `tamanhos` no DTO → repo.atualizar recebe undefined em novosTamanhos.
      await service.atualizar(TENANT, 'g1', { ativa: false } as any)

      const [, , dados, novosTamanhos] = repo.atualizar.mock.calls[0]
      expect(dados).toEqual({ ativa: false })
      expect(novosTamanhos).toBeUndefined()
    })

    it('normaliza os tamanhos quando enviados no update', async () => {
      repo.buscarPorId.mockResolvedValue({ id: 'g1', nome: 'Camiseta' } as any)
      repo.atualizar.mockResolvedValue({ id: 'g1' } as any)

      await service.atualizar(TENANT, 'g1', { tamanhos: ['P', 'P', 'M'] } as any)

      const [, , , novosTamanhos] = repo.atualizar.mock.calls[0]
      expect(novosTamanhos).toEqual([
        { valor: 'P', ordem: 0 },
        { valor: 'M', ordem: 1 },
      ])
    })

    it('não checa unicidade quando o nome não muda', async () => {
      repo.buscarPorId.mockResolvedValue({ id: 'g1', nome: 'Camiseta' } as any)
      repo.atualizar.mockResolvedValue({ id: 'g1' } as any)

      await service.atualizar(TENANT, 'g1', { nome: 'Camiseta' } as any)

      expect(repo.buscarPorNome).not.toHaveBeenCalled()
      const [, , dados] = repo.atualizar.mock.calls[0]
      // Nome inalterado não entra no patch.
      expect(dados.nome).toBeUndefined()
    })

    it('rejeita renomear para um nome já usado por outra grade (409)', async () => {
      repo.buscarPorId.mockResolvedValue({ id: 'g1', nome: 'Camiseta' } as any)
      repo.buscarPorNome.mockResolvedValue({ id: 'g2', nome: 'Calça' } as any)

      await expect(
        service.atualizar(TENANT, 'g1', { nome: 'Calça' } as any),
      ).rejects.toBeInstanceOf(ConflictException)
      expect(repo.atualizar).not.toHaveBeenCalled()
    })

    it('permite manter o próprio nome ao renomear (ignora o próprio id na checagem)', async () => {
      repo.buscarPorId.mockResolvedValue({ id: 'g1', nome: 'Camiseta' } as any)
      // buscarPorNome devolve a própria grade → não é colisão.
      repo.buscarPorNome.mockResolvedValue({ id: 'g1', nome: 'Camiseta Nova' } as any)
      repo.atualizar.mockResolvedValue({ id: 'g1' } as any)

      await expect(
        service.atualizar(TENANT, 'g1', { nome: 'Camiseta Nova' } as any),
      ).resolves.toBeDefined()
    })
  })

  describe('remover', () => {
    it('desativa (soft delete) quando a grade existe', async () => {
      repo.buscarPorId.mockResolvedValue({ id: 'g1', nome: 'Camiseta' } as any)
      repo.desativar.mockResolvedValue({ count: 1 } as any)

      await service.remover(TENANT, 'g1')

      expect(repo.desativar).toHaveBeenCalledWith(TENANT, 'g1')
      expect(cache.invalidarPorPrefixo).toHaveBeenCalled()
    })

    it('lança 404 ao remover grade inexistente', async () => {
      repo.buscarPorId.mockResolvedValue(null)
      await expect(service.remover(TENANT, 'nope')).rejects.toBeInstanceOf(NotFoundException)
      expect(repo.desativar).not.toHaveBeenCalled()
    })
  })
})
