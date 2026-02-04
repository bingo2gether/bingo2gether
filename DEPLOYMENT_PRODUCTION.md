# 🚀 GUIA DE DEPLOYMENT PARA PRODUÇÃO - BINGO2GETHER

**Versão:** 1.0.0  
**Data:** 3 de Fevereiro de 2026  
**Tempo estimado:** 30-45 minutos

---

## 📋 CHECKLIST DE DEPLOYMENT

- [ ] 1. Criar repositório GitHub
- [ ] 2. Push do código
- [ ] 3. Criar banco de dados Supabase
- [ ] 4. Deploy do Backend em Render
- [ ] 5. Deploy do Frontend em Vercel
- [ ] 6. Configurar variáveis de ambiente
- [ ] 7. Testar URLs finais

---

## 🔧 PASSO 1: INICIAR GIT E CRIAR REPOSITÓRIO

### 1.1 Iniciar Git Localmente
```bash
cd "c:\Users\racle\Meu Drive\Projeto IA\copy-of-bingo2gether---atualizado"
git init
git config user.name "seu-nome"
git config user.email "seu@email.com"
```

### 1.2 Criar arquivo .env.example (para não expor credenciais)
```bash
# Copiar .env para .env.example
# Backend
copy backend\.env backend\.env.example

# Frontend  
copy frontend\.env frontend\.env.example
```

### 1.3 Fazer Primeiro Commit
```bash
git add .
git commit -m "Initial commit: Bingo2Gether application setup"
```

### 1.4 Criar Repositório GitHub

1. Abra: https://github.com/new
2. **Nome:** `bingo2gether` (ou similar)
3. **Descrição:** Sistema de bingo financeiro para casais
4. **Visibilidade:** Public (recomendado para usar Vercel/Render grátis)
5. Clique em "Create repository"

### 1.5 Conectar ao GitHub
```bash
git remote add origin https://github.com/SEU_USUARIO/bingo2gether.git
git branch -M main
git push -u origin main
```

---

## 🗄️ PASSO 2: CRIAR BANCO DE DADOS SUPABASE

### 2.1 Criar Conta Supabase
1. Abra: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub (recomendado)
4. Confirme o email

### 2.2 Criar Novo Projeto
1. Clique em "New project"
2. **Projeto:** `bingo2gether-prod`
3. **Password:** Salve a senha (será usada depois!)
4. **Region:** Escolha mais próximo (ex: `Virginia` para Brasil)
5. Aguarde criação (2-3 minutos)

### 2.3 Obter Connection String
1. Vá para: **Settings** → **Database** → **Connection String**
2. Copie o link do tipo:
   ```
   postgresql://postgres.xxxxx:password@xxxxx.pooler.supabase.com:6543/postgres
   ```
3. **Salve isto!** Será necessário para o Backend

### 2.4 Configurar Migrations

```bash
# No terminal, dentro da pasta backend
cd backend

# Criar arquivo .env.production
# Adicionar: DATABASE_URL=postgresql://...

# Executar migrations
npx prisma migrate deploy
npx prisma generate
```

---

## 🖥️ PASSO 3: DEPLOY DO BACKEND EM RENDER

### 3.1 Criar Conta Render
1. Abra: https://render.com
2. Clique em "Get Started"
3. Faça login com GitHub (recomendado)
4. Autorize o acesso

### 3.2 Conectar Repositório
1. Dashboard do Render
2. Clique em "New +" → "Web Service"
3. Clique em "Connect repository"
4. Selecione o repositório `bingo2gether`
5. Clique em "Connect"

### 3.3 Configurar Web Service
**Name:** `bingo2gether-api`  
**Root Directory:** `backend`  
**Runtime:** `Node`  
**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm run start
```

### 3.4 Configurar Variáveis de Ambiente

Clique em "Environment" e adicione:

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://postgres.xxxxx:password@xxxxx.pooler.supabase.com:6543/postgres
REDIS_URL=redis://localhost:6379
JWT_SECRET=seu_jwt_secret_muito_longo_aqui
SESSION_SECRET=seu_session_secret_muito_longo_aqui
FRONTEND_URL=https://seu-frontend-url.vercel.app
VAPID_PUBLIC_KEY=BHtjVHoTBqoYMHOPEdp4XuT0Bf6NA7dn-B0KfKhyelFt_izpgnUsNW3iRgqEiJ-gTxMwEDoNo-LALu0jvLJaYpg
VAPID_PRIVATE_KEY=AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OToxOzw9Pj8=
VAPID_SUBJECT=mailto:seu-email@bingo2gether.com
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
STRIPE_SECRET_KEY=sk_live_sua_chave_stripe
STRIPE_WEBHOOK_SECRET=whsec_sua_webhook_stripe
MP_ACCESS_TOKEN=seu_token_mercado_pago
```

### 3.5 Fazer Deploy
1. Clique em "Create Web Service"
2. Aguarde ~5 minutos
3. Você receberá uma URL como: `https://bingo2gether-api.onrender.com`
4. **Salve esta URL!**

### 3.6 Verificar Health Check
```bash
curl https://bingo2gether-api.onrender.com/health
```

Deve retornar: `{"status":"OK","timestamp":"..."}`

---

## 🎨 PASSO 4: DEPLOY DO FRONTEND EM VERCEL

### 4.1 Criar Conta Vercel
1. Abra: https://vercel.com
2. Clique em "Sign Up"
3. Faça login com GitHub (recomendado)
4. Autorize o acesso

### 4.2 Importar Projeto
1. Dashboard do Vercel
2. Clique em "Add New..." → "Project"
3. Selecione o repositório `bingo2gether`
4. Clique em "Import"

