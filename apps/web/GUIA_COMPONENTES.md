# Guia de Uso - Componentes Reutilizáveis

## KPICard

Exibe métricas com ícone, valor, label e variação percentual.

```tsx
import { KPICard } from '@/components/ui/kpi-card';

<KPICard
  label="Total de Vendas"
  valor="R$ 50k"
  icone={<ShoppingCart className="h-6 w-6" />}
  variacao={15}        // Percentual (positivo/negativo)
  unidade="reais"      // Opcional
  destaque={true}      // Cor destaque
/>
```

## StatusBadge

Badge colorido que muda cor baseado no status.

```tsx
import { StatusBadge } from '@/components/ui/status-badge';

<StatusBadge
  status="CONFIRMADO"   // Chave do status
  label="Confirmado"    // Texto exibido
  icone={<CheckCircle className="h-4 w-4" />}  // Opcional
/>
```

Status pré-configurados:
- Pedidos: PENDENTE, CONFIRMADO, SEPARANDO, ENVIADO, ENTREGUE, CANCELADO
- Produtos: ATIVO, INATIVO, RASCUNHO
- Estoque: NORMAL, BAIXO, CRITICO, SEM_ESTOQUE
- Fiscal: EMITIDA, PROCESSANDO, REJEITADA, CANCELADA
- Marketplace: CONECTADO, ERRO, DESCONECTADO

## DataTable

Tabela reutilizável com paginação, ordenação e ações.

```tsx
import { DataTable } from '@/components/ui/data-table';

interface Produto {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
}

<DataTable<Produto>
  columns={[
    {
      key: 'nome',
      label: 'Nome',
      sortable: true,
    },
    {
      key: 'preco',
      label: 'Preço',
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
  ]}
  data={produtos}
  itemsPerPage={10}
  selectable={true}
  onRowClick={(produto) => console.log(produto)}
  actions={[
    {
      label: 'Editar',
      icon: <Edit className="h-4 w-4" />,
      onClick: (produto) => { /* ... */ },
    },
    {
      label: 'Deletar',
      icon: <Trash2 className="h-4 w-4" />,
      danger: true,
      onClick: (produto) => { /* ... */ },
    },
  ]}
  emptyState={{
    title: 'Nenhum produto',
    description: 'Crie um novo produto',
  }}
/>
```

## FormField

Campo de formulário com validação visual.

```tsx
import { FormField } from '@/components/ui/form-field';

<FormField
  label="Email"
  type="email"
  placeholder="seu@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={erroEmail}      // Mostra em vermelho
  hint="Será usado para login"
  required={true}
  icon={<Mail className="h-5 w-5" />}
/>
```

## Modal

Modal com backdrop e conteúdo customizável.

```tsx
import { Modal } from '@/components/ui/modal';

<Modal
  isOpen={aberto}
  onClose={() => setAberto(false)}
  title="Deletar Produto?"
  size="md"  // sm, md, lg, xl
  footer={
    <div className="flex gap-3">
      <button onClick={() => setAberto(false)}>Cancelar</button>
      <button>Deletar</button>
    </div>
  }
>
  <p>Tem certeza que deseja deletar?</p>
</Modal>
```

## Tabs

Navegação por abas com conteúdo.

```tsx
import { Tabs } from '@/components/ui/tabs';

<Tabs
  tabs={[
    {
      id: 'info',
      label: 'Informações',
      icon: <Info className="h-4 w-4" />,
      content: <div>Conteúdo aqui</div>,
    },
    {
      id: 'precos',
      label: 'Preços',
      content: <div>Preços aqui</div>,
    },
  ]}
  defaultTab="info"
  onChange={(tabId) => console.log(tabId)}
/>
```

## Timeline

Timeline visual para histórico de eventos.

```tsx
import { Timeline } from '@/components/ui/timeline';

<Timeline
  steps={[
    {
      id: '1',
      label: 'Pedido Confirmado',
      description: 'Seu pedido foi recebido',
      timestamp: '2024-03-23 10:30',
      status: 'completed',
      icon: <CheckCircle className="h-6 w-6" />,
    },
    {
      id: '2',
      label: 'Em Processamento',
      status: 'pending',
    },
  ]}
/>
```

Status: `'completed' | 'pending' | 'error'`

## EmptyState

Estado vazio com ilustração e CTA.

```tsx
import { EmptyState } from '@/components/ui/empty-state';

<EmptyState
  icon={<ShoppingCart className="h-12 w-12" />}
  title="Nenhum pedido"
  description="Comece vendendo para ver seus pedidos aqui"
  action={{
    label: 'Criar Pedido',
    onClick: () => router.push('/criar-pedido'),
  }}
/>
```

## Loading

Componentes de loading.

```tsx
import { LoadingSpinner, Skeleton, SkeletonTable, SkeletonCard } from '@/components/ui/loading';

// Spinner animado
<LoadingSpinner size="md" text="Carregando..." />

// Skeleton genérico
<Skeleton className="h-6 w-1/2" />

// Tabela de skeletons
<SkeletonTable rows={5} />

// Card de skeleton
<SkeletonCard />
```

---

## Padrões de Uso

### Filtros em Listagens

```tsx
const [busca, setBusca] = useState('');
const [filtro, setFiltro] = useState('');

const filtrados = useMemo(() => {
  return dados.filter(d =>
    d.nome.includes(busca) &&
    (!filtro || d.categoria === filtro)
  );
}, [busca, filtro]);
```

### Confirmação de Ação

```tsx
const handleDelete = (id: string) => {
  if (confirm('Tem certeza?')) {
    // Deletar
  }
};
```

### Salvamento

```tsx
const [salvando, setSalvando] = useState(false);

const handleSalvar = async (e: React.FormEvent) => {
  e.preventDefault();
  setSalvando(true);

  try {
    // await api.post(...)
  } finally {
    setSalvando(false);
  }
};

<button disabled={salvando}>
  {salvando ? 'Salvando...' : 'Salvar'}
</button>
```

---

## Cores da Marca

### Primária (Azul)
- `bg-marca-50` a `bg-marca-900`
- Principal: `bg-marca-500` (#2E86C1)
- Escuro: `bg-marca-700` (#1B4F72)

### Destaque (Laranja)
- `bg-destaque-50` a `bg-destaque-900`
- Principal: `bg-destaque-500` (#E67E22)

### Exemplos
```tsx
// Botão primário
<button className="bg-marca-500 text-white hover:bg-marca-600">
  Ação
</button>

// Texto destaque
<span className="text-destaque-500">Importante</span>

// Border
<div className="border-marca-300">Conteúdo</div>
```

---

## Ícones Lucide React

Importação:
```tsx
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Search,
  Filter,
  ChevronDown,
  // ... mais ícones
} from 'lucide-react';
```

Uso:
```tsx
<Plus className="h-5 w-5" />
```

---

## Dark Mode

Todos os componentes suportam dark mode. Use `dark:` prefixo:

```tsx
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
  Conteúdo
</div>
```

---

## Tipagem TypeScript

Sempre tipar dados:

```tsx
interface Produto {
  id: string;
  nome: string;
  preco: number;
}

const [produtos, setProdutos] = useState<Produto[]>([]);
```

---

Gerado para iMestreDigital © 2024
