'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Printer, ArrowLeft } from 'lucide-react';
import { useNotaFiscal, useConfiguracaoFiscal } from '@/hooks/useFiscal';
import type { NotaFiscal, ConfiguracaoFiscal } from '@/services/fiscal.service';

// ─── Formatadores ──────────────────────────────────────────────────────────────
const moeda = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dtfmt = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');
const hrfmt = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const fmtCNPJ = (v: string) => v.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
const fmtChave = (c: string) => c.replace(/(.{4})/g, '$1 ').trim();

// ─── Componentes de célula DANFE ───────────────────────────────────────────────
function Cell({ label, value, className = '', style }: { label: string; value?: string | number | null; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`border border-[#333] p-1 ${className}`} style={{ minHeight: 28, ...style }}>
      <div style={{ fontSize: 6, fontWeight: 700, textTransform: 'uppercase', color: '#444', lineHeight: 1.2, marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: 8, lineHeight: 1.3, wordBreak: 'break-word' }}>{value ?? ''}</div>
    </div>
  );
}

function CellRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex ${className}`} style={{ gap: 0 }}>{children}</div>;
}

// ─── Barcode placeholder ────────────────────────────────────────────────────────
function BarcodeBar({ chave }: { chave: string }) {
  // Simula barras de código de barras para visualização
  const digits = chave.replace(/\D/g, '');
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: 36, gap: 0.5, padding: '0 4px' }}>
      {digits.split('').map((d, i) => {
        const w = [1.5, 1, 2, 1, 1.5, 2, 1, 1, 1.5, 2][i % 10];
        const h = 28 + (i % 3) * 4;
        return (
          <div key={i} style={{ width: w, height: h, backgroundColor: '#000', flexShrink: 0 }} />
        );
      })}
    </div>
  );
}

// ─── QR Code placeholder ────────────────────────────────────────────────────────
function QrPlaceholder({ size = 60 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, border: '1px solid #333', padding: 3, display: 'inline-block' }}>
      <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 5, color: '#666', textAlign: 'center' }}>
        QR<br />Code
      </div>
    </div>
  );
}

// ─── DANFE Document ────────────────────────────────────────────────────────────
function DanfeDocument({ nf, cfg }: { nf: NotaFiscal; cfg: ConfiguracaoFiscal }) {
  const totalImpostos = nf.valorICMS + nf.valorPIS + nf.valorCOFINS + nf.valorIPI + nf.valorISS;

  return (
    <div id="danfe-print" style={{
      width: '210mm', minHeight: '297mm', margin: '0 auto', backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif', color: '#000', fontSize: 8, padding: '4mm',
      boxSizing: 'border-box',
    }}>
      {/* ── CANCELADA watermark ── */}
      {nf.status === 'CANCELADA' && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)',
          fontSize: 72, fontWeight: 900, color: 'rgba(220,0,0,0.12)', pointerEvents: 'none', zIndex: 1,
          whiteSpace: 'nowrap',
        }}>CANCELADA</div>
      )}

      {/* ══ BLOCO 1 — Cabeçalho DANFE ══ */}
      <div style={{ border: '1.5px solid #333', marginBottom: 2 }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* Emitente */}
          <div style={{ flex: 1, borderRight: '1px solid #333', padding: 4 }}>
            <div style={{ fontWeight: 900, fontSize: 11, lineHeight: 1.2 }}>{cfg.nomeFantasia || cfg.razaoSocial}</div>
            <div style={{ fontSize: 7, marginTop: 1, color: '#333' }}>{cfg.razaoSocial}</div>
            <div style={{ fontSize: 7, marginTop: 2 }}>
              {cfg.logradouro}, {cfg.numero} — {cfg.bairro}
            </div>
            <div style={{ fontSize: 7 }}>
              CEP {cfg.cep} — {cfg.municipio} / {cfg.uf}
            </div>
            <div style={{ fontSize: 7, marginTop: 2 }}>
              <strong>CNPJ:</strong> {fmtCNPJ(cfg.cnpj)} &nbsp;|&nbsp; <strong>IE:</strong> {cfg.ie}
            </div>
          </div>

          {/* DANFE Título */}
          <div style={{ width: 120, borderRight: '1px solid #333', padding: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: 1 }}>DANFE</div>
            <div style={{ fontSize: 6, marginTop: 2, lineHeight: 1.4, color: '#444' }}>
              DOCUMENTO AUXILIAR DA<br />NOTA FISCAL ELETRÔNICA
            </div>
            <div style={{ marginTop: 4, fontSize: 7 }}>
              <strong>0</strong> – ENTRADA<br />
              <strong style={{ fontSize: 10 }}>1</strong> – SAÍDA
            </div>
            <div style={{ marginTop: 4, border: '1px solid #333', padding: '2px 6px', fontSize: 9, fontWeight: 700 }}>
              1
            </div>
          </div>

          {/* Número, Série, Folha */}
          <div style={{ width: 120, padding: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 6, color: '#444', textTransform: 'uppercase' }}>Nº da Nota Fiscal</div>
              <div style={{ fontWeight: 700, fontSize: 12, fontFamily: 'monospace' }}>{nf.numero}</div>
            </div>
            <div>
              <div style={{ fontSize: 6, color: '#444', textTransform: 'uppercase' }}>Série</div>
              <div style={{ fontWeight: 700, fontSize: 11 }}>{nf.serie}</div>
            </div>
            <div>
              <div style={{ fontSize: 6, color: '#444', textTransform: 'uppercase' }}>Folha</div>
              <div style={{ fontWeight: 700, fontSize: 9 }}>1 / 1</div>
            </div>
            <div>
              <div style={{ fontSize: 6, color: '#444', textTransform: 'uppercase' }}>Valor Total</div>
              <div style={{ fontWeight: 700, fontSize: 10 }}>R$ {moeda(nf.valorTotal)}</div>
            </div>
          </div>
        </div>

        {/* Chave de acesso */}
        <div style={{ borderTop: '1px solid #333', padding: '2px 4px', backgroundColor: '#f9f9f9' }}>
          <div style={{ fontSize: 6, color: '#444', textTransform: 'uppercase', marginBottom: 1 }}>Chave de Acesso</div>
          {nf.chaveAcesso ? (
            <>
              <div style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: 1.5, fontWeight: 600 }}>
                {fmtChave(nf.chaveAcesso)}
              </div>
              <BarcodeBar chave={nf.chaveAcesso} />
            </>
          ) : (
            <div style={{ fontSize: 7, color: '#888', fontStyle: 'italic' }}>Não emitida / Sem chave de acesso</div>
          )}
        </div>

        {/* Protocolo */}
        <div style={{ borderTop: '1px solid #333', display: 'flex' }}>
          <div style={{ flex: 1, padding: '2px 4px', borderRight: '1px solid #333' }}>
            <span style={{ fontSize: 6, color: '#444', textTransform: 'uppercase' }}>Natureza da Operação: </span>
            <span style={{ fontWeight: 700, fontSize: 7 }}>{nf.naturezaOperacao}</span>
          </div>
          {nf.protocolo && (
            <div style={{ flex: 1, padding: '2px 4px' }}>
              <span style={{ fontSize: 6, color: '#444', textTransform: 'uppercase' }}>Protocolo de Autorização: </span>
              <span style={{ fontWeight: 700, fontSize: 7, fontFamily: 'monospace' }}>{nf.protocolo}</span>
              {nf.dataAutorizacao && (
                <span style={{ fontSize: 7 }}> — {dtfmt(nf.dataAutorizacao)} {hrfmt(nf.dataAutorizacao)}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══ BLOCO 2 — ICMS Totais header ══ */}
      <div style={{ border: '1px solid #333', marginBottom: 2 }}>
        <CellRow>
          <Cell label="BC do ICMS" value={`R$ ${moeda(nf.baseICMS)}`} className="flex-1" />
          <Cell label="Valor do ICMS" value={`R$ ${moeda(nf.valorICMS)}`} className="flex-1" />
          <Cell label="BC do ICMS ST" value="—" className="flex-1" />
          <Cell label="Valor do ICMS ST" value="—" className="flex-1" />
          <Cell label="Valor Total dos Produtos" value={`R$ ${moeda(nf.valorProdutos)}`} className="flex-1" />
          <Cell label="Valor do Frete" value={nf.valorFrete > 0 ? `R$ ${moeda(nf.valorFrete)}` : '—'} className="flex-1" />
        </CellRow>
        <CellRow>
          <Cell label="Valor do Seguro" value="—" className="flex-1" />
          <Cell label="Desconto" value={nf.valorDesconto > 0 ? `R$ ${moeda(nf.valorDesconto)}` : '—'} className="flex-1" />
          <Cell label="Outras Despesas" value="—" className="flex-1" />
          <Cell label="Valor do IPI" value={`R$ ${moeda(nf.valorIPI)}`} className="flex-1" />
          <Cell label="Valor Total da Nota" value={`R$ ${moeda(nf.valorTotal)}`} className="flex-1" style={{ fontWeight: 700 }} />
        </CellRow>
      </div>

      {/* ══ BLOCO 3 — Emitente (dados completos) ══ */}
      <div style={{ border: '1px solid #333', marginBottom: 2 }}>
        <div style={{ padding: '2px 4px', borderBottom: '1px solid #333', fontSize: 6, fontWeight: 700, textTransform: 'uppercase', backgroundColor: '#f0f0f0' }}>
          Emitente
        </div>
        <CellRow>
          <Cell label="Nome / Razão Social" value={cfg.razaoSocial} className="flex-1" />
          <Cell label="CNPJ" value={fmtCNPJ(cfg.cnpj)} style={{ width: 130 }} />
          <Cell label="Data de Emissão" value={dtfmt(nf.dataEmissao)} style={{ width: 90 }} />
        </CellRow>
        <CellRow>
          <Cell label="Endereço" value={`${cfg.logradouro}, ${cfg.numero}`} className="flex-1" />
          <Cell label="Bairro" value={cfg.bairro} style={{ width: 100 }} />
          <Cell label="CEP" value={cfg.cep} style={{ width: 80 }} />
          <Cell label="Município" value={cfg.municipio} style={{ width: 100 }} />
          <Cell label="UF" value={cfg.uf} style={{ width: 30 }} />
        </CellRow>
        <CellRow>
          <Cell label="Inscrição Estadual" value={cfg.ie} className="flex-1" />
          <Cell label="Insc. Est. Subst. Tributário" value="—" className="flex-1" />
          <Cell label="CNAE" value={cfg.cnae} className="flex-1" />
          <Cell label="Regime Tributário" value={cfg.regimeTributario.replace(/_/g, ' ')} className="flex-1" />
        </CellRow>
      </div>

      {/* ══ BLOCO 4 — Destinatário ══ */}
      <div style={{ border: '1px solid #333', marginBottom: 2 }}>
        <div style={{ padding: '2px 4px', borderBottom: '1px solid #333', fontSize: 6, fontWeight: 700, textTransform: 'uppercase', backgroundColor: '#f0f0f0' }}>
          Destinatário / Remetente
        </div>
        <CellRow>
          <Cell label="Nome / Razão Social" value={nf.destinatario} className="flex-1" />
          <Cell label="CNPJ / CPF" value={nf.destinatarioCnpjCpf || 'Consumidor Final'} style={{ width: 130 }} />
          <Cell label="Data de Saída / Entrada" value={dtfmt(nf.dataEmissao)} style={{ width: 90 }} />
        </CellRow>
        <CellRow>
          <Cell label="Endereço" value={nf.enderecoEntrega || '—'} className="flex-1" />
          <Cell label="Bairro" value="—" style={{ width: 100 }} />
          <Cell label="CEP" value="—" style={{ width: 80 }} />
          <Cell label="Município" value="—" style={{ width: 100 }} />
          <Cell label="UF" value={nf.destinatarioUF} style={{ width: 30 }} />
        </CellRow>
        <CellRow>
          <Cell label="Telefone" value={nf.destinatarioEmail ? `E-mail: ${nf.destinatarioEmail}` : '—'} className="flex-1" />
          <Cell label="Inscrição Estadual" value="—" className="flex-1" />
          <Cell label="Inscrição SUFRAMA" value="—" className="flex-1" />
        </CellRow>
      </div>

      {/* ══ BLOCO 5 — Fatura ══ */}
      {nf.pedidoNumero && (
        <div style={{ border: '1px solid #333', marginBottom: 2 }}>
          <div style={{ padding: '2px 4px', borderBottom: '1px solid #333', fontSize: 6, fontWeight: 700, textTransform: 'uppercase', backgroundColor: '#f0f0f0' }}>
            Fatura
          </div>
          <CellRow>
            <Cell label="Número do Pedido" value={nf.pedidoNumero} className="flex-1" />
            <Cell label="Vencimento" value={dtfmt(nf.dataEmissao)} className="flex-1" />
            <Cell label="Valor Fatura" value={`R$ ${moeda(nf.valorTotal)}`} className="flex-1" />
          </CellRow>
        </div>
      )}

      {/* ══ BLOCO 6 — Produtos ══ */}
      <div style={{ border: '1px solid #333', marginBottom: 2 }}>
        <div style={{ padding: '2px 4px', borderBottom: '1px solid #333', fontSize: 6, fontWeight: 700, textTransform: 'uppercase', backgroundColor: '#f0f0f0' }}>
          Dados dos Produtos / Serviços
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 7 }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              {['#', 'Cód. Produto', 'Descrição do Produto / Serviço', 'NCM/SH', 'O/CST', 'CFOP', 'Un.', 'Qtd', 'Vl. Unit.', 'Vl. Total', 'BC ICMS', 'Vl. ICMS', 'Vl. IPI', 'Al. ICMS', 'Al. IPI'].map(h => (
                <th key={h} style={{ border: '0.5px solid #ccc', padding: '2px 2px', fontWeight: 700, textAlign: 'center', fontSize: 6, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nf.itens.map((it, idx) => (
              <tr key={it.id} style={{ borderBottom: '0.5px solid #ddd' }}>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'center', fontFamily: 'monospace' }}>{idx + 1}</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'center', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{it.id}</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', maxWidth: 160 }}>{it.descricao}</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'center', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{it.ncm}</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'center' }}>{it.csosn ?? it.cst ?? '—'}</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'center', fontFamily: 'monospace' }}>{it.cfop}</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'center' }}>{it.unidade}</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'right', whiteSpace: 'nowrap' }}>{it.quantidade}</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'right', whiteSpace: 'nowrap' }}>{moeda(it.valorUnitario)}</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap' }}>{moeda(it.valorTotal)}</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'right', whiteSpace: 'nowrap' }}>{moeda(it.baseICMS)}</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'right', whiteSpace: 'nowrap' }}>{moeda(it.valorICMS)}</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'right', whiteSpace: 'nowrap' }}>{moeda(it.valorPIS + it.valorCOFINS)}</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'right', whiteSpace: 'nowrap' }}>{it.aliquotaICMS.toFixed(2)}%</td>
                <td style={{ border: '0.5px solid #ddd', padding: '2px', textAlign: 'right', whiteSpace: 'nowrap' }}>—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ══ BLOCO 7 — Cálculo do Imposto ══ */}
      <div style={{ border: '1px solid #333', marginBottom: 2 }}>
        <div style={{ padding: '2px 4px', borderBottom: '1px solid #333', fontSize: 6, fontWeight: 700, textTransform: 'uppercase', backgroundColor: '#f0f0f0' }}>
          Cálculo do Imposto
        </div>
        <CellRow>
          <Cell label="Base de Cálculo do ICMS" value={`R$ ${moeda(nf.baseICMS)}`} className="flex-1" />
          <Cell label="Valor do ICMS" value={`R$ ${moeda(nf.valorICMS)}`} className="flex-1" />
          <Cell label="Base de Cálculo ICMS ST" value="R$ 0,00" className="flex-1" />
          <Cell label="Valor do ICMS ST" value="R$ 0,00" className="flex-1" />
          <Cell label="Valor Total do IPI" value={`R$ ${moeda(nf.valorIPI)}`} className="flex-1" />
          <Cell label="Valor Total da Nota" value={`R$ ${moeda(nf.valorTotal)}`} className="flex-1" />
        </CellRow>
        <CellRow>
          <Cell label="Valor do PIS" value={`R$ ${moeda(nf.valorPIS)}`} className="flex-1" />
          <Cell label="Valor do COFINS" value={`R$ ${moeda(nf.valorCOFINS)}`} className="flex-1" />
          <Cell label="Valor do ISS" value={`R$ ${moeda(nf.valorISS)}`} className="flex-1" />
          <Cell label="Outras Despesas" value="R$ 0,00" className="flex-1" />
          <Cell label="Desconto" value={`R$ ${moeda(nf.valorDesconto)}`} className="flex-1" />
          <Cell label="Total de Impostos" value={`R$ ${moeda(totalImpostos)}`} className="flex-1" />
        </CellRow>
      </div>

      {/* ══ BLOCO 8 — Transporte ══ */}
      <div style={{ border: '1px solid #333', marginBottom: 2 }}>
        <div style={{ padding: '2px 4px', borderBottom: '1px solid #333', fontSize: 6, fontWeight: 700, textTransform: 'uppercase', backgroundColor: '#f0f0f0' }}>
          Transportador / Volumes Transportados
        </div>
        <CellRow>
          <Cell label="Razão Social" value="—" className="flex-1" />
          <Cell label="Frete por conta" value="0 – Emitente" style={{ width: 100 }} />
          <Cell label="CNPJ / CPF" value="—" style={{ width: 130 }} />
        </CellRow>
        <CellRow>
          <Cell label="Endereço" value="—" className="flex-1" />
          <Cell label="Município" value="—" style={{ width: 120 }} />
          <Cell label="UF" value="—" style={{ width: 30 }} />
          <Cell label="Inscrição Estadual" value="—" style={{ width: 100 }} />
        </CellRow>
        <CellRow>
          <Cell label="Quantidade" value="—" className="flex-1" />
          <Cell label="Espécie" value="—" className="flex-1" />
          <Cell label="Marca" value="—" className="flex-1" />
          <Cell label="Numeração" value="—" className="flex-1" />
          <Cell label="Peso Bruto" value="—" className="flex-1" />
          <Cell label="Peso Líquido" value="—" className="flex-1" />
        </CellRow>
      </div>

      {/* ══ BLOCO 9 — Inf. Adicionais + QR ══ */}
      <div style={{ border: '1px solid #333', marginBottom: 2, display: 'flex' }}>
        {/* Info adicional */}
        <div style={{ flex: 1, borderRight: '1px solid #333' }}>
          <div style={{ padding: '2px 4px', borderBottom: '1px solid #333', fontSize: 6, fontWeight: 700, textTransform: 'uppercase', backgroundColor: '#f0f0f0' }}>
            Informações Adicionais de Interesse do Contribuinte
          </div>
          <div style={{ padding: 4, fontSize: 7, minHeight: 50, lineHeight: 1.4 }}>
            {nf.informacoesAdicionais || nf.observacoes || ''}
            {nf.pedidoNumero && ` Pedido nº ${nf.pedidoNumero}.`}
            {' '}
            Documento emitido por ME ou EPP optante pelo Simples Nacional.
            Não gera direito a crédito fiscal de ICMS, de IPI ou de ISS.
          </div>
        </div>
        {/* Reservado Fisco */}
        <div style={{ width: 120 }}>
          <div style={{ padding: '2px 4px', borderBottom: '1px solid #333', fontSize: 6, fontWeight: 700, textTransform: 'uppercase', backgroundColor: '#f0f0f0' }}>
            Reservado ao Fisco
          </div>
          <div style={{ padding: 4, textAlign: 'center' }}>
            {nf.chaveAcesso && <QrPlaceholder size={80} />}
          </div>
        </div>
      </div>

      {/* ══ Rodapé ══ */}
      <div style={{ borderTop: '1px solid #ccc', marginTop: 4, paddingTop: 3, textAlign: 'center', fontSize: 6, color: '#666' }}>
        Consulte a autenticidade desta NF-e no portal da SEFAZ: www.nfe.fazenda.gov.br
        {nf.status === 'CANCELADA' && <span style={{ color: '#cc0000', fontWeight: 700, marginLeft: 8 }}>*** NF-e CANCELADA — Protocolo: {nf.protocoloCancelamento} ***</span>}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DanfePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: nf, isLoading: loadNF } = useNotaFiscal(id);
  const { data: cfg, isLoading: loadCfg } = useConfiguracaoFiscal();

  useEffect(() => {
    if (nf && cfg) {
      const timer = setTimeout(() => window.print(), 800);
      return () => clearTimeout(timer);
    }
  }, [nf, cfg]);

  const loading = loadNF || loadCfg;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-marca-500" />
    </div>
  );

  if (!nf || !cfg) return (
    <div className="flex items-center justify-center min-h-screen text-slate-500">
      Nota fiscal não encontrada
    </div>
  );

  const n = nf as NotaFiscal;
  const c = cfg as ConfiguracaoFiscal;

  return (
    <>
      {/* ── Barra de ações (oculta na impressão) ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; background: white; }
          #danfe-print { box-shadow: none !important; margin: 0 !important; }
        }
        @page {
          size: A4;
          margin: 6mm;
        }
      `}</style>

      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-slate-800 text-white flex items-center gap-3 px-4 py-2 shadow-lg print:hidden">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm hover:bg-slate-700 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <span className="text-slate-400 text-sm flex-1">
          DANFE — NF-e nº {n.numero} · {n.destinatario}
        </span>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg bg-marca-600 hover:bg-marca-700 px-4 py-1.5 text-sm font-semibold transition-colors"
        >
          <Printer className="h-4 w-4" /> Imprimir / Salvar PDF
        </button>
      </div>

      {/* ── Conteúdo do DANFE ── */}
      <div className="no-print" style={{ height: 48 }} /> {/* Espaço para a barra */}
      <div style={{ backgroundColor: '#e5e7eb', padding: '16px 0', minHeight: '100vh' }}>
        <DanfeDocument nf={n} cfg={c} />
      </div>
    </>
  );
}