### 4.3 Configurar Build
**Framework Preset:** Vite  
**Root Directory:** `frontend`

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

### 4.4 Configurar Variáveis de Ambiente

Clique em "Environment Variables" e adicione:

```env
VITE_API_URL=https://bingo2gether-api.onrender.com/api
VITE_STRIPE_PUBLIC_KEY=pk_live_sua_chave_publica_stripe
VITE_MP_PUBLIC_KEY=seu_public_key_mercado_pago
VITE_GOOGLE_CLIENT_ID=seu_google_client_id
VITE_FACEBOOK_APP_ID=seu_facebook_app_id
VITE_VAPID_PUBLIC_KEY=BHtjVHoTBqoYMHOPEdp4XuT0Bf6NA7dn-B0KfKhyelFt_izpgnUsNW3iRgqEiJ-gTxMwEDoNo-LALu0jvLJaYpg
```

### 4.5 Fazer Deploy
1. Clique em "Deploy"
2. Aguarde ~3-5 minutos
3. Você receberá uma URL como: `https://bingo2gether.vercel.app`
4. **Salve esta URL!**

### 4.6 Atualizar Backend com Frontend URL
Volte ao Render e atualize:
```env
FRONTEND_URL=https://bingo2gether.vercel.app
```

Depois faça redeploy manual no Render.

---

## ✅ PASSO 5: TESTAR APLICAÇÃO EM PRODUÇÃO

### 5.1 Teste Visual
1. Abra: `https://bingo2gether.vercel.app`
2. Verifique se carrega sem erros
3. Abra DevTools (F12) → Network
4. Verifique se chamadas API vão para `https://bingo2gether-api.onrender.com`

### 5.2 Teste Health Check
```bash
curl https://bingo2gether-api.onrender.com/health
```

### 5.3 Teste Autenticação
```bash
# Registrar
curl -X POST https://bingo2gether-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@prod.com","password":"Test123!","name":"Prod Test"}'

# Login
curl -X POST https://bingo2gether-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@prod.com","password":"Test123!"}'
```

### 5.4 Verificar Logs
**Render (Backend):**
- Dashboard → Seu serviço → "Logs"
- Procure por erros

**Vercel (Frontend):**
- Dashboard → Seu projeto → "Deployments"
- Clique no último deploy → "Logs"

---

## 🔐 PASSO 6: CONFIGURAÇÃO DE SEGURANÇA

### 6.1 Gerar Secrets Seguros
```bash
# JWT_SECRET (gerar 2x)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Salve os valores
```

### 6.2 Configurar SSL/HTTPS
- ✅ Vercel: Automático
- ✅ Render: Automático

### 6.3 CORS em Produção
Atualize em `backend/src/server.ts`:
```typescript
const allowedOrigins = [
    'https://bingo2gether.vercel.app',
    'https://www.bingo2gether.com', // seu domínio futuro
    process.env.FRONTEND_URL,
    'http://localhost:5173' // desenvolvimento
].filter(Boolean) as string[];
```

---

## 📦 PASSO 7: MONITORAMENTO

### 7.1 Sentry (Error Tracking)
1. Crie conta em: https://sentry.io
2. Crie novo projeto
3. Instale no backend:
   ```bash
   npm install @sentry/node @sentry/tracing
   ```
4. Adicione no `server.ts`:
   ```typescript
   import * as Sentry from "@sentry/node";
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

### 7.2 Logs em Produção
- Render fornece logs automáticos
- Vercel fornece logs automáticos
- Visualize em: Dashboard → Logs

---

## 🎯 CHECKLIST FINAL

```
✅ Repositório GitHub criado
✅ Código fazer push
✅ Database Supabase criado
✅ Backend fazer deploy Render
✅ Frontend fazer deploy Vercel
✅ Variáveis de ambiente configuradas
✅ Health check respondendo
✅ Autenticação funcionando
✅ Frontend e Backend comunicando
✅ Logs sendo monitorados
```

---

## 📞 SUPORTE DE DEPLOYMENT

### Erro: "Railway too many free tier"
- Solução: Use Render (melhor gratuito)

### Erro: "Vercel build failed"
- Verifique: `npm run build` funciona localmente?
- Procure por: `frontend/.env`

### Erro: "Database connection timeout"
- Verifique: Connection string está correta?
- Verifique: Firewall/IP whitelist?
- Render permite all IPs por padrão

### Erro: "CORS error em produção"
- Verifique: FRONTEND_URL no backend está correto?
- Verifique: allowedOrigins em server.ts

---

## 🚀 URLs FINAIS

Após completar todos os passos:

**🌐 Seu App está em:**
```
https://bingo2gether.vercel.app
```

**🔌 Sua API está em:**
```
https://bingo2gether-api.onrender.com/api
```

**📧 Compartilhe com clientes:**
```
Acesse: https://bingo2gether.vercel.app
```

---

## 📊 ARQUITETURA FINAL

```
GitHub Repository
├── frontend/          → Deploy em Vercel
├── backend/           → Deploy em Render
└── package.json

Vercel
└── https://bingo2gether.vercel.app (Frontend)

Render
└── https://bingo2gether-api.onrender.com (Backend)

Supabase
└── PostgreSQL Database (Dados)
```

---

## ⏱️ TIMELINE APROXIMADA

- **Passo 1 (GitHub):** 5 minutos
- **Passo 2 (Supabase):** 10 minutos
- **Passo 3 (Render):** 10 minutos
- **Passo 4 (Vercel):** 5 minutos
- **Passo 5 (Testes):** 5 minutos
- **Total:** ~35 minutos

---

**Sucesso! Sua aplicação está em produção! 🎉**

Data: 3 de Fevereiro de 2026  
Status: Pronto para Production
