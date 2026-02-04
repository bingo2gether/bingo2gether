# 🚀 COMANDOS RÁPIDOS - BINGO2GETHER

## ✅ APLICAÇÃO JÁ ESTÁ RODANDO!

Se você está vendo isso, a aplicação já foi iniciada e está funcionando.

## 🔗 ACESSO IMEDIATO

### Frontend (Interface do Usuário)
```
http://localhost:5173/
```

### Backend API (Teste endpoints)
```
http://localhost:3001/health
```

---

## 🧪 TESTES RÁPIDOS (Copy & Paste)

### 1. Health Check (Verificar se backend está vivo)
```powershell
curl http://localhost:3001/health
```

### 2. Registrar Usuário
```powershell
curl -X POST http://localhost:3001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"seu@email.com","password":"Senha123!","name":"Seu Nome"}'
```

### 3. Fazer Login
```powershell
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"seu@email.com","password":"Senha123!"}'
```

Você receberá um token JWT que pode usar em requisições autenticadas.

### 4. Acessar Dados do Usuário (Autenticado)
```powershell
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" `
  http://localhost:3001/api/auth/me
```

### 5. Listar Jogos do Usuário
```powershell
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" `
  http://localhost:3001/api/games
```

---

## 🛑 PARAR A APLICAÇÃO

Se precisar parar, pressione:
```
Ctrl + C
```

No terminal onde rodou `npm run dev`

---

## ▶️ REINICIAR A APLICAÇÃO

Se precisar reiniciar:

```powershell
# Na raiz do projeto
cd "c:\Users\racle\Meu Drive\Projeto IA\copy-of-bingo2gether---atualizado"
npm run dev
```

---

## 📊 VERIFICAÇÃO DO STATUS

### Terminal Frontend
Deve mostrar:
```
  VITE v5.4.21  ready in X ms
  ➜  Local:   http://localhost:5173/
```

### Terminal Backend
Deve mostrar:
```
🚀 Server running on port 3001
```

Se não estiver mostrando, tente os comandos acima para reiniciar.

---

## 📝 DOCUMENTAÇÃO DISPONÍVEL

| Arquivo | Descrição |
|---------|-----------|
| `START_HERE.txt` | **VOCÊ ESTÁ AQUI** - Guia rápido |
| `RESUMO_EXECUTIVO.md` | Sumário completo em Markdown |
| `DEPLOYMENT_STATUS.md` | Detalhes técnicos completos |
| `TESTING_GUIDE.md` | Guia completo de testes (10 seções) |

---

## 🔧 TROUBLESHOOTING RÁPIDO

### "Connection refused"
- Frontend ou backend saiu?
- Tente reiniciar com: `npm run dev`

### "Porta já em uso"
```powershell
# Encontrar processo na porta 5173 (frontend)
Get-NetTCPConnection -LocalPort 5173

# Encontrar processo na porta 3001 (backend)
Get-NetTCPConnection -LocalPort 3001
```

### "Cannot find module"
```powershell
# Reinstalar dependências
npm install
cd frontend && npm install
cd ../backend && npm install
```

---

## ✨ STATUS ATUAL

```
✅ Frontend: Rodando em http://localhost:5173/
✅ Backend: Rodando em http://localhost:3001/
✅ Mock Database: Funcionando em memória
✅ Sem erros de compilação
✅ Pronto para testes
```

---

## 🎯 PRÓXIMAS AÇÕES

1. **Teste o Frontend**: Abra http://localhost:5173/
2. **Teste a API**: Execute um dos comandos de teste acima
3. **Leia TESTING_GUIDE.md**: Para testes completos
4. **Reporte qualquer problema**: Se algo não funcionar

---

**Versão:** 1.0.0-beta  
**Data:** 3 de Fevereiro de 2026  
**Status:** ✅ FUNCIONAL
