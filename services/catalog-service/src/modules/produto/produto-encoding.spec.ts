/**
 * Teste de REGRESSÃO do bug de encoding (round-trip byte-a-byte de â/ê).
 *
 * Prova a causa raiz e a correção: um produto cujo `nome` contém circunflexos
 * (`â` = c3a2, `ê` = c3aa) deve percorrer TODO o caminho de leitura/serialização
 * — gravação (Prisma) -> ProdutoService.buscarPorId (cache-aside) -> repositório
 * (Prisma read) -> JSON.stringify (exatamente como o NestJS serializa a resposta
 * HTTP) — preservando os bytes UTF-8 EXATOS, sem virar U+FFFD (`efbfbd`).
 *
 * Antes da correção o dado no banco estava corrompido em repouso (o `nome` de
 * TECH-TECLADO-001 e MODA-TENIS-001 guardava `efbfbd` no lugar de `â`/`ê`).
 * Este teste falha se qualquer camada reintroduzir a corrupção.
 *
 * Requer PostgreSQL local (DATABASE_URL). Se o banco não estiver acessível, a
 * suíte é PULADA (não quebra CI sem Postgres) — mas roda de verdade no ambiente
 * local do projeto.
 */

import { Test } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'

import { PrismaService } from '../prisma/prisma.service'
import { CacheService } from '../cache/cache.service'
import { ProducerService } from '../../events/producer.service'
import { ProdutoRepository } from './produto.repository'
import { ProdutoService } from './produto.service'
import { VariacaoService } from './variacao.service'

// Bytes UTF-8 canônicos que o bug corrompia.
const HEX_A_CIRCUNFLEXO = 'c3a2' // 'â'
const HEX_E_CIRCUNFLEXO = 'c3aa' // 'ê'
const HEX_FFFD = 'efbfbd' // '�' (mojibake)

const TENANT_ID = '10000000-0000-0000-0000-000000000001'
const CATEGORIA_ID = '30000000-0000-0000-0000-000000000001' // Eletrônicos (seed)
const SKU_TESTE = 'ZZZ-ENCODING-ROUNDTRIP-001'
const NOME_TESTE = 'Teclado Mecânico e Tênis Ââ Êê' // contém â e ê

function hexUtf8(s: string): string {
  return Buffer.from(s, 'utf8').toString('hex')
}

async function bancoAcessivel(prisma: PrismaService): Promise<boolean> {
  try {
    await prisma.$queryRawUnsafe('SELECT 1')
    return true
  } catch {
    return false
  }
}

describe('Produto — round-trip de encoding (â/ê byte-a-byte)', () => {
  let prisma: PrismaService
  let service: ProdutoService
  let temBanco = false
  let temCategoria = false

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProdutoService,
        ProdutoRepository,
        PrismaService,
        // Cache real (in-memory fallback se não houver Redis) — exercita o
        // caminho cache-aside de fato, incluindo (de)serialização JSON do cache.
        CacheService,
        // VariacaoService stub: só é usado no fluxo de atualizar (não exercido
        // aqui). Stub evita puxar VariacaoRepository/GradeRepository ao grafo.
        {
          provide: VariacaoService,
          useValue: { salvarLoteEmbutido: jest.fn().mockResolvedValue(undefined) },
        },
        // ConfigService stub: sem REDIS_HOST/REDIS_URL o CacheService cai no
        // fallback in-memory, sem tentar conectar em Redis durante o teste.
        {
          provide: ConfigService,
          useValue: { get: () => undefined },
        },
        // Produtor de eventos stub: buscarPorId não publica, mas o provider é
        // dependência do service; evita conectar no Kafka durante o teste.
        {
          provide: ProducerService,
          useValue: { publicar: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile()

    prisma = moduleRef.get(PrismaService)
    service = moduleRef.get(ProdutoService)

    await prisma.$connect().catch(() => undefined)
    temBanco = await bancoAcessivel(prisma)
    if (temBanco) {
      const cat = await prisma.categoria.findFirst({
        where: { id: CATEGORIA_ID, tenantId: TENANT_ID },
        select: { id: true },
      })
      temCategoria = !!cat
      // Limpa resíduo de execuções anteriores.
      await prisma.produto.deleteMany({
        where: { tenantId: TENANT_ID, sku: SKU_TESTE },
      })
    }
  })

  afterAll(async () => {
    if (temBanco && prisma) {
      await prisma.produto
        .deleteMany({ where: { tenantId: TENANT_ID, sku: SKU_TESTE } })
        .catch(() => undefined)
    }
    await prisma?.$disconnect().catch(() => undefined)
  })

  it('sanidade do fixture: a string em memória tem â=c3a2 e ê=c3aa', () => {
    const hex = hexUtf8(NOME_TESTE)
    expect(hex).toContain(HEX_A_CIRCUNFLEXO)
    expect(hex).toContain(HEX_E_CIRCUNFLEXO)
    expect(hex).not.toContain(HEX_FFFD)
  })

  it('preserva â/ê byte-a-byte via ProdutoService.buscarPorId + JSON.stringify', async () => {
    if (!temBanco || !temCategoria) {
      // Sem Postgres/seed: não dá para exercer o caminho real. Pula sem falhar.
      console.warn(
        '[produto-encoding] PostgreSQL/categoria de seed indisponível — teste pulado.',
      )
      return
    }

    // 1) Grava um produto com â/ê pelo Prisma (caminho de escrita real).
    const criado = await prisma.produto.create({
      data: {
        tenantId: TENANT_ID,
        sku: SKU_TESTE,
        nome: NOME_TESTE,
        descricao: 'Descrição com acento â e ê para validar round-trip.',
        ncm: '84716040',
        origem: 0,
        precoCusto: '10.00',
        precoVenda: '20.00',
        peso: 100,
        altura: 1,
        largura: 1,
        comprimento: 1,
        categoriaId: CATEGORIA_ID,
      },
      select: { id: true },
    })

    // 2) Lê pelo SERVICE (cache-aside + repositório + engine Prisma).
    const produto = (await service.buscarPorId(TENANT_ID, criado.id)) as {
      nome: string
    }

    // 3) O nome, como string JS, deve bater byte-a-byte com o original.
    expect(produto.nome).toBe(NOME_TESTE)
    expect(hexUtf8(produto.nome)).toBe(hexUtf8(NOME_TESTE))

    // 4) Serialização EXATA da resposta HTTP do NestJS: JSON.stringify -> UTF-8.
    const corpoHttp = Buffer.from(JSON.stringify(produto), 'utf8')
    const corpoHex = corpoHttp.toString('hex')
    expect(corpoHex).toContain(HEX_A_CIRCUNFLEXO) // â presente
    expect(corpoHex).toContain(HEX_E_CIRCUNFLEXO) // ê presente
    expect(corpoHex).not.toContain(HEX_FFFD) // nunca U+FFFD

    // 5) Segunda leitura (agora servida do cache) — deve manter os bytes.
    const doCache = (await service.buscarPorId(TENANT_ID, criado.id)) as {
      nome: string
    }
    expect(hexUtf8(doCache.nome)).toBe(hexUtf8(NOME_TESTE))
  })
})
