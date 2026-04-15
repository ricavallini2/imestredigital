#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════
 * iMestreDigital - Setup Completo do Ambiente de Desenvolvimento
 * ═══════════════════════════════════════════════════════════════
 *
 * Script Node.js cross-platform (Windows, macOS, Linux).
 *
 * O que este script faz:
 *   1. Copia .env.example → .env para cada serviço (se não existir)
 *   2. Corrige DATABASE_URL para usar credenciais do Docker
 *   3. Sobe a infraestrutura Docker (Postgres, Redis, Kafka, etc.)
 *   4. Aguarda o PostgreSQL ficar disponível
 *   5. Instala dependências npm do monorepo
 *   6. Executa prisma generate + prisma db push em cada serviço
 *   7. Executa seeds na ordem correta
 *   8. Exibe URLs e credenciais de acesso
 *
 * Uso:
 *   node scripts/setup.js          → setup completo
 *   node scripts/setup.js --skip-docker  → pula docker up (infra já rodando)
 *   node scripts/setup.js --skip-install → pula npm install
 *   node scripts/setup.js --seed-only    → apenas executa os seeds
 * ═══════════════════════════════════════════════════════════════
 */

const { execSync, spawnSync } = require('child_process');
const fs   = require('fs');
const path = require('path');
const net  = require('net');

// ─── Configuração ──────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');

const ARGS = process.argv.slice(2);
const SKIP_DOCKER  = ARGS.includes('--skip-docker');
const SKIP_INSTALL = ARGS.includes('--skip-install');
const SEED_ONLY    = ARGS.includes('--seed-only');

/** Credenciais do Docker Compose (docker-compose.dev.yml) */
const DB_USER = 'postgres';
const DB_PASS = 'postgres';
const DB_HOST = 'localhost';
const DB_PORT = 5432;

/** Mapeamento: pasta do serviço → nome do banco no Docker */
const SERVICE_DB_MAP = {
  'auth-service':         'auth_service',
  'catalog-service':      'catalog_service',
  'inventory-service':    'inventory_service',
  'order-service':        'order_service',
  'financial-service':    'financial_service',
  'fiscal-service':       'fiscal_service',
  'marketplace-service':  'marketplace_service',
  'ai-service':           'ai_service',
  'notification-service': 'notification_service',
  'customer-service':     'customer_service',
};

/** Ordem dos seeds (auth DEVE ser primeiro — cria tenant e usuários) */
const SEED_ORDER = [
  'auth-service',
  'catalog-service',
  'inventory-service',
  'order-service',
  'notification-service',
  'customer-service',
  'financial-service',
];

// ─── Utilidades ────────────────────────────────────────────────

const colors = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  blue:   '\x1b[34m',
  cyan:   '\x1b[36m',
  red:    '\x1b[31m',
  dim:    '\x1b[2m',
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;

function log(msg)    { console.log(msg); }
function step(msg)   { console.log(`\n${c('bold', c('blue', '▶'))} ${c('bold', msg)}`); }
function ok(msg)     { console.log(`  ${c('green', '✓')} ${msg}`); }
function warn(msg)   { console.log(`  ${c('yellow', '⚠')} ${msg}`); }
function info(msg)   { console.log(`  ${c('dim', '·')} ${msg}`); }
function err(msg)    { console.error(`  ${c('red', '✗')} ${msg}`); }

function run(cmd, cwd = ROOT, silent = false) {
  try {
    execSync(cmd, {
      cwd,
      stdio: silent ? 'pipe' : 'inherit',
      shell: true,
    });
    return true;
  } catch (e) {
    return false;
  }
}

function runOrFail(cmd, cwd = ROOT, label = cmd) {
  try {
    execSync(cmd, { cwd, stdio: 'pipe', shell: true });
    return true;
  } catch (e) {
    const msg = e.stderr?.toString() || e.stdout?.toString() || e.message;
    warn(`${label} falhou: ${msg.trim().split('\n')[0]}`);
    return false;
  }
}

// ─── 1. Copiar .env.example → .env ────────────────────────────

