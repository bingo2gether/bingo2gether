# 🎯 Bingo2Gether - Checklist Rápido de Deploy

## ✅ Pré-Deploy (No seu computador)

### 1. Verificar builds localmente
```bash
# Backend
cd backend && npm install && npm run build
# Frontend  
cd ../frontend && npm install && npm run build
```

### 2. Commit e push para GitHub
```bash
git add .
git commit -m "feat: ready for production deployment"
git push origin main
```

---

## 🗄️ Banco de Dados (15 min)

### Supabase
1. Criar conta: https://supabase.com
2. Novo projeto → Nome: `bingo2gether-prod`
3. Região: `South America (São Paulo)`
4. Copiar CONNECTION STRING
5. Executar migrations:
   ```bash
   export DATABASE_URL="sua-connection-string"
   npx prisma migrate deploy
   ```

**✅ Salvou:** DATABASE_URL

---

## 🖥️ Backend (20 min)

### Render.com
1. Criar conta: https://render.com
2. New Web Service → Conectar repo `bingo2gether`
3. Configurações:
   - Root Directory: `backend`
   - Build: `npm install && npx prisma generate && npm run build`
   - Start: `npm run start`
   
4. Environment Variables:
   ```env
   DATABASE_URL=sua-connection-string-do-supabase
   JWT_SECRET=use-openssl-rand-base64-64
   SESSION_SECRET=use-openssl-rand-base64-64
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://seu-app.vercel.app
   ```

5. Deploy e copiar URL

**✅ Salvou:** URL do Backend (ex: https://app-api.onrender.com)

---

## 🎨 Frontend (10 min)

### Vercel
1. Criar conta: https://vercel.com
2. Import Project → Selecionar `bingo2gether`
3. Configurações:
   - Root Directory: `frontend`
   - Framework: Vite
   
4. Environment Variables:
   ```env
   VITE_API_URL=https://seu-backend.onrender.com/api
   ```

5. Deploy e copiar URL

**✅ Salvou:** URL do Frontend (ex: https://seu-app.vercel.app)

---

## 🔄 Atualizar Backend

1. Voltar no Render
2. Atualizar `FRONTEND_URL` com a URL real da Vercel
3. Salvar (irá reiniciar automaticamente)

---

## ✅ Testar

```bash
# Health check
curl https://seu-backend.onrender.com/health

# Abrir no navegador
https://seu-app.vercel.app
```

---

## 🎉 Pronto!

- ✅ Backend: https://seu-backend.onrender.com
- ✅ Frontend: https://seu-app.vercel.app
- ✅ Banco: Supabase PostgreSQL
- ✅ SSL/HTTPS: Automático
- ✅ CI/CD: GitHub Actions configurado

---

## 📚 Documentação Completa

Para guia detalhado com troubleshooting, veja:
- [GUIA_DEPLOY_COMPLETO.md](./GUIA_DEPLOY_COMPLETO.md)
- [DEPLOY_RAPIDO.txt](./DEPLOY_RAPIDO.txt)

---

## 💰 Custos

**Free Tier (Suficiente para começar):**
- Supabase: 500MB grátis
- Render: 750h/mês grátis
- Vercel: 100GB grátis
- **Total: R$ 0/mês**

---

## 🆘 Problemas?

**CORS Error:**
- Verificar se FRONTEND_URL está correto no Render

**API não responde:**
- Verificar logs no Render → Logs tab
- Testar health check diretamente

**Build falha:**
- Verificar Node version (usar 20)
- Verificar se prisma generate está no build command

---

## 📞 Suporte

- Issues: GitHub Issues
- Docs: Ver pasta `/docs`
- Email: suporte@bingo2gether.com
