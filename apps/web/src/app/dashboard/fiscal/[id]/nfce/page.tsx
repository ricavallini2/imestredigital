'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Printer, ArrowLeft } from 'lucide-react';
import { useNotaFiscal, useConfiguracaoFiscal } from '@/hooks/useFiscal';
import type { NotaFiscal, ConfiguracaoFiscal } from '@/services/fiscal.service';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const moeda   = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dtfmt   = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');
const dthrfmt = (iso: string) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const fmtCNPJ = (v: string) => v.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
const fmtCPF  = (v: string) => v.replace(/\D/g, '').replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

function fmtDoc(v: string) {
  const d = v.replace(/\D/g, '');
  if (d.length === 14) return fmtCNPJ(d);
  if (d.length === 11) return fmtCPF(d);
  return v;
}

// ─── Linha separadora ──────────────────────────────────────────────────────────
function Sep({ style = 'solid' }: { style?: 'solid' | 'dashed' }) {
  return (
    <div style={{
      borderTop: style === 'dashed' ? '1px dashed #aaa' : '1px solid #666',
      margin: '4px 0',
    }} />
  );
}

// ─── QR Code placeholder ────────────────────────────────────────────────────────
function QrCode({ chave, size = 120 }: { chave: string; size?: number }) {
  // QR code visual simulated — in production use a real QR library
  return (
    <div style={{ textAlign: 'center', margin: '6px 0' }}>
      <div style={{
        display: 'inline-block', border: '3px solid #000',
        padding: 4, backgroundColor: '#fff',
      }}>
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
          {/* Finder patterns */}
          <rect x="2" y="2" width="28" height="28" fill="none" stroke="#000" strokeWidth="3" />
          <rect x="8" y="8" width="16" height="16" fill="#000" />
          <rect x="70" y="2" width="28" height="28" fill="none" stroke="#000" strokeWidth="3" />
          <rect x="76" y="8" width="16" height="16" fill="#000" />
          <rect x="2" y="70" width="28" height="28" fill="none" stroke="#000" strokeWidth="3" />
          <rect x="8" y="76" width="16" height="16" fill="#000" />
          {/* Simulated data modules */}
          {chave.split('').slice(0, 60).map((c, i) => {
            const col = (i % 8) * 5 + 36;
            const row = Math.floor(i / 8) * 5 + 10;
            return parseInt(c) % 2 === 0
              ? <rect key={i} x={col} y={row} width="4" height="4" fill="#000" />
              : null;
          })}
          {/* Bottom timing */}
          {Array.from({ length: 6 }).map((_, i) => (
            i % 2 === 0 ? <rect key={i} x={36 + i * 5} y={70} width="4" height="4" fill="#000" /> : null
          ))}
        </svg>
      </div>
    </div>
  );
}

