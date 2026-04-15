'use client';

/**
 * Componente Logo iMestreDigital.
 *
 * Usa o PNG em /public/logo.png quando disponível.
 * Tem um SVG inline fiel ao logo como fallback.
 *
 * Variantes:
 *  - completo   → logo iMD completo (ícone + "MD")
 *  - icone      → apenas o ícone de rede digital
 *  - sidebar    → versão otimizada para barra lateral (altura 32px)
 */

import Image from 'next/image';
import { useState } from 'react';

// ─── SVG inline (fiel ao logo original) ──────────────────────

function LogoSVG({ altura = 40, className = '' }: { altura?: number; className?: string }) {
  const largura = Math.round(altura * 2.55);
  return (
    <svg
      width={largura}
      height={altura}
      viewBox="0 0 255 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="iMestreDigital"
    >
      <defs>
        <linearGradient id="gradBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="gradArc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="60%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* ── Ícone digital (esquerda — representa o "i") ── */}
      {/* Quadrado grande principal */}
      <rect x="8" y="18" width="22" height="22" rx="4" fill="url(#gradBlue)" />
      {/* Quadrado médio superior direito */}
      <rect x="36" y="8" width="16" height="16" rx="3" fill="#38BDF8" opacity="0.85" />
      {/* Quadrado pequeno esquerda */}
      <rect x="0" y="46" width="13" height="13" rx="2.5" fill="#60A5FA" opacity="0.8" />
      {/* Quadrado menor centro */}
      <rect x="30" y="38" width="10" height="10" rx="2" fill="#3B82F6" opacity="0.7" />
      {/* Micro quadrado superior */}
      <rect x="50" y="4" width="7" height="7" rx="1.5" fill="#93C5FD" opacity="0.6" />
      {/* Micro quadrado direita */}
      <rect x="56" y="18" width="5" height="5" rx="1" fill="#BFDBFE" opacity="0.5" />

      {/* Nós de conexão (círculos) */}
      <circle cx="19" cy="54" r="3.5" fill="#2563EB" />
      <circle cx="44" cy="28" r="4" fill="#1D4ED8" />
      <circle cx="58" cy="8" r="3" fill="#3B82F6" opacity="0.8" />

      {/* Linhas de conexão */}
      <line x1="19" y1="40" x2="19" y2="54" stroke="#3B82F6" strokeWidth="1.5" opacity="0.6" />
      <line x1="44" y1="24" x2="58" y2="8" stroke="#60A5FA" strokeWidth="1.5" opacity="0.5" />
      <line x1="30" y1="29" x2="44" y2="28" stroke="#60A5FA" strokeWidth="1.2" opacity="0.5" />

      {/* Arco curvo azul (swoosh principal) */}
      <path
        d="M 6 72 Q 55 88 110 76 Q 150 68 175 72"
        stroke="url(#gradArc)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Segundo arco mais fino */}
      <path
        d="M 10 79 Q 58 92 115 82 Q 152 75 172 78"
        stroke="#DBEAFE"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* ── Texto "MD" (direita) ── */}
      <text
        x="82"
        y="66"
        fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif"
        fontWeight="800"
        fontSize="58"
        fill="#0F172A"
        letterSpacing="-1"
      >
        MD
      </text>
    </svg>
  );
}

function IconeSVG({ tamanho = 32, className = '' }: { tamanho?: number; className?: string }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="iMD ícone"
    >
      <defs>
        <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="20" height="20" rx="4" fill="url(#grad2)" />
      <rect x="28" y="4" width="14" height="14" rx="3" fill="#38BDF8" opacity="0.85" />
      <rect x="0" y="36" width="12" height="12" rx="2.5" fill="#60A5FA" opacity="0.8" />
      <rect x="26" y="30" width="9" height="9" rx="2" fill="#3B82F6" opacity="0.7" />
      <circle cx="14" cy="44" r="3" fill="#2563EB" />
      <circle cx="36" cy="20" r="3.5" fill="#1D4ED8" />
      <line x1="14" y1="30" x2="14" y2="44" stroke="#3B82F6" strokeWidth="1.5" opacity="0.6" />
      <path
        d="M 2 56 Q 32 64 62 54"
        stroke="#3B82F6"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Props ────────────────────────────────────────────────────

interface LogoProps {
  variante?: 'completo' | 'icone';
  altura?: number;
  className?: string;
}

// ─── Componente principal ─────────────────────────────────────

export function Logo({ variante = 'completo', altura = 40, className = '' }: LogoProps) {
  const [usarSVG, setUsarSVG] = useState(false);

  if (variante === 'icone') {
    return <IconeSVG tamanho={altura} className={className} />;
  }

  const largura = Math.round(altura * 2.55);

  if (usarSVG) {
    return <LogoSVG altura={altura} className={className} />;
  }

  return (
    <Image
      src="/logo.png"
      alt="iMestreDigital"
      width={largura}
      height={altura}
      className={`object-contain ${className}`}
      priority
      unoptimized
      onError={() => setUsarSVG(true)}
    />
  );
}

// ─── Variantes prontas para uso ───────────────────────────────

/** Logo para telas de login/registro — grande com tagline */
export function LogoAuth() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Logo variante="completo" altura={52} />
      <p className="text-sm text-slate-500 dark:text-slate-400">
        ERP Inteligente para Comércio
      </p>
    </div>
  );
}

/** Logo para sidebar — compacto, com ou sem texto */
export function LogoSidebar({ recolhido = false }: { recolhido?: boolean }) {
  if (recolhido) {
    return <Logo variante="icone" altura={32} />;
  }
  return <Logo variante="completo" altura={32} />;
}
