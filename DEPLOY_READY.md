# 🚀 BINGO2GETHER — DEPLOY PRONTO

**Status**: Automático completado ✅  
**Data**: 4 de Fevereiro de 2026

---

## ✅ O que foi automatizado

- [x] Build local (frontend + backend) — OK
- [x] GitHub Actions CI workflow (`.github/workflows/ci.yml`) — criado
- [x] Variáveis de ambiente (`.env.production.example`) — criadas
- [x] Supabase database (6 tabelas, schema completo) — inicializado
- [x] TypeScript types (Supabase) — gerados
- [x] Frontend preview (`vite preview`) — rodando em http://localhost:8080/

---

## 📋 Passos manuais restantes (na ordem)

### 1️⃣ GITHUB — Enviar código

No terminal na raiz do projeto:
```bash
git init
git add .
git commit -m "Deploy: env + CI setup"
git remote add origin https://github.com/YOUR_USER/bingo2gether.git
git branch -M main
git push -u origin main
```

**Verificar**: código deve aparecer em https://github.com/YOUR_USER/bingo2gether

---

### 2️⃣ RENDER — Backend

1. Acesse https://render.com → New → Web Service
2. Connect repository → selecione `bingo2gether`
3. Preencha:
   - **Name**: `bingo2gether-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. Environment variables (clique "Add"):
   - `DATABASE_URL` = (copie de Supabase)
   - `PORT` = `3001`
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = (gere com: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `SESSION_SECRET` = (outro hash igual acima)
   - `FRONTEND_URL` = (vai preencher depois)
   - `STRIPE_SECRET_KEY` = `sk_test_...` (sua chave)
   - `MERCADOPAGO_ACCESS_TOKEN` = (seu token)
   - `REDIS_URL` = (opcional; usar só se tiver Redis)
   - `VAPID_PUBLIC_KEY` = (chave VAPID pública)
   - `VAPID_PRIVATE_KEY` = (chave VAPID privada)
5. **Create Web Service** → aguarde ~10 min
6. Copie a URL que aparecer (ex.: `https://bingo2gether-api.onrender.com`)

**Aplicar Migrations** (se ainda não fez local):
- No Render Dashboard → seu serviço → Shell
```bash
cd /opt/render/project/src/backend
npm ci
npx prisma migrate deploy
```

---

### 3️⃣ VERCEL — Frontend

1. Acesse https://vercel.com → New Project
2. Import Git Repository → selecione `bingo2gether`
3. Configure:
   - **Root Directory**: `frontend`
   - Build Command: `npm run build` (auto-detect)
   - Output Directory: `dist` (auto-detect)
4. Environment Variables (Production):
   - `VITE_API_URL` = `https://<seu-render-url>/api` (ex.: `https://bingo2gether-api.onrender.com/api`)
   - `VITE_STRIPE_PUBLIC_KEY` = `pk_test_...` (sua chave pública)
   - `VITE_VAPID_PUBLIC_KEY` = (mesma da acima)
5. **Deploy** → aguarde ~5 min
6. Copie a URL (ex.: `https://bingo2gether.vercel.app`)

---

### 4️⃣ RENDER — Atualizar e redeploy

1. Volte ao Render → seu serviço backend
2. Environment → procure `FRONTEND_URL`
3. Mude para sua URL do Vercel
4. **Manual Deploy** → Deploy Latest Commit
5. Aguarde ~5 min

---

### 5️⃣ Stripe / MercadoPago webhooks

**Stripe**:
- Dashboard → Developers → Webhooks → Add endpoint
- URL: `https://<seu-render-url>/api/payment/stripe/webhook`
- Events: `checkout.session.completed`, etc.

**MercadoPago**: configure conforme docs (access token já nas envs)

---

## ✅ Verificações finais

```bash
# Health check (deve retornar {"status":"OK"})
curl https://<seu-render-url>/health

# Frontend: abra no navegador
# https://<seu-vercel-url>

# DevTools → Network → confirme que requisições vão para VITE_API_URL
```

---

## 🔑 Gerar secrets (copia/cola)

```bash
# Gera um hash de 64 caracteres (use para JWT_SECRET, SESSION_SECRET)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📱 URLs finais

- **Frontend** (compartilhe com usuários): `https://<seu-vercel-url>`
- **Backend** (interno): `https://<seu-render-url>/api`
- **Database**: Supabase (não compartilhe!)

---

## 🆘 Troubleshooting

| Erro | Solução |
|------|---------|
| "CORS error" | Verificar `FRONTEND_URL` nas envs do Render |
| "DB connection fail" | Confirmar `DATABASE_URL` é válida |
| "Frontend vazio" | Verificar `VITE_API_URL` está correto |
| "Migrations failed" | Rodar manual no Render Shell: `npx prisma migrate deploy` |
| "Webhook não chega" | Verificar URL do webhook no Stripe/MercadoPago |

---

## 📚 Referências

- `DEPLOY_RAPIDO.txt` — instruções originais (mais detalhadas)
- `DEPLOY_AUTOMATION.md` — setup automático que foi feito
- `backend/.env.production.example` — template de envs
- `frontend/.env.production.example` — template de envs

---

## ✨ Próximos passos (pós-deploy)

- [ ] Testar login com Google/Facebook
- [ ] Testar fluxo de pagamento (Stripe/MercadoPago)
- [ ] Testar push notifications
- [ ] Configurar domínio customizado (opcional)
- [ ] Monitorar logs em produção

---

**Você está a ~15 minutos de ter a aplicação online!** 🎉

