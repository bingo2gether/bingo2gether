# 🗄️ GUIA: MIGRAR MOCK DATABASE PARA POSTGRESQL REAL

**Status:** Este guia é para quando você tiver seu banco PostgreSQL pronto.

---

## 📋 O QUE FAZER

Atualmente o backend usa **Mock Database em memória**. Para usar um **PostgreSQL real**, você precisa:

1. Ter um banco PostgreSQL rodando (Supabase, Render, AWS, etc)
2. Obter a CONNECTION STRING
3. Atualizar os arquivos
4. Fazer deploy novamente

---

## 🔄 PASSO 1: RESTAURAR O PRISMA REAL

### 1.1 Atualizar `backend/src/prisma.ts`

Altere de:
```typescript
import { mockPrisma } from './mockDb.js';
const prisma: any = mockPrisma;
export default prisma;
```

Para:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

### 1.2 Atualizar `backend/prisma/schema.prisma`

Altere de:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

Para:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 1.3 Atualizar `backend/.env`

Altere:
```env
DATABASE_URL=postgresql://...sua_string_aqui...
REDIS_URL=redis://localhost:6379
```

---

## 📦 PASSO 2: INSTALAR E EXECUTAR MIGRATIONS

```bash
cd backend

# Gerar cliente Prisma (novo)
npx prisma generate

# Executar migrations (cria tabelas)
npx prisma migrate deploy

# Opcional: Seed de dados
npx prisma db seed

# Verificar banco (abrir Prisma Studio)
npx prisma studio
```

---

## 🧪 PASSO 3: TESTAR LOCALMENTE

```bash
# Teste se conecta ao banco real
npx prisma db execute --stdin < test.sql

# Ou use Prisma Studio
npx prisma studio
```

---

## 📤 PASSO 4: FAZER GIT PUSH E REDEPLOY

```bash
# Fazer commit das mudanças
git add .
git commit -m "chore: migrate from mock db to PostgreSQL"
git push origin main

# O Render vai fazer deploy automático
# Procure por logs de sucesso
```

---

## ✅ PASSO 5: VERIFICAR BANCO EM PRODUÇÃO

```bash
# Health check
curl https://seu-backend.onrender.com/health

# Tentar registrar usuário (isso vai salvar no banco real!)
curl -X POST https://seu-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"prod@test.com","password":"Test123!","name":"Prod User"}'

# Tentar login (vai buscar do banco real)
curl -X POST https://seu-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"prod@test.com","password":"Test123!"}'
```

Se funcionar, **seus dados estão sendo salvos no PostgreSQL real!** ✅

---

## 🛠️ TROUBLESHOOTING

### Erro: "could not translate host name"
- DATABASE_URL está incorreto
- Verifique no Supabase → Settings → Database → Connection String

### Erro: "FATAL: Tenant or user not found"
- Senha do banco está errada
- Copie CONNECTION_STRING novamente do Supabase

### Erro: "relation 'User' does not exist"
- Migrations não foram executadas
- Rode: `npx prisma migrate deploy`

### Erro: "timeout"
- Render pode estar lento
- Espere 30 segundos e tente novamente
- Procure por logs de erro em Render Dashboard

---

## 📊 COMPARAÇÃO

| Aspecto | Mock DB | PostgreSQL Real |
|---------|---------|-----------------|
| Persistência | Não (reinicia server = perde dados) | Sim (dados salvam) |
| Performance | Rápido (memória) | Rápido (otimizado) |
| Escalabilidade | Não | Sim |
| Backup | Não | Automático |
| Custo | Grátis | Grátis (tier básico) |
| Produção | ❌ Não | ✅ Sim |

---

## 🚀 VOCÊ ESTÁ PRONTO!

Depois que migrar para PostgreSQL, você tem:
- ✅ Backend em produção
- ✅ Frontend em produção
- ✅ Banco de dados em produção
- ✅ Dados persistindo
- ✅ Pronto para vender!

---

**Próximo passo:** Seguir o guia em `DEPLOYMENT_PRODUCTION.md`
