# ⚡ CONFIGURAÇÃO RÁPIDA - VERCEL

## Se você está vendo o erro: "No Output Directory named 'public' found"

### SOLUÇÃO RÁPIDA:

1. **Vá para o dashboard do Vercel**: https://vercel.com/dashboard

2. **Selecione seu projeto** → **Settings** → **General**

3. **Em "Build & Development Settings"**, clique em **"Edit"** ou **"Override"**

4. **Configure EXATAMENTE assim:**

```
Framework Preset: Vite

Root Directory: ./ 
(deixe vazio ou coloque ./)

Build Command: 
npm install --prefix frontend && npm --prefix frontend run build

Output Directory: 
frontend/dist

Install Command: 
npm install --prefix frontend

Development Command: (opcional)
npm --prefix frontend run dev
```

5. **Clique em "Save"**

6. **Vá para Deployments** → Clique nos 3 pontinhos (...) → **"Redeploy"**

---

## ✅ Checklist Rápido

- [ ] Framework = Vite
- [ ] Build Command = `npm install --prefix frontend && npm --prefix frontend run build`
- [ ] Output Directory = `frontend/dist`
- [ ] Install Command = `npm install --prefix frontend`
- [ ] Save + Redeploy

---

## 🎯 Variáveis de Ambiente (NÃO ESQUEÇA!)

Vá em **Settings** → **Environment Variables** e adicione:

**Obrigatória:**
```
VITE_API_URL=https://seu-backend.onrender.com/api
```

**Opcionais:**
```
VITE_VAPID_PUBLIC_KEY=BHtjVHoTBqoYMHOPEdp4XuT0Bf6NA7dn-B0KfKhyelFt_izpgnUsNW3iRgqEiJ-gTxMwEDoNo-LALu0jvLJaYpg
VITE_GOOGLE_CLIENT_ID=seu-google-client-id
VITE_GEMINI_API_KEY=sua-chave-gemini
```

---

## 🚀 Depois do Deploy

Seu site estará em: `https://seu-projeto.vercel.app`

Teste:
1. Abra a URL
2. F12 → Console (não deve ter erros vermelhos)
3. F12 → Network → Veja se chama o backend corretamente

---

## 💡 Dicas Importantes

1. **Sempre use `npm --prefix frontend`** nos comandos
2. **Output Directory DEVE ser `frontend/dist`** (com a pasta frontend)
3. **Não coloque `cd frontend`** nos comandos do Vercel
4. **Se mudar algo, sempre Redeploy**

---

## ❌ Erros Comuns

### "Command not found: vite"
- **Causa**: Install command errado
- **Solução**: Use `npm install --prefix frontend`

### "Cannot find module 'react'"
- **Causa**: Não instalou dependências do frontend
- **Solução**: Build command deve incluir: `npm install --prefix frontend && npm --prefix frontend run build`

### "404 Not Found" em todas as rotas
- **Causa**: Faltam rewrites para SPA
- **Solução**: O `vercel.json` já tem isso configurado

### Build funciona, mas página em branco
- **Causa**: `VITE_API_URL` não configurada
- **Solução**: Adicione as variáveis de ambiente

---

**Pronto! Seu deploy deve funcionar agora! 🎉**
