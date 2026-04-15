'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Upload, FileText, CheckCircle2, XCircle, Package, Users,
  Warehouse, DollarSign, FileCheck, ChevronRight, RotateCcw,
  Eye, Loader2, AlertTriangle, Building2, ShoppingBag, ArrowLeft,
  Sparkles, FileX,
} from 'lucide-react';
import { useImportarNFe, type ResultadoImportacao } from '@/hooks/useCompras';

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dtfmt = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

type Step = 'upload' | 'processing' | 'success' | 'error';

// ─── XML de Exemplo ───────────────────────────────────────────────────────────

const EXEMPLO_XML = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc versao="4.00">
  <NFe>
    <infNFe Id="NFe35240312345678000190550010001234561234567890">
      <ide>
        <nNF>123456</nNF>
        <serie>1</serie>
        <dhEmi>2024-03-20T10:30:00-03:00</dhEmi>
        <natOp>COMPRA DE MERCADORIA</natOp>
      </ide>
      <emit>
        <CNPJ>12345678000190</CNPJ>
        <xNome>Fornecedor Exemplo Ltda</xNome>
        <xFant>FornExemplo</xFant>
        <IE>123456789000</IE>
        <fone>1134567890</fone>
        <enderEmit>
          <xLgr>Av. Exemplo</xLgr>
          <nro>100</nro>
          <xBairro>Centro</xBairro>
          <xMun>São Paulo</xMun>
          <UF>SP</UF>
          <CEP>01310100</CEP>
        </enderEmit>
      </emit>
      <det nItem="1">
        <prod>
          <cProd>PROD001</cProd>
          <cEAN>7891234567890</cEAN>
          <xProd>Produto Exemplo 1</xProd>
          <NCM>85171200</NCM>
          <CFOP>1102</CFOP>
          <uCom>UN</uCom>
          <qCom>10.0000</qCom>
          <vUnCom>150.00</vUnCom>
          <vProd>1500.00</vProd>
        </prod>
        <imposto>
          <ICMS><ICMS00><vICMS>270.00</vICMS></ICMS00></ICMS>
          <PIS><PISAliq><vPIS>9.75</vPIS></PISAliq></PIS>
          <COFINS><COFINSAliq><vCOFINS>45.00</vCOFINS></COFINSAliq></COFINS>
        </imposto>
      </det>
      <total>
        <ICMSTot>
          <vProd>1500.00</vProd>
          <vFrete>50.00</vFrete>
          <vSeg>0.00</vSeg>
          <vDesc>0.00</vDesc>
          <vIPI>0.00</vIPI>
          <vICMS>270.00</vICMS>
          <vPIS>9.75</vPIS>
          <vCOFINS>45.00</vCOFINS>
          <vNF>1550.00</vNF>
          <vTotTrib>324.75</vTotTrib>
        </ICMSTot>
      </total>
      <pag>
        <detPag>
          <tPag>15</tPag>
          <vPag>1550.00</vPag>
        </detPag>
      </pag>
    </infNFe>
  </NFe>
