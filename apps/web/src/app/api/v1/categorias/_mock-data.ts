/**
 * Dados mock de categorias (usado quando USE_MICROSERVICES != 'true').
 *
 * Os IDs (`cat-00X`) espelham os `categoriaId` usados em produtos/_mock-data.ts
 * para que os filtros e vínculos funcionem de ponta a ponta offline.
 */

export interface CategoriaMock {
  id: string
  tenantId: string
  nome: string
  slug: string
  nivel: number
  ativa: boolean
  categoriaPaiId: string | null
  _count: { produtos: number; subcategorias: number }
  criadoEm: string
  atualizadoEm: string
}

const AGORA = new Date().toISOString()
const TENANT = '10000000-0000-0000-0000-000000000001'

export const CATEGORIAS_MOCK: CategoriaMock[] = [
  { id: 'cat-001', tenantId: TENANT, nome: 'Eletrônicos', slug: 'eletronicos', nivel: 0, ativa: true, categoriaPaiId: null, _count: { produtos: 4, subcategorias: 0 }, criadoEm: AGORA, atualizadoEm: AGORA },
  { id: 'cat-002', tenantId: TENANT, nome: 'Informática', slug: 'informatica', nivel: 0, ativa: true, categoriaPaiId: null, _count: { produtos: 3, subcategorias: 0 }, criadoEm: AGORA, atualizadoEm: AGORA },
  { id: 'cat-003', tenantId: TENANT, nome: 'Calçados', slug: 'calcados', nivel: 0, ativa: true, categoriaPaiId: null, _count: { produtos: 2, subcategorias: 0 }, criadoEm: AGORA, atualizadoEm: AGORA },
  { id: 'cat-004', tenantId: TENANT, nome: 'Vestuário', slug: 'vestuario', nivel: 0, ativa: true, categoriaPaiId: null, _count: { produtos: 2, subcategorias: 0 }, criadoEm: AGORA, atualizadoEm: AGORA },
  { id: 'cat-005', tenantId: TENANT, nome: 'Acessórios', slug: 'acessorios', nivel: 0, ativa: true, categoriaPaiId: null, _count: { produtos: 3, subcategorias: 0 }, criadoEm: AGORA, atualizadoEm: AGORA },
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
export function slugUnicoCategoria(nome: string, idIgnorar?: string): string {
  const base = gerarSlug(nome) || 'categoria'
  let candidato = base
  let sufixo = 1
  while (
    CATEGORIAS_MOCK.some((c) => c.slug === candidato && c.id !== idIgnorar)
  ) {
    sufixo += 1
    candidato = `${base}-${sufixo}`
  }
  return candidato
}
