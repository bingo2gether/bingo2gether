# 🚀 Guia Completo de Deploy para Produção

## Visão Geral

Este guia irá ajudá-lo a colocar o Bingo2Gether no ar em aproximadamente 1-2 horas.

### O que você vai criar:
- ✅ Backend API rodando em produção (Render.com)
- ✅ Frontend rodando em produção (Vercel)
- ✅ Banco de dados PostgreSQL (Supabase)
- ✅ Pipeline CI/CD automatizado (GitHub Actions)
- ✅ Monitoramento de erros (Sentry - opcional)
- ✅ Domínio personalizado (opcional)

---

## Pré-requisitos

- [ ] Conta no GitHub
- [ ] Código do projeto commitado no GitHub
- [ ] Node.js 20+ instalado localmente (para testes)
- [ ] Cartão de crédito (apenas para verificação, usaremos planos gratuitos)

---

## Fase 1: Preparação do Código (15 minutos)

### 1.1 Garantir que o código está no GitHub

```bash
# Se ainda não fez, inicialize o repositório
git init
git add .
git commit -m "feat: initial commit - ready for production"

# Crie um repositório no GitHub e faça push
git remote add origin https://github.com/seu-usuario/bingo2gether.git
git branch -M main
git push -u origin main
```

### 1.2 Verificar builds localmente

```bash
# Backend
cd backend
npm install
npm run build
npm test  # Opcional, se houver testes

# Frontend
cd ../frontend
npm install
npm run build

# Ambos devem compilar sem erros críticos
```

---

## Fase 2: Banco de Dados - Supabase (20 minutos)

### 2.1 Criar projeto no Supabase

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub
4. Clique em "New Project"

**Configurações:**
- Organization: Crie uma nova ou use existente
- Project Name: `bingo2gether-prod`
- Database Password: **Salve esta senha!** (será usada mais tarde)
- Region: `South America (São Paulo)` (mais próximo do Brasil)
- Pricing Plan: `Free` (até 500MB de banco)

5. Aguarde 2-3 minutos para o projeto ser criado

### 2.2 Obter string de conexão

1. No dashboard do Supabase, vá para: **Settings** → **Database**
2. Em "Connection string", selecione **"URI"**
3. Copie a string que parece com:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
4. Substitua `[YOUR-PASSWORD]` pela senha que você criou
5. **Salve essa string em um arquivo seguro!**

### 2.3 Executar migrations (do seu computador)

```bash
cd backend

# Configure temporariamente a variável de ambiente
export DATABASE_URL="postgresql://postgres:SUA_SENHA@db.xxxxx.supabase.co:5432/postgres"

# Execute as migrations
npx prisma migrate deploy

# Opcional: Visualize o banco
npx prisma studio
```

---

## Fase 3: Backend API - Render.com (25 minutos)

### 3.1 Criar conta no Render

1. Acesse: https://render.com
2. Clique em "Get Started for Free"
3. Faça login com GitHub
4. Autorize o acesso aos repositórios

### 3.2 Criar Web Service

1. No dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Clique em "Connect a repository"
3. Encontre e selecione: `bingo2gether`
4. Clique em "Connect"

**Configurações do serviço:**

- **Name:** `bingo2gether-api`
- **Region:** `Oregon (US West)` ou `Frankfurt (EU)` (mais próximo e gratuito)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install && npx prisma generate && npm run build`
- **Start Command:** `npm run start`
- **Instance Type:** `Free` (512MB RAM, suficiente para começar)

### 3.3 Configurar variáveis de ambiente

Clique em **"Advanced"** → **"Add Environment Variable"**

**Variáveis obrigatórias:**

```env
DATABASE_URL=postgresql://postgres:SENHA@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET=gere-uma-chave-aleatoria-de-64-caracteres
SESSION_SECRET=gere-outra-chave-aleatoria-de-64-caracteres
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-app.vercel.app
```

**Para gerar secrets seguros:**
```bash
# No terminal local
openssl rand -base64 64
```

**Variáveis opcionais (mas recomendadas):**

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_CALLBACK_URL=https://bingo2gether-api.onrender.com/api/auth/google/callback

# Sentry (monitoramento)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### 3.4 Deploy

1. Clique em **"Create Web Service"**
2. Aguarde 5-10 minutos (o Render irá construir e iniciar seu backend)
3. Quando o status mudar para "Live", copie a URL:
   ```
   https://bingo2gether-api.onrender.com
   ```
4. **Salve essa URL!**

### 3.5 Testar o backend

```bash
# Health check
curl https://bingo2gether-api.onrender.com/health

