// Dados mock em memória para o módulo de grades de tamanho (dev sem catalog-service).
// Usa globalThis para compartilhar o array entre todas as rotas (isolamento de módulos no Next.js).
export const TENANT_ID = '10000000-0000-0000-0000-000000000001'

export interface GradeTamanhoMock {
  id: string
  valor: string
  ordem: number
}

export interface GradeMock {
  id: string
  tenantId: string
  nome: string
  descricao?: string
  ativa: boolean
  tamanhos: GradeTamanhoMock[]
  criadoEm: string
  atualizadoEm: string
}

declare global {
  // eslint-disable-next-line no-var
  var __gradesMock: GradeMock[] | undefined
}

const agora = () => new Date().toISOString()

const tam = (valores: string[]): GradeTamanhoMock[] =>
  valores.map((valor, ordem) => ({ id: `gt-${valor}-${ordem}`, valor, ordem }))

const INITIAL_GRADES: GradeMock[] = [
  {
    id: 'g0000001-0000-0000-0000-000000000001',
    tenantId: TENANT_ID,
    nome: 'Vestuário Adulto (PP–GG)',
    descricao: 'Grade padrão de roupas adulto',
    ativa: true,
    tamanhos: tam(['PP', 'P', 'M', 'G', 'GG']),
    criadoEm: '2024-02-01T10:00:00Z',
    atualizadoEm: '2024-02-01T10:00:00Z',
  },
  {
    id: 'g0000002-0000-0000-0000-000000000001',
    tenantId: TENANT_ID,
    nome: 'Calçados Numérico 34–44',
    descricao: 'Grade de numeração de calçados',
    ativa: true,
    tamanhos: tam(['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44']),
    criadoEm: '2024-02-01T10:00:00Z',
    atualizadoEm: '2024-02-01T10:00:00Z',
  },
  {
    id: 'g0000003-0000-0000-0000-000000000001',
    tenantId: TENANT_ID,
    nome: 'Vestuário Estendido',
    descricao: 'Inclui tamanhos plus size',
    ativa: false,
    tamanhos: tam(['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG']),
    criadoEm: '2024-02-01T10:00:00Z',
    atualizadoEm: '2024-02-01T10:00:00Z',
  },
]

/** Store compartilhado (persiste entre requests durante o processo dev). */
export function getGrades(): GradeMock[] {
  if (!globalThis.__gradesMock) {
    globalThis.__gradesMock = INITIAL_GRADES.map((g) => ({ ...g }))
  }
  return globalThis.__gradesMock
}

export function findGrade(id: string): GradeMock | undefined {
  return getGrades().find((g) => g.id === id)
}

let seqTamanho = 0
export function novoTamanhoId(): string {
  seqTamanho += 1
  return `gt-${Date.now()}-${seqTamanho}`
}

/** Normaliza a lista de tamanhos do body (aceita string[] ou {valor,ordem}[]). */
export function normalizarTamanhos(
  entrada: unknown,
): GradeTamanhoMock[] {
  if (!Array.isArray(entrada)) return []
  return entrada
    .map((item, idx) => {
      if (typeof item === 'string') {
        return { id: novoTamanhoId(), valor: item.trim(), ordem: idx }
      }
      const obj = (item ?? {}) as Record<string, unknown>
      const valor = String(obj.valor ?? '').trim()
      if (!valor) return null
      return {
        id: String(obj.id ?? novoTamanhoId()),
        valor,
        ordem: typeof obj.ordem === 'number' ? obj.ordem : idx,
      }
    })
    .filter((t): t is GradeTamanhoMock => t !== null)
    .sort((a, b) => a.ordem - b.ordem)
    .map((t, i) => ({ ...t, ordem: i }))
}

export function novaGradeId(): string {
  return `g${Date.now().toString().padStart(7, '0')}-0000-0000-0000-000000000001`
}

export { agora }
