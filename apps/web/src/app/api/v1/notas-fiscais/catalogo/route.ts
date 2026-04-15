/**
 * Catálogo integrado para o formulário de Nova NF-e.
 * Retorna produtos enriquecidos com dados fiscais (NCM+CFOP+alíquotas)
 * e clientes com CNPJ/CPF + UF para auto-preenchimento.
 */
import { NextResponse } from 'next/server';
import { PRODUTOS_MOCK }  from '../../produtos/_mock-data';
import { CLIENTES_MOCK }  from '../../clientes/_mock-data';
import { getRegras, getConfig } from '../_mock-data';

/** Remove pontuação e retorna apenas dígitos */
function limparNCM(ncm: string) { return ncm.replace(/\D/g, ''); }

/** Formata NCM para o padrão XXXX.XX.XX */
function formatarNCM(ncm: string) {
  const c = limparNCM(ncm);
  if (c.length >= 8) return `${c.slice(0, 4)}.${c.slice(4, 6)}.${c.slice(6, 8)}`;
  return ncm;
}

export async function GET() {
  const regras = getRegras().filter(r => r.ativo);
  const config = getConfig();

  /* ── Produtos enriquecidos com regra fiscal ────────────────────────── */
  const produtos = (PRODUTOS_MOCK ?? [])
    .filter(p => p.status === 'ATIVO')
    .map(p => {
      // Busca regra pelos 6 primeiros dígitos do NCM (posição + sub-posição)
      const prefixo6 = limparNCM(p.ncm).slice(0, 6);
      const regra = regras.find(r => limparNCM(r.ncm).slice(0, 6) === prefixo6);

      return {
        id:                p.id,
        nome:              p.nome,
        sku:               p.sku,
        preco:             p.preco,
        estoque:           p.estoque,
        unidade:           'UN',
        ncm:               formatarNCM(p.ncm),
        cfopEstadual:      regra?.cfopEstadual      ?? config.cfopPadraoEstadual,
        cfopInterestadual: regra?.cfopInterestadual ?? config.cfopPadraoInterestadual,
        aliquotaICMS:      regra?.aliquotaICMS      ?? config.aliquotaICMSPadrao,
        aliquotaPIS:       regra?.aliquotaPIS       ?? config.aliquotaPISPadrao,
        aliquotaCOFINS:    regra?.aliquotaCOFINS    ?? config.aliquotaCOFINSPadrao,
        csosn:             regra?.csosn ?? '400',
        descricaoNCM:      regra?.descricaoNCM ?? '',
      };
    });

  /* ── Clientes enriquecidos com CNPJ/CPF e UF ──────────────────────── */
  const clientes = (CLIENTES_MOCK ?? [])
    .filter(c => c.status !== 'INATIVO')
    .map(c => ({
      id:       c.id,
      nome:     c.nome,
      tipo:     c.tipo as 'PJ' | 'PF',
      cnpjCpf:  c.cnpj ?? c.cpf ?? '',
      uf:       (c as any).enderecos?.[0]?.estado ?? config.uf,
      email:    c.email,
      telefone: c.telefone,
    }));

  return NextResponse.json({
    produtos,
    clientes,
    empresaUF: config.uf,
  });
}
