/**
 * Dados mock de marcas (usado quando USE_MICROSERVICES != 'true').
 *
 * Os nomes espelham as marcas usadas em produtos/_mock-data.ts.
 */

export interface MarcaMock {
  id: string
  tenantId: string
  nome: string
  slug: string
  logoUrl: string | null
  ativa: boolean
  _count: { produtos: number }
  criadoEm: string
  atualizadoEm: string
}

const AGORA = new Date().toISOString()
const TENANT = '10000000-0000-0000-0000-000000000001'

export const MARCAS_MOCK: MarcaMock[] = [
  { id: 'mar-001', tenantId: TENANT, nome: 'Apple', slug: 'apple', logoUrl: null, ativa: true, _count: { produtos: 3 }, criadoEm: AGORA, atualizadoEm: AGORA },
  { id: 'mar-002', tenantId: TENANT, nome: 'Samsung', slug: 'samsung', logoUrl: null, ativa: true, _count: { produtos: 2 }, criadoEm: AGORA, atualizadoEm: AGORA },
  { id: 'mar-003', tenantId: TENANT, nome: 'Dell', slug: 'dell', logoUrl: null, ativa: true, _count: { produtos: 1 }, criadoEm: AGORA, atualizadoEm: AGORA },
  { id: 'mar-004', tenantId: TENANT, nome: 'Sony', slug: 'sony', logoUrl: null, ativa: true, _count: { produtos: 1 }, criadoEm: AGORA, atualizadoEm: AGORA },
  { id: 'mar-005', tenantId: TENANT, nome: 'Nike', slug: 'nike', logoUrl: null, ativa: true, _count: { produtos: 2 }, criadoEm: AGORA, atualizadoEm: AGORA },
  { id: 'mar-006', tenantId: TENANT, nome: 'GoPro', slug: 'gopro', logoUrl: null, ativa: true, _count: { produtos: 1 }, criadoEm: AGORA, atualizadoEm: AGORA },
  { id: 'mar-007', tenantId: TENANT, nome: 'Ralph Lauren', slug: 'ralph-lauren', logoUrl: null, ativa: true, _count: { produtos: 1 }, criadoEm: AGORA, atualizadoEm: AGORA },
  { id: 'mar-008', tenantId: TENANT, nome: 'Samsonite', slug: 'samsonite', logoUrl: null, ativa: true, _count: { produtos: 1 }, criadoEm: AGORA, atualizadoEm: AGORA },
]

function gerarSlug(nome: string): string {
  return nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Resolve um slug único no conjunto mock (evita colisão). */
export function slugUnicoMarca(nome: string, idIgnorar?: string): string {
  const base = gerarSlug(nome) || 'marca'
  let candidato = base
  let sufixo = 1
  while (MARCAS_MOCK.some((m) => m.slug === candidato && m.id !== idIgnorar)) {
    sufixo += 1
    candidato = `${base}-${sufixo}`
  }
  return candidato
}