# Deve retornar:
# {"status":"OK","timestamp":"2026-02-05T..."}
```

---

## Fase 4: Frontend - Vercel (15 minutos)

### 4.1 Criar conta na Vercel

1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Escolha "Continue with GitHub"
4. Autorize o acesso

### 4.2 Importar projeto

1. No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
2. Encontre e selecione o repositório: `bingo2gether`
3. Clique em "Import"

**Configurações do projeto:**

- **Project Name:** `bingo2gether`
- **Framework Preset:** `Vite`
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (já é o padrão)
- **Output Directory:** `dist` (já é o padrão)

### 4.3 Configurar variáveis de ambiente

Clique em **"Environment Variables"** e adicione:

```env
VITE_API_URL=https://bingo2gether-api.onrender.com/api
```

**Variáveis opcionais:**

```env
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
VITE_VAPID_PUBLIC_KEY=sua-vapid-public-key
```

### 4.4 Deploy

1. Clique em **"Deploy"**
2. Aguarde 3-5 minutos (a Vercel irá construir e fazer deploy)
3. Quando finalizar, você verá:
   ```
   https://bingo2gether.vercel.app
   ```
4. **Salve essa URL!**

### 4.5 Atualizar FRONTEND_URL no Backend

**IMPORTANTE:** Agora que você tem a URL do frontend, precisa atualizar o backend:

1. Volte para o Render.com
2. Vá para o serviço `bingo2gether-api`
3. Clique em **"Environment"**
4. Atualize `FRONTEND_URL` para: `https://bingo2gether.vercel.app`
5. Clique em **"Save Changes"**
6. O Render irá reiniciar automaticamente o serviço (1-2 minutos)

---

## Fase 5: Configurações de Pagamento (30 minutos - Opcional)

### 5.1 Stripe (Pagamentos Internacionais)

1. Acesse: https://dashboard.stripe.com/register
2. Complete o registro da conta
3. Ative sua conta (pode levar 1-2 dias úteis)
4. Vá para: **Developers** → **API Keys**
5. Copie:
   - **Publishable key** (pk_live_...)
   - **Secret key** (sk_live_...)
6. Configure as webhooks:
   - URL: `https://bingo2gether-api.onrender.com/api/payments/stripe/webhook`
   - Eventos: `checkout.session.completed`, `payment_intent.succeeded`

**Adicionar no Render (Backend):**
```env
STRIPE_SECRET_KEY=sk_live_xxxxx
```

**Adicionar na Vercel (Frontend):**
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
```

### 5.2 Mercado Pago (Pagamentos no Brasil)

1. Acesse: https://www.mercadopago.com.br/developers
2. Faça login com sua conta Mercado Pago
3. Vá para: **Suas integrações** → **Criar aplicação**
4. Nome: "Bingo2Gether"
5. Copie:
   - **Public Key** (APP_USR-...)
   - **Access Token** (APP_USR-...)

**Adicionar no Render:**
```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx
```

---

## Fase 6: Testes de Produção (20 minutos)

### 6.1 Testar frontend

1. Abra: https://bingo2gether.vercel.app
2. A aplicação deve carregar sem erros
3. Abra o DevTools (F12)
4. Verifique a aba "Console" - não deve haver erros vermelhos
5. Verifique a aba "Network" - as chamadas devem ir para: `https://bingo2gether-api.onrender.com`

### 6.2 Testar autenticação

