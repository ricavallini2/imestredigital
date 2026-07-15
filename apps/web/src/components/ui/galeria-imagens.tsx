'use client';

import { useRef, useState } from 'react';
import {
  ImagePlus,
  Link2,
  Star,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Upload,
  Info,
  AlertTriangle,
} from 'lucide-react';

/**
 * Galeria de imagens do produto — padrão e-commerce.
 *
 * - A PRIMEIRA imagem é a CAPA (principal) do produto e do anúncio.
 * - Ordem importa: é a sequência exibida na vitrine/marketplace.
 * - Trabalha com URLs (compatível com marketplaces, que consomem URLs públicas).
 * - Upload local converte para data URL (bom p/ preview e uso interno); para
 *   publicar em marketplace o ideal é uma URL hospedada (CDN) — avisamos abaixo.
 *
 * `value` é a lista de URLs; `onChange` devolve a nova lista. A capa é sempre
 * `value[0]`. Componente controlado, sem estado de imagens próprio.
 */
export function GaleriaImagens({
  value,
  onChange,
  editavel = true,
  max = 8,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  editavel?: boolean;
  max?: number;
}) {
  const [urlInput, setUrlInput] = useState('');
  const [erro, setErro] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const imagens = value ?? [];

  const ehImagemValida = (u: string) => /^https?:\/\/.+/i.test(u) || u.startsWith('data:image/');

  const adicionar = (urls: string[]) => {
    const limpos = urls.map((u) => u.trim()).filter(Boolean);
    const invalida = limpos.find((u) => !ehImagemValida(u));
    if (invalida) {
      setErro('URL inválida. Use um endereço http(s) de imagem.');
      return;
    }
    const novos = [...imagens];
    for (const u of limpos) if (!novos.includes(u)) novos.push(u);
    onChange(novos.slice(0, max));
    setErro('');
  };

  const adicionarUrl = () => {
    if (!urlInput.trim()) return;
    adicionar([urlInput]);
    setUrlInput('');
  };

  const remover = (i: number) => onChange(imagens.filter((_, j) => j !== i));

  const mover = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= imagens.length) return;
    const novo = [...imagens];
    [novo[i], novo[j]] = [novo[j], novo[i]];
    onChange(novo);
  };

  const definirCapa = (i: number) => {
    if (i === 0) return;
    const novo = [...imagens];
    const [img] = novo.splice(i, 1);
    novo.unshift(img);
    onChange(novo);
  };

  const onArquivos = (files: FileList | null) => {
    if (!files || !files.length) return;
    const restante = max - imagens.length;
    const alvo = Array.from(files).slice(0, Math.max(0, restante));
    Promise.all(
      alvo.map(
        (f) =>
          new Promise<string>((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(String(r.result));
            r.onerror = () => rej();
            r.readAsDataURL(f);
          }),
      ),
    )
      .then((dataUrls) => adicionar(dataUrls))
      .catch(() => setErro('Não foi possível ler o arquivo de imagem.'));
    if (fileRef.current) fileRef.current.value = '';
  };

  const cheio = imagens.length >= max;

  return (
    <div className="space-y-4">
      {/* Grade de imagens */}
      {imagens.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {imagens.map((url, i) => (
            <div
              key={url + i}
              className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Imagem ${i + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
                }}
              />
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-md bg-marca-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
                  <Star className="h-2.5 w-2.5 fill-white" /> Capa
                </span>
              )}
              {url.startsWith('data:') && (
                <span className="absolute right-1.5 top-1.5 rounded bg-amber-500 px-1 py-0.5 text-[9px] font-bold text-white">
                  local
                </span>
              )}
              {editavel && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => mover(i, -1)}
                    disabled={i === 0}
                    className="rounded bg-white/90 p-1 text-slate-700 hover:bg-white disabled:opacity-30"
                    title="Mover para a esquerda"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => definirCapa(i)}
                      className="rounded bg-white/90 p-1 text-marca-600 hover:bg-white"
                      title="Definir como capa"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remover(i)}
                    className="rounded bg-white/90 p-1 text-red-600 hover:bg-white"
                    title="Remover"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => mover(i, 1)}
                    disabled={i === imagens.length - 1}
                    className="rounded bg-white/90 p-1 text-slate-700 hover:bg-white disabled:opacity-30"
                    title="Mover para a direita"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {/* Botão de adicionar (upload) inline na grade */}
          {editavel && !cheio && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-marca-400 hover:text-marca-500 dark:border-slate-600"
            >
              <ImagePlus className="h-6 w-6" />
              <span className="text-[10px] font-medium">Adicionar</span>
            </button>
          )}
        </div>
      ) : (
        editavel && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-10 text-slate-400 transition-colors hover:border-marca-400 hover:text-marca-500 dark:border-slate-600"
          >
            <Upload className="h-8 w-8" />
            <span className="text-sm font-medium">Enviar fotos do produto</span>
            <span className="text-xs">Clique para escolher ou arraste as imagens</span>
          </button>
        )
      )}

      {!editavel && imagens.length === 0 && (
        <p className="text-sm text-slate-400">Nenhuma imagem cadastrada.</p>
      )}

      {editavel && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onArquivos(e.target.files)}
          />

          {/* Adicionar por URL (recomendado para anúncios) */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    adicionarUrl();
                  }
                }}
                placeholder="Cole a URL da imagem (https://...)"
                disabled={cheio}
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-marca-400 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
            <button
              type="button"
              onClick={adicionarUrl}
              disabled={cheio || !urlInput.trim()}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Adicionar URL
            </button>
          </div>

          {erro && (
            <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" /> {erro}
            </p>
          )}

          {/* Guia de boas práticas e-commerce */}
          <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-700/30 dark:text-slate-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-marca-500" />
            <div className="space-y-0.5">
              <p>
                <strong className="text-slate-600 dark:text-slate-300">Padrão e-commerce:</strong>{' '}
                quadradas (1:1), no mínimo 1000×1000px, fundo branco na capa. Até {max} imagens ·{' '}
                {imagens.length}/{max} usadas.
              </p>
              <p>
                A <strong>capa</strong> é a primeira imagem — passe o mouse sobre uma foto para
                reordenar, definir capa ou remover. Fotos enviadas do computer ficam marcadas como{' '}
                <span className="font-semibold text-amber-600">local</span>; para publicar em
                marketplaces, use URLs hospedadas.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