function setupEnvFiles() {
  step('Configurando arquivos .env');

  const JWT_SECRET = 'imestredigital-desenvolvimento-2024-trocar-em-producao';

  for (const [svc, dbName] of Object.entries(SERVICE_DB_MAP)) {
    const svcDir    = path.join(ROOT, 'services', svc);
    const envFile   = path.join(svcDir, '.env');
    const envExample = path.join(svcDir, '.env.example');

    if (!fs.existsSync(svcDir)) continue;
    if (!fs.existsSync(envExample)) {
      warn(`${svc}: .env.example não encontrado, pulando`);
      continue;
    }

    if (fs.existsSync(envFile)) {
      info(`${svc}: .env já existe, mantendo`);
      continue;
    }

    let content = fs.readFileSync(envExample, 'utf8');

    // Corrige DATABASE_URL para usar credenciais do Docker
    content = content.replace(
      /DATABASE_URL=postgresql:\/\/[^@\s]+@[^\s/]+\/\S+/g,
      `DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${dbName}`
    );

    // Padroniza JWT_SECRET para desenvolvimento
    content = content.replace(
      /JWT_SECRET=.*/g,
      `JWT_SECRET=${JWT_SECRET}`
    );

    fs.writeFileSync(envFile, content, 'utf8');
    ok(`${svc}: .env criado`);
  }
}

// ─── 2. Docker ─────────────────────────────────────────────────

function startDocker() {
  step('Subindo infraestrutura Docker');

  // Detecta o comando docker compose (v2 vs v1)
  const isV2 = run('docker compose version', ROOT, true);
  const dockerCompose = isV2 ? 'docker compose' : 'docker-compose';
  const composeFile   = 'infra/docker/docker-compose.dev.yml';

  info(`Usando: ${dockerCompose}`);

  const ok_ = run(`${dockerCompose} -f ${composeFile} up -d`);
  if (ok_) {
    ok('Containers iniciados');
  } else {
    err('Falha ao subir Docker. Verifique se o Docker Desktop está rodando.');
    process.exit(1);
  }
}

// ─── 3. Aguardar PostgreSQL ────────────────────────────────────

async function waitForPostgres(timeoutMs = 60000) {
  step(`Aguardando PostgreSQL em ${DB_HOST}:${DB_PORT}`);

  const start = Date.now();

  return new Promise((resolve, reject) => {
    function attempt() {
      const elapsed = Date.now() - start;
      if (elapsed > timeoutMs) {
        err(`PostgreSQL não ficou disponível em ${timeoutMs / 1000}s`);
        reject(new Error('PostgreSQL timeout'));
        return;
      }

      const socket = new net.Socket();
      socket.setTimeout(2000);

      socket.on('connect', () => {
        socket.destroy();
        ok(`PostgreSQL pronto (${Math.round(elapsed / 1000)}s)`);
        resolve();
      });

      socket.on('error', () => {
        socket.destroy();
        process.stdout.write('.');
        setTimeout(attempt, 1500);
      });

      socket.on('timeout', () => {
        socket.destroy();
        process.stdout.write('.');
        setTimeout(attempt, 1500);
      });

      socket.connect(DB_PORT, DB_HOST);
    }

    attempt();
  });
}

// ─── 4. npm install ────────────────────────────────────────────

function installDeps() {
  step('Instalando dependências (npm install)');
  info('Isso pode demorar alguns minutos na primeira execução...');
  const success = run('npm install');
  if (success) {
    ok('Dependências instaladas');
  } else {
    err('npm install falhou');
    process.exit(1);
  }
}

// ─── 5. Prisma generate + db push ──────────────────────────────

function setupDatabases() {
  step('Configurando bancos de dados (prisma generate + db push)');

  const services = Object.keys(SERVICE_DB_MAP);

  for (const svc of services) {
    const svcDir = path.join(ROOT, 'services', svc);
    const schema = path.join(svcDir, 'prisma', 'schema.prisma');
    const envFile = path.join(svcDir, '.env');

    if (!fs.existsSync(schema)) {
      info(`${svc}: sem schema.prisma, pulando`);
      continue;
    }

    if (!fs.existsSync(envFile)) {
      warn(`${svc}: .env não encontrado, pulando`);
      continue;
    }

    process.stdout.write(`  · ${svc}: generate... `);
    const genOk = runOrFail('npx prisma generate', svcDir, `${svc} generate`);
    if (genOk) process.stdout.write('ok  ');

    process.stdout.write(`push... `);
    const pushOk = runOrFail(
      'npx prisma db push --accept-data-loss --skip-generate',
      svcDir,
      `${svc} db push`
    );
    if (pushOk) {
      process.stdout.write(`ok\n`);
    } else {
      process.stdout.write(`falhou\n`);
      warn(`${svc}: db push falhou — verifique o .env e se o banco existe no Docker`);
    }
  }
}

// ─── 6. Executar Seeds ─────────────────────────────────────────