</nfeProc>`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ImportarNFePage() {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [xmlContent, setXmlContent] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showExemplo, setShowExemplo] = useState(false);
  const [result, setResult] = useState<ResultadoImportacao | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [errorDicas, setErrorDicas] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: importar } = useImportarNFe();

  const resetar = () => {
    setStep('upload');
    setFile(null);
    setXmlContent('');
    setResult(null);
    setErrorMsg('');
    setErrorDicas([]);
    setIsDragOver(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processarArquivo = useCallback((f: File) => {
    if (!f.name.endsWith('.xml')) {
      setErrorMsg('Arquivo inválido. Selecione um arquivo .xml de NF-e.');
      setErrorDicas(['O arquivo deve ter extensão .xml', 'Certifique-se de que é uma NF-e válida']);
      setStep('error');
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setXmlContent(text);
    };
    reader.readAsText(f, 'UTF-8');
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) processarArquivo(f);
    },
    [processarArquivo],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processarArquivo(f);
  };

  const processarXML = () => {
    if (!xmlContent) return;
    setStep('processing');

    importar(
      { xml: xmlContent },
      {
        onSuccess: (data) => {
          setResult(data);
          setStep('success');
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ?? 'Erro ao processar a NF-e. Tente novamente.';
          const dicas: string[] = err?.response?.data?.dicas ?? [
            'Verifique se o arquivo é uma NF-e válida (layout 4.00)',
            'Certifique-se que o encoding é UTF-8',
            'O XML deve conter a tag infNFe com Id="NFe..."',
            'Verifique se o arquivo não está corrompido ou truncado',
          ];
          setErrorMsg(msg);
          setErrorDicas(dicas);
          setStep('error');
        },
      },
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  // ─── Processing State ──────────────────────────────────────────────────────

  if (step === 'processing') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-marca-50 dark:bg-marca-900/20 flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-marca-600 animate-spin" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-destaque-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Processando NF-e...
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Analisando XML, identificando produtos e atualizando estoque
          </p>
        </div>
        <div className="flex flex-col gap-2 w-64">
          {['Lendo XML da NF-e', 'Identificando fornecedor', 'Localizando produtos', 'Atualizando estoque', 'Criando conta a pagar'].map(
            (label, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-marca-600 border-t-transparent animate-spin shrink-0" style={{ animationDelay: `${i * 0.2}s` }} />
                <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

  // ─── Success State ─────────────────────────────────────────────────────────

  if (step === 'success' && result) {
    const chaveShort = result.nfe.chave.length > 20
      ? `${result.nfe.chave.slice(0, 10)}...${result.nfe.chave.slice(-10)}`
      : result.nfe.chave;

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Importação concluída com sucesso!
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              NF-e {result.nfe.numero}/{result.nfe.serie} importada e todos os dados atualizados.
            </p>
          </div>
        </div>

        {/* Cards de resultado */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Card NF-e */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-2">
                <FileCheck className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Nota Fiscal Eletrônica</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Número</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {result.nfe.numero}/{result.nfe.serie}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Data de Emissão</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {result.nfe.dataEmissao ? dtfmt(result.nfe.dataEmissao) : '—'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Natureza</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-right max-w-[200px] truncate">
                  {result.nfe.naturezaOperacao}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Chave de Acesso</span>
                <span className="font-mono text-xs text-slate-500" title={result.nfe.chave}>
                  {chaveShort}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-100 dark:border-slate-700 pt-2 mt-2">
                <span className="text-slate-500">Valor Total</span>
                <span className="font-bold text-emerald-600">{fmt(result.nfe.totais.valorTotal)}</span>
              </div>
            </div>
          </div>

          {/* Card Fornecedor */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 p-2">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Fornecedor</h3>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    result.fornecedor.criado
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {result.fornecedor.criado ? 'Novo!' : 'Encontrado'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Razão Social</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-right max-w-[200px] truncate">
                  {result.fornecedor.dados.razaoSocial}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">CNPJ</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {result.fornecedor.dados.cnpj}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Cidade/UF</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {result.fornecedor.dados.endereco.cidade}/{result.fornecedor.dados.endereco.uf}
                </span>
              </div>
              {result.fornecedor.criado && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 px-3 py-2 mt-2">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Fornecedor criado automaticamente. Acesse Fornecedores para completar o cadastro.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card Produtos */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-xl bg-orange-50 dark:bg-orange-900/20 p-2">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Produtos ({result.produtos.length})
              </h3>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {result.produtos.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 flex-1 truncate">
                    {p.nome}
                  </span>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {p.quantidade}x
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      p.criado
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    }`}
                  >
                    {p.criado ? 'Criado' : 'Atualizado'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cards Estoque e Financeiro */}
          <div className="flex flex-col gap-4">
            {/* Estoque */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-2">
                  <Warehouse className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Estoque</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-emerald-600">
                  {result.estoque.itensAtualizados}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {result.estoque.itensAtualizados === 1 ? 'item atualizado' : 'itens atualizados'}
                  </p>
                  <p className="text-xs text-slate-400">Depósito Principal</p>
                </div>
              </div>
            </div>

            {/* Financeiro */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="rounded-xl bg-rose-50 dark:bg-rose-900/20 p-2">
                  <DollarSign className="h-5 w-5 text-rose-600" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Financeiro</h3>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Conta a pagar criada</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {fmt(result.financeiro.valor)}
                </p>
                <p className="text-xs text-slate-400">
                  Vencimento: {dtfmt(result.financeiro.vencimento)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href={`/dashboard/compras/${result.compra.id}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-marca-600 hover:bg-marca-700 px-6 py-3 text-sm font-semibold text-white transition-colors shadow-sm"
          >
            <Eye className="h-4 w-4" />
            Ver Compra #{result.compra.numero}
          </Link>
          <button
            onClick={resetar}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-6 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Importar outra NF-e
          </button>
          <Link
            href="/dashboard/compras"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-6 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Ver todas as compras
          </Link>
        </div>
      </div>
    );
  }

  // ─── Error State ───────────────────────────────────────────────────────────

  if (step === 'error') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/10 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-red-100 dark:bg-red-900/30 p-3 shrink-0">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-red-800 dark:text-red-300 text-lg mb-1">
                Erro ao importar NF-e
              </h2>
              <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
            </div>
          </div>
        </div>

        {errorDicas.length > 0 && (
          <div className="rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                Verifique os seguintes pontos:
              </p>
            </div>
            <ul className="space-y-1.5">
              {errorDicas.map((dica, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
                  <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />
                  {dica}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={resetar}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-marca-600 hover:bg-marca-700 px-5 py-3 text-sm font-semibold text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Tentar novamente
          </button>
          <Link
            href="/dashboard/compras"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>
      </div>
    );
  }

  // ─── Upload State ──────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/compras"
          className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Importar NF-e
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Faça upload do XML da nota fiscal para importar automaticamente
          </p>
        </div>
      </div>

      {/* Como funciona */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Upload, label: '1. Upload do XML', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { icon: FileText, label: '2. Leitura automática', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { icon: Warehouse, label: '3. Estoque atualizado', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { icon: DollarSign, label: '4. Conta a pagar criada', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
        ].map(({ icon: Icon, label, color, bg }) => (
          <div key={label} className={`rounded-xl ${bg} p-3 flex flex-col items-center gap-2 text-center`}>
            <Icon className={`h-5 w-5 ${color}`} />
            <p className={`text-xs font-medium ${color}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Zona de upload */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => !file && fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-4 transition-all cursor-pointer ${
          isDragOver
            ? 'border-marca-500 bg-marca-50 dark:bg-marca-900/20 scale-[1.01]'
            : file
            ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10 cursor-default'
            : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:border-marca-400 hover:bg-marca-50/50 dark:hover:bg-marca-900/10'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xml"
          className="hidden"
          onChange={handleFileChange}
        />

        {file ? (
          <>
            <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 p-4">
              <FileCheck className="h-10 w-10 text-emerald-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{file.name}</p>
              <p className="text-sm text-slate-500 mt-0.5">{formatBytes(file.size)}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); resetar(); }}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors underline"
            >
              Remover arquivo
            </button>
          </>
        ) : (
          <>
            <div className={`rounded-2xl p-4 transition-colors ${isDragOver ? 'bg-marca-100 dark:bg-marca-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
              <Upload className={`h-10 w-10 transition-colors ${isDragOver ? 'text-marca-600' : 'text-slate-400'}`} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {isDragOver ? 'Solte o arquivo aqui' : 'Arraste e solte o arquivo XML aqui'}
              </p>
              <p className="text-sm text-slate-500 mt-1">ou</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
            >
              Clique para selecionar arquivo
            </button>
            <p className="text-xs text-slate-400">Apenas arquivos .xml de NF-e (layout 4.00)</p>
          </>
        )}
      </div>

      {/* Botão processar */}
      {file && (
        <button
          onClick={processarXML}
          disabled={!xmlContent}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-destaque-500 hover:bg-destaque-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3.5 text-base font-semibold text-white transition-colors shadow-sm"
        >
          {!xmlContent ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Lendo arquivo...</>
          ) : (
            <><Sparkles className="h-5 w-5" /> Processar XML e Importar NF-e</>
          )}
        </button>
      )}

      {/* Exemplo XML */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <button
          onClick={() => setShowExemplo(!showExemplo)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileX className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Ver exemplo de XML NF-e
            </span>
          </div>
          <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${showExemplo ? 'rotate-90' : ''}`} />
        </button>
        {showExemplo && (
          <div className="border-t border-slate-100 dark:border-slate-700 p-4">
            <pre className="text-xs text-slate-600 dark:text-slate-400 overflow-x-auto bg-slate-50 dark:bg-slate-900 rounded-xl p-4 font-mono leading-relaxed max-h-64 overflow-y-auto">
              {EXEMPLO_XML}
            </pre>
            <p className="text-xs text-slate-400 mt-2">
              Este é um XML de exemplo simplificado. A NF-e real deve conter todos os campos obrigatórios do layout 4.00.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
