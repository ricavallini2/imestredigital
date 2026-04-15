-- ═══════════════════════════════════════════════════════════════
-- iMestreDigital - Inicialização do Banco de Dados
-- ═══════════════════════════════════════════════════════════════
-- Este script é executado automaticamente na primeira vez que o
-- container do PostgreSQL é criado. Cria os databases separados
-- para cada microserviço, seguindo o padrão de banco por serviço.
-- ═══════════════════════════════════════════════════════════════

-- Database principal (pode ser usado para dados compartilhados)
-- Já criado pela variável POSTGRES_DB

-- Databases individuais por microserviço
CREATE DATABASE catalog_service;
CREATE DATABASE inventory_service;
CREATE DATABASE order_service;
CREATE DATABASE marketplace_service;
CREATE DATABASE fiscal_service;
CREATE DATABASE financial_service;
CREATE DATABASE customer_service;
CREATE DATABASE notification_service;
CREATE DATABASE auth_service;
CREATE DATABASE ai_service;

-- Extensões úteis no database principal
\c imestredigital;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";    -- Geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- Criptografia
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- Busca por similaridade

-- Repete extensões nos databases dos serviços
\c catalog_service;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c inventory_service;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c order_service;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c marketplace_service;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c fiscal_service;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c financial_service;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c customer_service;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c notification_service;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c auth_service;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c ai_service;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
