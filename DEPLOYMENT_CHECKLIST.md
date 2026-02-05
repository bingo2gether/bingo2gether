# 🎯 DEPLOYMENT CHECKLIST — BINGO2GETHER

**Status**: Pronto para deploy em Render + Vercel ✅  
**Data**: 4 de Fevereiro de 2026

---

## 📊 O que foi concluído automaticamente

- ✅ Build local (frontend + backend)
- ✅ GitHub Actions CI workflow
- ✅ Variáveis de ambiente `.env.production.example`
- ✅ Supabase database (6 tabelas)
- ✅ TypeScript types gerados
- ✅ Frontend preview rodando

---

## 🔑 Suas credenciais (salve com segurança)

### Database (Render PostgreSQL)
```
DATABASE_URL=postgresql://bingo2gether_db_user:MumJrQIlAtVe8kVNFCVXYoW5X0meAiDz@dpg-d60lr0u3jp1c73a8b8k0-a.virginia-postgres.render.com/bingo2gether_db
```

**Use esta URL em:**
- [ ] Backend `.env` local (para testes)
- [ ] Render Web Service → Environment → `DATABASE_URL`

---

## ✅ CHECKLIST — Siga nessa ordem

### 1️⃣ GitHub (5 min)
- [ ] Crie repositório em https://github.com/new
- [ ] Copie a URL remota
- [ ] Execute no terminal (raiz do projeto):
```bash
git init
git add .
git commit -m "Deploy: env + CI + database setup"
git remote add origin https://github.com/YOUR_USER/bingo2gether.git
git branch -M main
git push -u origin main
```
- [ ] Confirme código no GitHub

---

### 2️⃣ Render — Backend (15 min)

**Criar Web Service:**
- [ ] Acesse https://render.com
- [ ] New → Web Service
- [ ] Connect Repository → selecione `bingo2gether`
- [ ] Preencha:
  - Name: `bingo2gether-api`
  - Root Directory: `backend`
  - Build: `npm install && npm run build`
  - Start: `npm run start`

**Environment Variables (clique Add):**
```
DATABASE_URL = postgresql://bingo2gether_db_user:MumJrQIlAtVe8kVNFCVXYoW5X0meAiDz@dpg-d60lr0u3jp1c73a8b8k0-a.virginia-postgres.render.com/bingo2gether_db
PORT = 3001
NODE_ENV = production
FRONTEND_URL = (preencher depois com URL do Vercel)
JWT_SECRET = (gere com comando abaixo)
SESSION_SECRET = (gere com comando abaixo)
STRIPE_SECRET_KEY = sk_test_...
MERCADOPAGO_ACCESS_TOKEN = (seu token)
REDIS_URL = (opcional)
VAPID_PUBLIC_KEY = (sua chave)
VAPID_PRIVATE_KEY = (sua chave)
```

**Gerar secrets** (copie/cola no terminal):
```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex')); console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

**Deploy:**
- [ ] Create Web Service → aguarde ~10 min
- [ ] Copie a URL final (ex.: `https://bingo2gether-api.onrender.com`)

**Aplicar migrations:**
- [ ] No Render Dashboard → seu serviço → Shell
- [ ] Cole:
```bash
cd /opt/render/project/src/backend
npm ci
npx prisma generate
npx prisma migrate deploy
```
- [ ] Aguarde conclusão

---

### 3️⃣ Vercel — Frontend (5 min)

**Criar Project:**
- [ ] Acesse https://vercel.com
- [ ] New Project → Import Git Repository
- [ ] Selecione `bingo2gether`
- [ ] Root Directory: `frontend`

**Environment Variables (Production):**
```
VITE_API_URL = https://bingo2gether-api.onrender.com/api
VITE_STRIPE_PUBLIC_KEY = pk_test_...
VITE_VAPID_PUBLIC_KEY = (sua chave)
```

**Deploy:**
- [ ] Deploy → aguarde ~5 min
- [ ] Copie a URL final (ex.: `https://bingo2gether.vercel.app`)

---

### 4️⃣ Render — Sincronizar URLs (2 min)

- [ ] Volte ao Render → seu serviço backend
- [ ] Environment → procure `FRONTEND_URL`
- [ ] Mude para: `https://bingo2gether.vercel.app` (ou sua URL do Vercel)
- [ ] **Manual Deploy** → Deploy Latest Commit
- [ ] Aguarde ~5 min

---

### 5️⃣ Testes de produção (5 min)

**Health check:**
```bash
curl https://bingo2gether-api.onrender.com/health
# Deve retornar: {"status":"OK","timestamp":"..."}
```

**Frontend:**
- [ ] Abra https://bingo2gether.vercel.app
- [ ] F12 → Network → confirme chamadas para `VITE_API_URL`
- [ ] Teste login/registro
- [ ] Teste criar jogo
- [ ] Teste impressão

**Pagamentos:**
- [ ] Teste fluxo de checkout (Stripe ou MercadoPago)
- [ ] Confirme webhook funcionando

---

## 🎁 URLs finais (copie para documentação)

| Serviço | URL | Nota |
|---------|-----|------|
| Frontend | https://bingo2gether.vercel.app | Compartilhe com clientes |
| Backend API | https://bingo2gether-api.onrender.com/api | Uso interno |
| Database | Render PostgreSQL | Não compartilhe |

---

## 🆘 Troubleshooting rápido

| Erro | Solução |
|------|---------|
| "CORS error" | Verificar `FRONTEND_URL` em Render envs |
| "DB connection failed" | Verificar `DATABASE_URL` está correta |
| "Frontend vazio" | F12 → Console → verificar `VITE_API_URL` |
| "Migrations failed" | Rodar novamente no Render Shell |
| "API não responde" | Verificar logs em Render Dashboard |

---

## 📚 Arquivos de referência

- `DEPLOY_READY.md` — guia detalhado
- `DEPLOY_AUTOMATION.md` — o que foi automatizado
- `backend/.env.production.example` — template de envs
- `frontend/.env.production.example` — template de envs
- `types/supabase.ts` — TypeScript types do banco

---

## 🚀 Pronto para ir ao ar!

**Tempo total estimado: 30-45 minutos**

Siga o checklist acima na ordem e você terá a aplicação online.  
Boa sorte! 🎉