```bash
# Registrar novo usuário
curl -X POST https://bingo2gether-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "name": "Test User"
  }'

# Fazer login
curl -X POST https://bingo2gether-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### 6.3 Verificar banco de dados

1. Volte para o Supabase
2. Vá para: **Table Editor**
3. Você deve ver suas tabelas: `User`, `Game`, `Payment`, etc.
4. Verifique se o usuário de teste foi criado

---

## Fase 7: Configurações Finais (10 minutos)

### 7.1 Domínio personalizado (Opcional)

**Frontend (Vercel):**
1. Compre um domínio (ex: Registro.br, GoDaddy, Namecheap)
2. Na Vercel, vá para: **Settings** → **Domains**
3. Adicione seu domínio: `www.bingo2gether.com.br`
4. Configure os DNS conforme instruções da Vercel

**Backend (Render):**
1. No Render, vá para: **Settings** → **Custom Domains**
2. Adicione: `api.bingo2gether.com.br`
3. Configure os DNS conforme instruções

### 7.2 Configurar monitoramento com Sentry

1. Acesse: https://sentry.io
2. Crie uma conta gratuita
3. Crie um novo projeto: "bingo2gether"
4. Copie o DSN
5. Adicione no Render:
   ```env
   SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
   ```

---

## Fase 8: Checklist Final

- [ ] Backend rodando em: https://bingo2gether-api.onrender.com
- [ ] Frontend rodando em: https://bingo2gether.vercel.app
- [ ] Banco de dados configurado no Supabase
- [ ] Migrations executadas
- [ ] CORS configurado corretamente (FRONTEND_URL)
- [ ] Autenticação funcionando (registro + login)
- [ ] Health check retornando OK
- [ ] Variáveis de ambiente configuradas
- [ ] GitHub Actions configurado (CI/CD)
- [ ] (Opcional) Pagamentos configurados
- [ ] (Opcional) Domínio personalizado
- [ ] (Opcional) Monitoramento com Sentry

---

## Custos Mensais Estimados

### Plano Gratuito (Free Tier):
- **Supabase Free:** 500MB + 2GB transferência = R$ 0
- **Render Free:** 750 horas/mês = R$ 0
- **Vercel Hobby:** 100GB bandwidth = R$ 0
- **Total:** R$ 0/mês

### Com Tráfego (100-1000 usuários/mês):
- **Supabase Pro:** R$ 25/mês
- **Render Starter:** R$ 7/mês ($7 USD)
- **Vercel Pro:** R$ 20/mês ($20 USD)
- **Sentry Team:** R$ 26/mês
- **Total:** ~R$ 78/mês

---

## Troubleshooting

### Erro: "CORS policy"
**Solução:**
- Verifique se `FRONTEND_URL` no Render está correto
- Deve ser exatamente: `https://bingo2gether.vercel.app` (sem barra no final)

### Erro: "Failed to connect to database"
**Solução:**
- Verifique se `DATABASE_URL` está correto
- Execute `npx prisma migrate deploy` novamente
- Verifique logs no Render: **Logs** tab

### Frontend carrega mas API não responde
**Solução:**
- Verifique `VITE_API_URL` na Vercel
- Abra diretamente: `https://bingo2gether-api.onrender.com/health`
- Verifique logs no Render

### Build falha no Render
**Solução:**
- Verifique se o Build Command está correto
- Certifique-se que `prisma generate` está no build
- Veja logs completos na aba "Events"

---

## Próximos Passos

Após o deploy:

1. **Testes de carga:** Teste com usuários reais
2. **Analytics:** Configure Google Analytics ou Mixpanel
3. **Marketing:** Comece a divulgar o app
4. **Monitoramento:** Configure alertas no Sentry
5. **Backup:** Configure backup automático no Supabase
6. **Documentação:** Crie uma FAQ para usuários

---

## Recursos Adicionais

- [Documentação do Render](https://render.com/docs)
- [Documentação da Vercel](https://vercel.com/docs)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Stripe](https://stripe.com/docs)
- [Guia de vendas](./SALES_GUIDE.md)

---

**Parabéns! 🎉 Seu app está no ar!**

Compartilhe com o mundo: https://bingo2gether.vercel.app