// ─── NFC-e Coupon Document ─────────────────────────────────────────────────────
function NfceCoupon({ nf, cfg }: { nf: NotaFiscal; cfg: ConfiguracaoFiscal }) {
  const totalImpostos = nf.valorICMS + nf.valorPIS + nf.valorCOFINS + nf.valorIPI;
  const chave = nf.chaveAcesso ?? '';

  return (
    <div id="nfce-print" style={{
      width: 302, // ~80mm
      margin: '0 auto',
      backgroundColor: '#fff',
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: 10,
      color: '#000',
      padding: '6px 8px',
      boxSizing: 'border-box',
      lineHeight: 1.4,
    }}>
      {/* ── Cabeçalho empresa ── */}
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>
          {cfg.nomeFantasia || cfg.razaoSocial}
        </div>
        <div style={{ fontSize: 9, marginTop: 1 }}>{cfg.razaoSocial}</div>
        <div style={{ fontSize: 9 }}>{cfg.logradouro}, {cfg.numero} — {cfg.bairro}</div>
        <div style={{ fontSize: 9 }}>{cfg.municipio} / {cfg.uf} — CEP {cfg.cep}</div>
        <div style={{ fontSize: 9, marginTop: 2 }}>
          CNPJ: {fmtCNPJ(cfg.cnpj)}
        </div>
        {cfg.ie && <div style={{ fontSize: 9 }}>IE: {cfg.ie}</div>}
      </div>

      <Sep />

      {/* ── Identificação do documento ── */}
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 11 }}>
        NFC-e — NOTA FISCAL DE CONSUMIDOR ELETRÔNICA
      </div>
      <div style={{ textAlign: 'center', fontSize: 9, marginTop: 1 }}>
        Nº {nf.numero} · Série {nf.serie} · {dthrfmt(nf.dataEmissao)}
      </div>
      {nf.status === 'CANCELADA' && (
        <div style={{ textAlign: 'center', fontWeight: 700, color: '#cc0000', fontSize: 11, marginTop: 2 }}>
          *** DOCUMENTO CANCELADO ***
        </div>
      )}

      <Sep />

      {/* ── Destinatário / Consumidor ── */}
      {nf.destinatarioCnpjCpf ? (
        <div style={{ fontSize: 9 }}>
          <strong>CPF/CNPJ:</strong> {fmtDoc(nf.destinatarioCnpjCpf)}
          {nf.destinatario && nf.destinatario !== 'Consumidor Final' && (
            <div><strong>Nome:</strong> {nf.destinatario}</div>
          )}
        </div>
      ) : (
        <div style={{ fontSize: 9, textAlign: 'center', color: '#555' }}>Consumidor Final — Não Identificado</div>
      )}

      <Sep style="dashed" />

      {/* ── Itens ── */}
      <div style={{ marginBottom: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, fontWeight: 700, marginBottom: 2, borderBottom: '1px solid #ccc', paddingBottom: 1 }}>
          <span style={{ flex: 1 }}>ITEM</span>
          <span style={{ width: 28, textAlign: 'right' }}>QTD</span>
          <span style={{ width: 52, textAlign: 'right' }}>V.UNIT</span>
          <span style={{ width: 52, textAlign: 'right' }}>TOTAL</span>
        </div>

        {nf.itens.map((it, idx) => (
          <div key={it.id} style={{ marginBottom: 3 }}>
            <div style={{ fontSize: 9, lineHeight: 1.3, wordBreak: 'break-word' }}>
              {String(idx + 1).padStart(3, '0')} {it.descricao}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
              <span style={{ flex: 1, fontSize: 8, color: '#555' }}>
                {it.unidade} · NCM {it.ncm} · CFOP {it.cfop}
                {it.csosn ? ` · CSOSN ${it.csosn}` : it.cst ? ` · CST ${it.cst}` : ''}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
              <span style={{ flex: 1 }} />
              <span style={{ width: 28, textAlign: 'right' }}>{it.quantidade}</span>
              <span style={{ width: 52, textAlign: 'right' }}>{moeda(it.valorUnitario)}</span>
              <span style={{ width: 52, textAlign: 'right', fontWeight: 700 }}>{moeda(it.valorTotal)}</span>
            </div>
            {it.desconto > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 8, color: '#c00' }}>
                <span>Desconto: -{moeda(it.desconto)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Sep />

      {/* ── Totais ── */}
      <table style={{ width: '100%', fontSize: 10, borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ paddingBottom: 1 }}>Qtd. de Itens</td>
            <td style={{ textAlign: 'right', paddingBottom: 1 }}>{nf.qtdItens}</td>
          </tr>
          <tr>
            <td style={{ paddingBottom: 1 }}>Subtotal Produtos</td>
            <td style={{ textAlign: 'right', paddingBottom: 1 }}>R$ {moeda(nf.valorProdutos)}</td>
          </tr>
          {nf.valorDesconto > 0 && (
            <tr>
              <td style={{ paddingBottom: 1, color: '#c00' }}>Desconto</td>
              <td style={{ textAlign: 'right', paddingBottom: 1, color: '#c00' }}>-R$ {moeda(nf.valorDesconto)}</td>
            </tr>
          )}
          {nf.valorFrete > 0 && (
            <tr>
              <td style={{ paddingBottom: 1 }}>Frete</td>
              <td style={{ textAlign: 'right', paddingBottom: 1 }}>R$ {moeda(nf.valorFrete)}</td>
            </tr>
          )}
          <tr style={{ borderTop: '1px solid #333', fontSize: 13, fontWeight: 700 }}>
            <td style={{ paddingTop: 3 }}>TOTAL</td>
            <td style={{ textAlign: 'right', paddingTop: 3 }}>R$ {moeda(nf.valorTotal)}</td>
          </tr>
        </tbody>
      </table>

      <Sep style="dashed" />

      {/* ── Tributos ── */}
      <div style={{ fontSize: 8, color: '#555', lineHeight: 1.5 }}>
        <div style={{ fontWeight: 700, fontSize: 9, marginBottom: 1 }}>Tributos Federais / Estaduais:</div>
        <div>ICMS: R$ {moeda(nf.valorICMS)} &nbsp;|&nbsp; PIS: R$ {moeda(nf.valorPIS)} &nbsp;|&nbsp; COFINS: R$ {moeda(nf.valorCOFINS)}</div>
        <div style={{ marginTop: 1 }}>
          <strong>Total de Tributos Aprox.:</strong> R$ {moeda(totalImpostos)}
          {nf.valorTotal > 0 && ` (${((totalImpostos / nf.valorTotal) * 100).toFixed(2)}%)`}
          {' '}Fonte: IBPT
        </div>
      </div>

      <Sep style="dashed" />

      {/* ── Forma de Pagamento ── */}
      <div style={{ fontSize: 9 }}>
        <div style={{ fontWeight: 700, marginBottom: 2 }}>FORMA DE PAGAMENTO</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Dinheiro / Outros</span>
          <span>R$ {moeda(nf.valorTotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
          <span>Troco</span>
          <span>R$ 0,00</span>
        </div>
      </div>

      <Sep />

      {/* ── Chave de acesso + QR ── */}
      {chave && (
        <>
          <div style={{ textAlign: 'center', fontSize: 8, marginBottom: 4 }}>
            <div style={{ fontWeight: 700, marginBottom: 2, fontSize: 9 }}>Consulte pela chave de acesso:</div>
            <div style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: 0.5, wordBreak: 'break-all', lineHeight: 1.6, backgroundColor: '#f5f5f5', padding: '2px 4px', border: '1px solid #ddd', borderRadius: 2 }}>
              {chave.replace(/(.{4})/g, '$1 ').trim()}
            </div>
          </div>

          <QrCode chave={chave} size={120} />

          <div style={{ textAlign: 'center', fontSize: 8, color: '#555', marginTop: 2 }}>
            Leia o QR Code para verificar a autenticidade
          </div>
        </>
      )}

      {nf.protocolo && (
        <div style={{ textAlign: 'center', fontSize: 8, marginTop: 4 }}>
          <strong>Protocolo de Autorização:</strong>
          <div style={{ fontFamily: 'monospace', fontSize: 9 }}>{nf.protocolo}</div>
          {nf.dataAutorizacao && (
            <div style={{ fontSize: 8, color: '#555' }}>
              Autorizado em: {dthrfmt(nf.dataAutorizacao)}
            </div>
          )}
        </div>
      )}

      <Sep />

      {/* ── Informações adicionais ── */}
      {(nf.informacoesAdicionais || nf.observacoes) && (
        <>
          <div style={{ fontSize: 8, lineHeight: 1.5, color: '#444' }}>
            <div style={{ fontWeight: 700, marginBottom: 1 }}>Inf. Adicionais:</div>
            {nf.informacoesAdicionais || nf.observacoes}
          </div>
          <Sep style="dashed" />
        </>
      )}

      {/* ── Portal SEFAZ ── */}
      <div style={{ textAlign: 'center', fontSize: 8, color: '#666', lineHeight: 1.5 }}>
        Consulte em: www.nfce.fazenda.gov.br
        <br />
        Ambiente: {cfg.ambiente === 'HOMOLOGACAO' ? 'Homologação (sem valor fiscal)' : 'Produção'}
      </div>

      {/* ── Cancelada ── */}
      {nf.status === 'CANCELADA' && (
        <>
          <Sep />
          <div style={{ textAlign: 'center', fontWeight: 700, color: '#cc0000', fontSize: 10, lineHeight: 1.5 }}>
            *** NOTA FISCAL CANCELADA ***
            {nf.protocoloCancelamento && <><br />Protocolo: {nf.protocoloCancelamento}</>}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NfceCouponPage() {
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
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; background: white; }
          #nfce-print { box-shadow: none !important; margin: 0 !important; }
        }
        @page {
          size: 80mm auto;
          margin: 4mm;
        }
      `}</style>

      {/* ── Action bar (hidden on print) ── */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-slate-800 text-white flex items-center gap-3 px-4 py-2 shadow-lg">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <span className="text-slate-400 text-sm flex-1">
          NFC-e — Cupom nº {n.numero} · {n.destinatario}
        </span>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg bg-marca-600 hover:bg-marca-700 px-4 py-1.5 text-sm font-semibold transition-colors"
        >
          <Printer className="h-4 w-4" /> Imprimir / Salvar PDF
        </button>
      </div>

      <div className="no-print" style={{ height: 48 }} />

      {/* ── Coupon preview on screen ── */}
      <div style={{
        minHeight: '100vh', backgroundColor: '#e5e7eb',
        display: 'flex', justifyContent: 'center', padding: '20px 0',
      }}>
        <div style={{ backgroundColor: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', borderRadius: 4 }}>
          <NfceCoupon nf={n} cfg={c} />
        </div>
      </div>
    </>
  );
}
