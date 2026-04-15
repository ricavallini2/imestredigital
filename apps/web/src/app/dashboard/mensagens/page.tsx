'use client';

import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import {
  Search, Send, Paperclip, Smile, X, ArrowLeft,
  CheckCheck, Check, Reply, Trash2, MoreVertical,
  FileText, File, Download, Copy, ImageIcon,
  MessageSquare, Users, Pencil, SquarePen,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Usuario {
  id: string; nome: string; cargo: string;
  online: boolean; ultimaVez?: string;
}

interface Anexo {
  id: string; nome: string;
  tipo: 'imagem' | 'pdf' | 'doc' | 'outro';
  tamanho: number; url?: string;
}

interface Reacao { emoji: string; autorIds: string[]; }

interface Mensagem {
  id: string; conversaId: string; autorId: string;
  texto: string; anexos: Anexo[];
  criadoEm: string; editadoEm?: string;
  lidaPor: string[]; deletada?: boolean;
  replyTo?: string;
  reacoes: Reacao[];
}

interface Conversa {
  id: string;
  participantesIds: string[];
  criadoEm: string;
  atualizadoEm: string;
}

// ─── Mock users ───────────────────────────────────────────────────────────────

const USUARIOS: Usuario[] = [
  { id: 'u1', nome: 'João Silva',    cargo: 'Gerente',    online: true },
  { id: 'u2', nome: 'Maria Costa',   cargo: 'Operadora',  online: true },
  { id: 'u3', nome: 'Pedro Alves',   cargo: 'Vendedor',   online: false, ultimaVez: '30 min' },
  { id: 'u4', nome: 'Ana Ferreira',  cargo: 'Financeiro', online: true },
  { id: 'u5', nome: 'Carlos Mendes', cargo: 'TI',         online: false, ultimaVez: '2 h' },
];

const AUTO_REPLIES: Record<string, string[]> = {
  u1: ['Entendido, obrigado!', 'Perfeito, vou verificar.', 'Ok, pode deixar.', 'Certo!', 'Aguardo retorno.'],
  u2: ['Ok!', 'Anotado.', 'Com certeza!', 'Farei isso já.', 'Pode contar comigo.'],
  u3: ['Valeu!', 'Obrigado pela ajuda!', 'Entendido.', 'Beleza, obrigado!'],
  u4: ['Confirmado.', 'Recebido, vou analisar.', 'Ok, obrigada!', 'Certo, verifico aqui.'],
  u5: ['Certo!', 'Feito.', 'Já verifico aqui.', 'Ok, pode ser.', 'Entendido!'],
};

const EMOJIS_REACAO = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const EMOJIS_INPUT = [
  '😀','😂','😊','😍','🤔','😅','🥳','😎','😢','😮',
  '👍','👎','🙏','💪','🎉','🔥','💯','✅','❌','⚡',
  '📎','📋','📊','📈','💡','🚀','⭐','💬','🤝','✉️',
];

const LS_CONVERSAS = 'chat-conversas-v1';
const LS_MENSAGENS = 'chat-mensagens-v1';
const LS_NAOLIGADAS = 'chat-nao-lidas';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function iniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatGrupoData(iso: string) {
  const d = new Date(iso); const hj = new Date();
  const on = new Date(hj); on.setDate(hj.getDate() - 1);
  if (d.toDateString() === hj.toDateString()) return 'Hoje';
  if (d.toDateString() === on.toDateString()) return 'Ontem';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
}

function formatTamanho(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function tipoAnexo(nome: string): Anexo['tipo'] {
  const ext = nome.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg','jpeg','png','gif','webp'].includes(ext)) return 'imagem';
  if (ext === 'pdf') return 'pdf';
  if (['doc','docx','xls','xlsx','txt','csv'].includes(ext)) return 'doc';
  return 'outro';
}

const CORES_AVATAR = [
  'bg-violet-500','bg-blue-500','bg-emerald-500',
  'bg-amber-500','bg-rose-500','bg-cyan-500','bg-indigo-500',
];
function corAvatar(nome: string) {
  return CORES_AVATAR[nome.charCodeAt(0) % CORES_AVATAR.length];
}

function emitirNaoLidas(total: number) {
  try {
    localStorage.setItem(LS_NAOLIGADAS, String(total));
    window.dispatchEvent(new CustomEvent('chat-unread-changed', { detail: total }));
  } catch { /* ignore */ }
}

function carregarDados(): { conversas: Conversa[]; mensagens: Mensagem[] } {
  try {
    const c = localStorage.getItem(LS_CONVERSAS);
    const m = localStorage.getItem(LS_MENSAGENS);
    return { conversas: c ? JSON.parse(c) : [], mensagens: m ? JSON.parse(m) : [] };
  } catch { return { conversas: [], mensagens: [] }; }
}

function salvarDados(conversas: Conversa[], mensagens: Mensagem[]) {
  try {
    localStorage.setItem(LS_CONVERSAS, JSON.stringify(conversas));
    localStorage.setItem(LS_MENSAGENS, JSON.stringify(mensagens));
  } catch { /* ignore */ }
}

function buildSeed(uid: string): { conversas: Conversa[]; mensagens: Mensagem[] } {
  const t = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
  const msg = (id: string, cId: string, aId: string, txt: string, em: string, extra?: Partial<Mensagem>): Mensagem =>
    ({ id, conversaId: cId, autorId: aId, texto: txt, anexos: [], criadoEm: em,
       lidaPor: [aId, uid], deletada: false, reacoes: [], ...extra });

  return {
    conversas: [
      { id: 'c1', participantesIds: [uid, 'u1'], criadoEm: t(120), atualizadoEm: t(3) },
      { id: 'c2', participantesIds: [uid, 'u2'], criadoEm: t(240), atualizadoEm: t(50) },
      { id: 'c3', participantesIds: [uid, 'u3'], criadoEm: t(500), atualizadoEm: t(210) },
    ],
    mensagens: [
      msg('m01','c1','u1','Bom dia! Pode verificar o pedido #1045?', t(65)),
      msg('m02','c1', uid,'Bom dia! Vou verificar agora mesmo.', t(63)),
      msg('m03','c1','u1','Obrigado! O cliente está aguardando.', t(58)),
      msg('m04','c1', uid,'Pedido localizado. Está em separação no estoque.', t(52)),
      msg('m05','c1','u1','Perfeito! Quando sai para entrega?', t(50)),
      msg('m06','c1', uid,'Previsão para amanhã pela manhã.', t(12)),
      msg('m07','c1','u1','Ótimo! Vou informar o cliente.', t(5), { lidaPor: ['u1'] }),
      msg('m08','c1','u1','Pode me enviar o número de rastreio quando disponível?', t(3), { lidaPor: ['u1'] }),
      msg('m09','c2', uid,'Maria, o relatório de estoque ficou excelente!', t(90)),
      msg('m10','c2','u2','Obrigada! Dediquei bastante tempo.', t(80)),
      msg('m11','c2', uid,'Podemos agendar reunião para revisar?', t(62)),
      msg('m12','c2','u2','Claro! Amanhã às 10h está bom?', t(50)),
      msg('m13','c3','u3','Boa tarde! Tem como me ajudar com o cadastro do cliente João Freitas?', t(220), { lidaPor: ['u3'] }),
    ],
  };
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function AvatarUser({ u, size = 'md' }: { u: Usuario; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sz = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }[size];
  const dot = size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';
  return (
    <div className="relative shrink-0">
      <div className={`${sz} rounded-full ${corAvatar(u.nome)} flex items-center justify-center font-bold text-white`}>
        {iniciais(u.nome)}
      </div>
      {u.online && (
        <span className={`absolute bottom-0 right-0 ${dot} rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-800`} />
      )}
    </div>
  );
}

// ─── File icon ────────────────────────────────────────────────────────────────

function IconeAnexo({ tipo }: { tipo: Anexo['tipo'] }) {
  if (tipo === 'imagem') return <ImageIcon className="h-4 w-4" />;
  if (tipo === 'pdf')    return <FileText className="h-4 w-4 text-red-500" />;
  if (tipo === 'doc')    return <FileText className="h-4 w-4 text-blue-500" />;
  return <File className="h-4 w-4" />;
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function DigitandoIndicador() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-500 animate-bounce"
            style={{ animationDelay: `${i * 160}ms` }} />
        ))}
      </div>
      <span className="text-xs text-slate-400">digitando...</span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MensagensPage() {
  const [conversas,  setConversas]  = useState<Conversa[]>([]);
  const [mensagens,  setMensagens]  = useState<Mensagem[]>([]);
  const [cidAtivo,   setCidAtivo]   = useState<string | null>(null);
  const [texto,      setTexto]      = useState('');
  const [anexosPend, setAnexosPend] = useState<Anexo[]>([]);
  const [replyTo,    setReplyTo]    = useState<Mensagem | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editTexto,  setEditTexto]  = useState('');
  const [busca,      setBusca]      = useState('');
  const [digitando,  setDigitando]  = useState(false);
  const [emojiFor,   setEmojiFor]   = useState<string | null>(null); // msgId showing emoji picker
  const [showEmojiInput, setShowEmojiInput] = useState(false);
  const [novaConversa,   setNovaConversa]   = useState(false);
  const [menuMsgId,  setMenuMsgId]  = useState<string | null>(null);
  const [toast,      setToast]      = useState<{ msg: string; nome: string } | null>(null);

  const fileRef    = useRef<HTMLInputElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const textareaRef= useRef<HTMLTextAreaElement>(null);
  const dropRef    = useRef<HTMLDivElement>(null);

  // Derive current user id from localStorage (set by mock login)
  const currentUid = useMemo(() => {
    try {
      const u = localStorage.getItem('user');
      if (u) return JSON.parse(u).id ?? 'admin';
    } catch { /* ignore */ }
    return 'admin';
  }, []);

  const currentUser: Usuario = useMemo(() => ({
    id: currentUid, nome: 'Você (Admin)',
    cargo: 'Administrador', online: true,
  }), [currentUid]);

  // ── Init ──
  useEffect(() => {
    let { conversas: c, mensagens: m } = carregarDados();
    if (c.length === 0) {
      const seed = buildSeed(currentUid);
      c = seed.conversas; m = seed.mensagens;
      salvarDados(c, m);
    }
    setConversas(c);
    setMensagens(m);
    // emit unread count
    const naoLidas = calcNaoLidas(m, c, currentUid);
    emitirNaoLidas(naoLidas);
  }, [currentUid]);

  // ── Scroll to bottom when messages change ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, cidAtivo, digitando]);

  // ── Close menus on outside click ──
  useEffect(() => {
    const h = () => { setMenuMsgId(null); setEmojiFor(null); setShowEmojiInput(false); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  // ── Persist whenever data changes ──
  useEffect(() => {
    if (conversas.length > 0) {
      salvarDados(conversas, mensagens);
      emitirNaoLidas(calcNaoLidas(mensagens, conversas, currentUid));
    }
  }, [conversas, mensagens, currentUid]);

  // ── Mark messages as read when opening a conversation ──
  useEffect(() => {
    if (!cidAtivo) return;
    setMensagens(prev => prev.map(m =>
      m.conversaId === cidAtivo && !m.lidaPor.includes(currentUid)
        ? { ...m, lidaPor: [...m.lidaPor, currentUid] }
        : m
    ));
  }, [cidAtivo, currentUid]);

  // ─── Derived ───────────────────────────────────────────────────────────────

  function calcNaoLidas(msgs: Mensagem[], convs: Conversa[], uid: string) {
    return msgs.filter(m => m.autorId !== uid && !m.lidaPor.includes(uid) && !m.deletada).length;
  }

  const conversasComInfo = useMemo(() => {
    return conversas.map(c => {
      const outroId = c.participantesIds.find(id => id !== currentUid) ?? '';
      const outro   = USUARIOS.find(u => u.id === outroId) ?? { id: outroId, nome: outroId, cargo: '', online: false };
      const msgs    = mensagens.filter(m => m.conversaId === c.id);
      const ultima  = msgs.at(-1);
      const naoLidas= msgs.filter(m => m.autorId !== currentUid && !m.lidaPor.includes(currentUid) && !m.deletada).length;
      return { ...c, outro, ultima, naoLidas };
    }).sort((a, b) => new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime());
  }, [conversas, mensagens, currentUid]);

  const conversasFiltradas = useMemo(() => {
    if (!busca.trim()) return conversasComInfo;
    const q = busca.toLowerCase();
    return conversasComInfo.filter(c =>
      c.outro.nome.toLowerCase().includes(q) ||
      c.ultima?.texto.toLowerCase().includes(q)
    );
  }, [conversasComInfo, busca]);

  const mensagensAtivas = useMemo(() =>
    mensagens.filter(m => m.conversaId === cidAtivo)
      .sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime()),
    [mensagens, cidAtivo]
  );

  const conversaAtivaInfo = useMemo(() =>
    conversasComInfo.find(c => c.id === cidAtivo),
    [conversasComInfo, cidAtivo]
  );

  // ─── File handling ─────────────────────────────────────────────────────────

  const processFiles = useCallback((files: FileList | File[]) => {
    Array.from(files).forEach(file => {
      const tipo = tipoAnexo(file.name);
      const anexo: Anexo = { id: `a-${Date.now()}-${Math.random()}`, nome: file.name, tipo, tamanho: file.size };
      if (tipo === 'imagem') {
        const reader = new FileReader();
        reader.onload = e => {
          setAnexosPend(prev => [...prev, { ...anexo, url: e.target?.result as string }]);
        };
        reader.readAsDataURL(file);
      } else {
        setAnexosPend(prev => [...prev, anexo]);
      }
    });
  }, []);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  // ─── Send ──────────────────────────────────────────────────────────────────

  const enviar = useCallback(() => {
    if (!cidAtivo || (!texto.trim() && anexosPend.length === 0)) return;
    const msg: Mensagem = {
      id: `m-${Date.now()}`,
      conversaId: cidAtivo,
      autorId: currentUid,
      texto: texto.trim(),
      anexos: anexosPend,
      criadoEm: new Date().toISOString(),
      lidaPor: [currentUid],
      deletada: false,
      replyTo: replyTo?.id,
      reacoes: [],
    };
    setMensagens(prev => [...prev, msg]);
    setConversas(prev => prev.map(c => c.id === cidAtivo ? { ...c, atualizadoEm: msg.criadoEm } : c));
    setTexto('');
    setAnexosPend([]);
    setReplyTo(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Simulate auto-reply
    const conv = conversas.find(c => c.id === cidAtivo);
    const outroId = conv?.participantesIds.find(id => id !== currentUid);
    if (outroId && AUTO_REPLIES[outroId]) {
      setDigitando(true);
      const delay = 1500 + Math.random() * 2000;
      setTimeout(() => {
        const replies = AUTO_REPLIES[outroId];
        const reply: Mensagem = {
          id: `m-${Date.now()}`,
          conversaId: cidAtivo,
          autorId: outroId,
          texto: replies[Math.floor(Math.random() * replies.length)],
          anexos: [], criadoEm: new Date().toISOString(),
          lidaPor: [outroId], deletada: false, reacoes: [],
        };
        setDigitando(false);
        setMensagens(prev => [...prev, reply]);
        setConversas(prev => prev.map(c => c.id === cidAtivo ? { ...c, atualizadoEm: reply.criadoEm } : c));
      }, delay);
    }
  }, [cidAtivo, texto, anexosPend, replyTo, conversas, currentUid]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
  };

  // ─── Message actions ───────────────────────────────────────────────────────

  const deletarMsg = (id: string) => {
    setMensagens(prev => prev.map(m => m.id === id ? { ...m, deletada: true, texto: '', anexos: [] } : m));
    setMenuMsgId(null);
  };

  const copiarTexto = (txt: string) => {
    navigator.clipboard.writeText(txt).catch(() => {});
    setMenuMsgId(null);
  };

  const salvarEdicao = (id: string) => {
    if (!editTexto.trim()) return;
    setMensagens(prev => prev.map(m => m.id === id ? { ...m, texto: editTexto.trim(), editadoEm: new Date().toISOString() } : m));
    setEditandoId(null);
  };

  const reagir = (msgId: string, emoji: string) => {
    setMensagens(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const reacoes = m.reacoes.map(r => ({ ...r, autorIds: [...r.autorIds] }));
      const idx = reacoes.findIndex(r => r.emoji === emoji);
      if (idx === -1) {
        reacoes.push({ emoji, autorIds: [currentUid] });
      } else {
        const aIdx = reacoes[idx].autorIds.indexOf(currentUid);
        if (aIdx === -1) reacoes[idx].autorIds.push(currentUid);
        else reacoes[idx].autorIds.splice(aIdx, 1);
        if (reacoes[idx].autorIds.length === 0) reacoes.splice(idx, 1);
      }
      return { ...m, reacoes };
    }));
    setEmojiFor(null);
  };

  // ─── New conversation ──────────────────────────────────────────────────────

  const iniciarConversa = (outroId: string) => {
    const existe = conversas.find(c =>
      c.participantesIds.includes(currentUid) && c.participantesIds.includes(outroId)
    );
    if (existe) { setCidAtivo(existe.id); setNovaConversa(false); return; }
    const nova: Conversa = {
      id: `c-${Date.now()}`,
      participantesIds: [currentUid, outroId],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    setConversas(prev => [...prev, nova]);
    setCidAtivo(nova.id);
    setNovaConversa(false);
  };

  // ─── Render helpers ────────────────────────────────────────────────────────

  // Group messages: add date separator + compact consecutive same-author within 3min
  type GroupedItem = { type: 'date'; label: string } | { type: 'msg'; msg: Mensagem; compact: boolean };
  const grouped = useMemo((): GroupedItem[] => {
    const items: GroupedItem[] = [];
    let lastDate = '';
    let lastAuthor = '';
    let lastTime = 0;
    mensagensAtivas.forEach(msg => {
      const dateLabel = formatGrupoData(msg.criadoEm);
      if (dateLabel !== lastDate) {
        items.push({ type: 'date', label: dateLabel });
        lastDate = dateLabel; lastAuthor = ''; lastTime = 0;
      }
      const t = new Date(msg.criadoEm).getTime();
      const compact = msg.autorId === lastAuthor && (t - lastTime) < 3 * 60_000;
      items.push({ type: 'msg', msg, compact });
      lastAuthor = msg.autorId; lastTime = t;
    });
    return items;
  }, [mensagensAtivas]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-4.5rem)] -m-4 md:-m-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">

      {/* ── LEFT: conversation list ── */}
      <div className={`w-80 shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-700 ${cidAtivo ? 'hidden md:flex' : 'flex'}`}>

        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-700 shrink-0">
          <h1 className="font-bold text-slate-900 dark:text-slate-100 text-base">Mensagens</h1>
          <button
            onClick={() => setNovaConversa(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Nova conversa"
          >
            <SquarePen className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              value={busca} onChange={e => setBusca(e.target.value)}
              placeholder="Buscar conversas..."
              className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none"
            />
            {busca && <button onClick={() => setBusca('')}><X className="h-3 w-3 text-slate-400" /></button>}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {conversasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-slate-400 px-4">
              <MessageSquare className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm text-center">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            conversasFiltradas.map(c => (
              <button
                key={c.id}
                onClick={() => setCidAtivo(c.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 text-left
                  ${cidAtivo === c.id ? 'bg-marca-50 dark:bg-marca-900/20 border-l-4 border-l-marca-500' : ''}`}
              >
                <AvatarUser u={c.outro} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold truncate ${c.naoLidas > 0 ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                      {c.outro.nome}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                      {c.ultima ? formatHora(c.ultima.criadoEm) : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className={`text-xs truncate flex-1 ${c.naoLidas > 0 ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-400'}`}>
                      {c.ultima
                        ? c.ultima.deletada ? 'Mensagem excluída'
                          : c.ultima.autorId === currentUid ? `Você: ${c.ultima.texto || '📎 Anexo'}`
                          : c.ultima.texto || '📎 Anexo'
                        : 'Nenhuma mensagem ainda'
                      }
                    </p>
                    {c.naoLidas > 0 && (
                      <span className="ml-2 shrink-0 rounded-full bg-marca-600 px-1.5 py-0.5 text-[10px] font-bold text-white min-w-[18px] text-center">
                        {c.naoLidas}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Online users quick bar */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 shrink-0">
          <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Online agora</p>
          <div className="flex gap-1.5 flex-wrap">
            {USUARIOS.filter(u => u.online).map(u => (
              <button key={u.id} onClick={() => iniciarConversa(u.id)} title={u.nome}>
                <AvatarUser u={u} size="sm" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: chat window ── */}
      {cidAtivo && conversaAtivaInfo ? (
        <div
          className="flex-1 flex flex-col min-w-0"
          ref={dropRef}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
        >
          {/* Chat header */}
          <div className="h-14 flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-900">
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setCidAtivo(null)}
            >
              <ArrowLeft className="h-4 w-4 text-slate-500" />
            </button>
            <AvatarUser u={conversaAtivaInfo.outro} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
                {conversaAtivaInfo.outro.nome}
              </p>
              <p className="text-xs">
                {conversaAtivaInfo.outro.online
                  ? <span className="text-emerald-500 font-medium">Online</span>
                  : <span className="text-slate-400">Visto há {conversaAtivaInfo.outro.ultimaVez ?? 'algum tempo'}</span>
                }
              </p>
            </div>
            <span className="text-xs text-slate-400 hidden sm:block">{conversaAtivaInfo.outro.cargo}</span>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5 bg-slate-50 dark:bg-slate-800/30">
            {grouped.map((item, idx) => {
              if (item.type === 'date') return (
                <div key={`d-${idx}`} className="flex items-center gap-3 py-3">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <span className="text-[11px] text-slate-400 font-medium px-2 bg-slate-50 dark:bg-slate-800/30">
                    {item.label}
                  </span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>
              );

              const { msg, compact } = item;
              const mine = msg.autorId === currentUid;
              const autor = mine ? currentUser : USUARIOS.find(u => u.id === msg.autorId) ?? { id: msg.autorId, nome: msg.autorId, cargo: '', online: false };
              const replyMsg = msg.replyTo ? mensagens.find(m => m.id === msg.replyTo) : null;
              const replyAutor = replyMsg ? (replyMsg.autorId === currentUid ? currentUser : USUARIOS.find(u => u.id === replyMsg.autorId)) : null;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 group ${mine ? 'flex-row-reverse' : 'flex-row'} ${compact ? 'mt-0.5' : 'mt-3'}`}
                >
                  {/* Avatar — only for first in group */}
                  <div className="w-8 shrink-0">
                    {!compact && !mine && <AvatarUser u={autor as Usuario} size="sm" />}
                  </div>

                  <div className={`flex flex-col max-w-[72%] ${mine ? 'items-end' : 'items-start'}`}>
                    {/* Author name (first in group, not mine) */}
                    {!compact && !mine && (
                      <span className="text-[11px] text-slate-400 mb-1 ml-1">{autor.nome}</span>
                    )}

                    {/* Reply quote */}
                    {replyMsg && !msg.deletada && (
                      <div className={`mb-1 px-2 py-1.5 rounded-lg border-l-4 bg-slate-100 dark:bg-slate-700/60 border-marca-400 text-xs max-w-full`}>
                        <p className="font-semibold text-marca-600 dark:text-marca-400 mb-0.5">
                          {replyAutor?.nome ?? 'Usuário'}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 truncate">
                          {replyMsg.deletada ? 'Mensagem excluída' : replyMsg.texto || '📎 Anexo'}
                        </p>
                      </div>
                    )}

                    <div className="relative">
                      {/* Bubble */}
                      {editandoId === msg.id ? (
                        <div className="flex gap-2 items-end">
                          <textarea
                            className="rounded-2xl border border-marca-400 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none focus:outline-none min-w-[200px]"
                            value={editTexto}
                            rows={2}
                            onChange={e => setEditTexto(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); salvarEdicao(msg.id); }
                              if (e.key === 'Escape') setEditandoId(null);
                            }}
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <button onClick={() => salvarEdicao(msg.id)}
                              className="p-1.5 rounded-lg bg-marca-600 text-white hover:bg-marca-700">
                              <Check className="h-3 w-3" />
                            </button>
                            <button onClick={() => setEditandoId(null)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`relative px-3 py-2 rounded-2xl text-sm break-words
                            ${msg.deletada
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 italic'
                              : mine
                              ? 'bg-marca-600 text-white rounded-br-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm rounded-bl-sm border border-slate-100 dark:border-slate-700'
                            }`}
                        >
                          {msg.deletada ? (
                            <span className="flex items-center gap-1">
                              <Trash2 className="h-3 w-3" /> Mensagem excluída
                            </span>
                          ) : (
                            <>
                              {msg.texto && <p className="leading-relaxed whitespace-pre-wrap">{msg.texto}</p>}
                              {/* Attachments */}
                              {msg.anexos.map(a => (
                                <div key={a.id} className="mt-1.5">
                                  {a.tipo === 'imagem' && a.url ? (
                                    <img src={a.url} alt={a.nome}
                                      className="max-w-[220px] max-h-[180px] rounded-xl object-cover cursor-pointer"
                                      onClick={() => window.open(a.url, '_blank')}
                                    />
                                  ) : (
                                    <div className={`flex items-center gap-2 rounded-xl px-3 py-2 mt-1 ${mine ? 'bg-white/15' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
                                      <IconeAnexo tipo={a.tipo} />
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-medium truncate ${mine ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>{a.nome}</p>
                                        <p className={`text-[10px] ${mine ? 'text-white/70' : 'text-slate-400'}`}>{formatTamanho(a.tamanho)}</p>
                                      </div>
                                      <Download className={`h-3.5 w-3.5 shrink-0 ${mine ? 'text-white/80' : 'text-slate-400'}`} />
                                    </div>
                                  )}
                                </div>
                              ))}
                              {msg.editadoEm && (
                                <span className={`text-[9px] ${mine ? 'text-white/60' : 'text-slate-400'}`}> (editado)</span>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      {/* Action buttons on hover */}
                      {!msg.deletada && editandoId !== msg.id && (
                        <div className={`absolute top-0 ${mine ? 'right-full mr-1' : 'left-full ml-1'}
                          opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5`}
                          onClick={e => e.stopPropagation()}
                        >
                          <button onClick={() => setReplyTo(msg)}
                            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                            title="Responder">
                            <Reply className="h-3 w-3 text-slate-500" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={e => { e.nativeEvent.stopImmediatePropagation(); setEmojiFor(v => v === msg.id ? null : msg.id); }}
                              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                              title="Reagir">
                              <Smile className="h-3 w-3 text-slate-500" />
                            </button>
                            {emojiFor === msg.id && (
                              <div className={`absolute z-30 bottom-full mb-1 ${mine ? 'right-0' : 'left-0'}
                                flex gap-1 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-600 rounded-2xl px-2 py-1.5`}
                                onClick={e => e.nativeEvent.stopImmediatePropagation()}>
                                {EMOJIS_REACAO.map(e => (
                                  <button key={e} onClick={() => reagir(msg.id, e)}
                                    className="text-lg hover:scale-125 transition-transform p-0.5">{e}</button>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <button
                              onClick={e => { e.nativeEvent.stopImmediatePropagation(); setMenuMsgId(v => v === msg.id ? null : msg.id); }}
                              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                              <MoreVertical className="h-3 w-3 text-slate-500" />
                            </button>
                            {menuMsgId === msg.id && (
                              <div className={`absolute z-30 bottom-full mb-1 ${mine ? 'right-0' : 'left-0'}
                                w-40 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden`}
                                onClick={e => e.nativeEvent.stopImmediatePropagation()}>
                                {msg.texto && (
                                  <button onClick={() => copiarTexto(msg.texto)}
                                    className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                                    <Copy className="h-3.5 w-3.5" /> Copiar texto
                                  </button>
                                )}
                                {mine && (
                                  <button onClick={() => { setEditandoId(msg.id); setEditTexto(msg.texto); setMenuMsgId(null); }}
                                    className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                                    <Pencil className="h-3.5 w-3.5" /> Editar mensagem
                                  </button>
                                )}
                                {mine && (
                                  <button onClick={() => deletarMsg(msg.id)}
                                    className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                    <Trash2 className="h-3.5 w-3.5" /> Excluir mensagem
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reactions */}
                    {msg.reacoes.filter(r => r.autorIds.length > 0).length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {msg.reacoes.filter(r => r.autorIds.length > 0).map(r => (
                          <button key={r.emoji} onClick={() => reagir(msg.id, r.emoji)}
                            className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] border transition-colors
                              ${r.autorIds.includes(currentUid)
                                ? 'bg-marca-100 dark:bg-marca-900/30 border-marca-300 dark:border-marca-700'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:bg-slate-50'
                              }`}>
                            {r.emoji} <span className="text-slate-600 dark:text-slate-400">{r.autorIds.length}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Timestamp + read receipt */}
                    <div className={`flex items-center gap-1 mt-0.5 ${mine ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[10px] text-slate-400">{formatHora(msg.criadoEm)}</span>
                      {mine && !msg.deletada && (
                        msg.lidaPor.some(id => id !== currentUid)
                          ? <CheckCheck className="h-3 w-3 text-marca-500" />
                          : <Check className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {digitando && conversaAtivaInfo && (
              <div className="flex items-end gap-2 mt-3">
                <div className="w-8 shrink-0">
                  <AvatarUser u={conversaAtivaInfo.outro} size="sm" />
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 dark:border-slate-700 px-3 py-2">
                  <DigitandoIndicador />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Reply bar */}
          {replyTo && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-marca-50 dark:bg-marca-900/20 border-t border-marca-200 dark:border-marca-800">
              <div className="flex-1 border-l-4 border-marca-400 pl-2.5">
                <p className="text-[11px] font-semibold text-marca-600 dark:text-marca-400">
                  {replyTo.autorId === currentUid ? 'Você' : USUARIOS.find(u => u.id === replyTo.autorId)?.nome}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {replyTo.texto || '📎 Anexo'}
                </p>
              </div>
              <button onClick={() => setReplyTo(null)}
                className="p-1 rounded-lg hover:bg-marca-100 dark:hover:bg-marca-900/40">
                <X className="h-3.5 w-3.5 text-marca-500" />
              </button>
            </div>
          )}

          {/* Attachments pending preview */}
          {anexosPend.length > 0 && (
            <div className="flex gap-2 px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 overflow-x-auto bg-white dark:bg-slate-900">
              {anexosPend.map((a, i) => (
                <div key={a.id} className="relative shrink-0">
                  {a.tipo === 'imagem' && a.url ? (
                    <img src={a.url} alt={a.nome}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-600" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center gap-1">
                      <IconeAnexo tipo={a.tipo} />
                      <span className="text-[8px] text-slate-400 text-center px-1 truncate w-full">{a.nome.split('.').pop()?.toUpperCase()}</span>
                    </div>
                  )}
                  <button onClick={() => setAnexosPend(prev => prev.filter((_, j) => j !== i))}
                    className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-red-500 text-white flex items-center justify-center">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
            <input type="file" ref={fileRef} className="hidden" multiple onChange={handleFiles} />

            {/* Emoji picker */}
            {showEmojiInput && (
              <div className="mb-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-xl grid grid-cols-10 gap-0.5"
                onClick={e => e.nativeEvent.stopImmediatePropagation()}>
                {EMOJIS_INPUT.map(e => (
                  <button key={e} onClick={() => setTexto(prev => prev + e)}
                    className="text-xl hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg p-1 transition-colors">
                    {e}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
                title="Anexar arquivo"
              >
                <Paperclip className="h-4.5 w-4.5 text-slate-500" />
              </button>
              <button
                onClick={e => { e.nativeEvent.stopImmediatePropagation(); setShowEmojiInput(v => !v); }}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
                title="Emoji"
              >
                <Smile className="h-4.5 w-4.5 text-slate-500" />
              </button>
              <textarea
                ref={textareaRef}
                value={texto}
                onChange={e => {
                  setTexto(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder="Digite uma mensagem... (Enter para enviar, Shift+Enter para nova linha)"
                rows={1}
                className="flex-1 resize-none rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-400 focus:border-transparent transition-all max-h-[120px]"
              />
              <button
                onClick={enviar}
                disabled={!texto.trim() && anexosPend.length === 0}
                className="p-2.5 rounded-xl bg-marca-600 hover:bg-marca-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 shadow-sm"
                title="Enviar"
              >
                <Send className="h-4.5 w-4.5 text-white" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 text-center">
              Arraste arquivos para a conversa para anexar · Shift+Enter para nova linha
            </p>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex-1 hidden md:flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/30 gap-4">
          <div className="w-20 h-20 rounded-3xl bg-marca-100 dark:bg-marca-900/30 flex items-center justify-center">
            <MessageSquare className="h-10 w-10 text-marca-500" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Selecione uma conversa</p>
            <p className="text-sm mt-1">ou inicie uma nova mensagem</p>
          </div>
          <button
            onClick={() => setNovaConversa(true)}
            className="flex items-center gap-2 rounded-xl bg-marca-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-marca-700 transition-colors shadow-sm"
          >
            <SquarePen className="h-4 w-4" /> Nova conversa
          </button>
        </div>
      )}

      {/* ── Modal: Nova conversa ── */}
      {novaConversa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <Users className="h-5 w-5 text-marca-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Nova Conversa</h3>
              </div>
              <button onClick={() => setNovaConversa(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <div className="p-3 space-y-1">
              {USUARIOS.map(u => {
                const jaConversa = conversas.find(c =>
                  c.participantesIds.includes(currentUid) && c.participantesIds.includes(u.id)
                );
                return (
                  <button key={u.id} onClick={() => iniciarConversa(u.id)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left">
                    <AvatarUser u={u} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{u.nome}</p>
                      <p className="text-xs text-slate-400">{u.cargo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {u.online
                        ? <span className="text-xs text-emerald-500 font-medium">Online</span>
                        : <span className="text-xs text-slate-400">Offline</span>
                      }
                      {jaConversa && (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-full">
                          Existente
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Toast: nova mensagem em outra conversa ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 dark:bg-slate-700 text-white px-4 py-3 rounded-2xl shadow-2xl max-w-xs">
          <MessageSquare className="h-4 w-4 text-marca-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-marca-400">{toast.nome}</p>
            <p className="text-sm truncate">{toast.msg}</p>
          </div>
          <button onClick={() => setToast(null)}><X className="h-3.5 w-3.5 text-slate-400" /></button>
        </div>
      )}
    </div>
  );
}