function runSeeds() {
  step('Executando seeds de dados de demonstração');

  for (const svc of SEED_ORDER) {
    const svcDir  = path.join(ROOT, 'services', svc);
    const seedFile = path.join(svcDir, 'prisma', 'seed.ts');
    const envFile  = path.join(svcDir, '.env');

    if (!fs.existsSync(seedFile)) {
      info(`${svc}: sem seed.ts, pulando`);
      continue;
    }

    if (!fs.existsSync(envFile)) {
      warn(`${svc}: .env não encontrado, pulando seed`);
      continue;
    }

    process.stdout.write(`  · ${svc}: `);
    const success = runOrFail('npm run db:seed', svcDir, `${svc} seed`);
    if (success) {
      ok(`${svc} ✓`);
    } else {
      warn(`${svc}: seed falhou — o serviço pode não ter todas as tabelas`);
    }
  }
}

// ─── 7. Resumo Final ───────────────────────────────────────────

function printSummary() {
  log('');
  log(c('green', c('bold', '═══════════════════════════════════════════════')));
  log(c('green', c('bold', '   ✅  Setup concluído com sucesso!')));
  log(c('green', c('bold', '═══════════════════════════════════════════════')));
  log('');
  log(c('bold', '🔑 Credenciais de acesso (desenvolvimento):'));
  log(`   Email: ${c('cyan', 'teste@teste.com')}    Senha: ${c('cyan', 'Senha123')} (admin)`);
  log(`   Email: ${c('cyan', 'gerente@teste.com')}  Senha: ${c('cyan', 'Senha123')} (gerente)`);
  log(`   Email: ${c('cyan', 'operador@teste.com')} Senha: ${c('cyan', 'Senha123')} (operador)`);
  log('');
  log(c('bold', '🌐 URLs após npm run dev:'));
  log(`   Frontend:        ${c('cyan', 'http://localhost:3000')}`);
  log(`   Auth Service:    ${c('dim', 'http://localhost:3001/api/docs')}`);
  log(`   Fiscal Service:  ${c('dim', 'http://localhost:3004/api/docs')}`);
  log(`   Order Service:   ${c('dim', 'http://localhost:3005/api/docs')}`);
  log(`   Financial:       ${c('dim', 'http://localhost:3006/api/docs')}`);
  log(`   Marketplace:     ${c('dim', 'http://localhost:3007/api/docs')}`);
  log(`   AI Service:      ${c('dim', 'http://localhost:3008/api/docs')}`);
  log(`   Notifications:   ${c('dim', 'http://localhost:3009/api/docs')}`);
  log(`   Catalog:         ${c('dim', 'http://localhost:3010/api/docs')}`);
  log(`   Inventory:       ${c('dim', 'http://localhost:3011/api/docs')}`);
  log(`   Customer (CRM):  ${c('dim', 'http://localhost:3012/api/docs')}`);
  log('');
  log(c('bold', '🐳 Infraestrutura Docker:'));
  log(`   Mailpit (email): ${c('dim', 'http://localhost:8025')}`);
  log(`   MinIO (storage): ${c('dim', 'http://localhost:9001')}  ${c('dim', '(minioadmin / minioadmin)')}`);
  log(`   Grafana:         ${c('dim', 'http://localhost:3030')}  ${c('dim', '(admin / admin)')}`);
  log('');
  log(c('bold', '▶  Próximos passos:'));
  log(`   ${c('cyan', 'npm run dev')}          → inicia todos os serviços em paralelo`);
  log(`   ${c('cyan', 'npm run docker:logs')} → acompanha logs da infraestrutura`);
  log('');
}

// ─── Main ──────────────────────────────────────────────────────

async function main() {
  log('');
  log(c('bold', '╔═══════════════════════════════════════════════╗'));
  log(c('bold', '║  iMestreDigital - Setup de Desenvolvimento    ║'));
  log(c('bold', '╚═══════════════════════════════════════════════╝'));
  log('');

  try {
    if (SEED_ONLY) {
      runSeeds();
      printSummary();
      return;
    }

    setupEnvFiles();

    if (!SKIP_DOCKER) {
      startDocker();
      await waitForPostgres();
    } else {
      info('--skip-docker: pulando docker up');
    }

    if (!SKIP_INSTALL) {
      installDeps();
    } else {
      info('--skip-install: pulando npm install');
    }

    setupDatabases();
    runSeeds();
    printSummary();

  } catch (e) {
    err(`Setup falhou: ${e.message}`);
    process.exit(1);
  }
}

main();
