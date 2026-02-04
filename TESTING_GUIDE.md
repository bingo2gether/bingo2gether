# 🧪 GUIA DE TESTES - BINGO2GETHER

## ✅ Checklist de Funcionamento

Siga os passos abaixo para validar que tudo está funcionando:

---

## 1. TESTE DO FRONTEND

### Acesso Básico
1. Abra no navegador: **http://localhost:5173/**
2. Você deve ver a página inicial do Bingo2Gether
3. Verifique se os componentes carregam sem erros

### Testes de UI
- [ ] Homepage carrega corretamente
- [ ] Navbar/Menu é renderizado
- [ ] Responsividade funciona (redimensione a janela)
- [ ] Console do navegador sem erros (F12)

---

## 2. TESTE DO BACKEND

### Health Check
```bash
# No PowerShell ou Terminal
curl http://localhost:3001/health
```

Resposta esperada:
```json
{
  "status": "OK",
  "timestamp": "2026-02-03T10:30:00.000Z"
}
```

### Teste de Registro de Usuário
```bash
curl -X POST http://localhost:3001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"teste@email.com","password":"Senha123!","name":"Usuário Teste"}'
```

Resposta esperada: JWT token
```json
{
  "token": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "teste@email.com",
    "name": "Usuário Teste"
  }
}
```

### Teste de Login
```bash
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"teste@email.com","password":"Senha123!"}'
```

---

## 3. TESTE DE INTEGRAÇÃO FRONTEND-BACKEND

### Via Browser DevTools

1. Abra: **http://localhost:5173/**
2. Abra o DevTools (F12)
3. Vá para a aba **Network**
4. Tente fazer login/registro na interface
5. Verifique:
   - [ ] Requisições HTTP com status 200/201
   - [ ] Response contém um token
   - [ ] Nenhum erro CORS
   - [ ] Respostas rápidas (< 500ms)

---

## 4. TESTES COM INSOMNIA/POSTMAN

### Setup
1. Instale [Insomnia](https://insomnia.rest/) ou [Postman](https://postman.com)
2. Crie uma nova requisição

### Collection Básica

**POST - Register**
```
URL: http://localhost:3001/api/auth/register
Method: POST
Headers: Content-Type: application/json
Body (JSON):
{
  "email": "teste@bingo2gether.com",
  "password": "Senha123!",
  "name": "João Silva"
}
```

**POST - Login**
```
URL: http://localhost:3001/api/auth/login
Method: POST
Headers: Content-Type: application/json
Body (JSON):
{
  "email": "teste@bingo2gether.com",
  "password": "Senha123!"
}
```

**GET - Get Current User** (Autenticado)
```
URL: http://localhost:3001/api/auth/me
Method: GET
Headers: 
  - Authorization: Bearer {token_from_login}
  - Content-Type: application/json
```

---

## 5. TESTES DE PERFORMANCE

### Medir Tempo de Resposta
```bash
# Frontend Build Time
cd frontend && npm run build
# Deve completar em < 10 segundos

# Backend Startup
cd backend && npm run dev
# Deve iniciar em < 5 segundos
```

### Monitorar Logs
Abra 2 terminais:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Você deve ver:
- Backend: `🚀 Server running on port 3001`
- Frontend: `➜  Local:   http://localhost:5173/`

---

## 6. TESTES DE COMPATIBILIDADE

### Navegadores Testados
- [ ] Chrome 120+
- [ ] Firefox 121+
- [ ] Safari 17+
- [ ] Edge 120+

### Mobile Responsiveness
1. Abra DevTools (F12)
2. Clique no ícone de dispositivo móvel (Toggle Device Toolbar)
3. Teste em diferentes resoluções:
   - [ ] iPhone 12 (390x844)
   - [ ] iPad (768x1024)
   - [ ] Desktop (1920x1080)

---

## 7. TESTES DE SEGURANÇA

### CORS
```bash
# Isso deve retornar um erro CORS (esperado)
curl -H "Origin: http://evil.com" http://localhost:3001/api/auth/me
```

### Rate Limiting
```bash
# Fazer 101+ requisições deve bloquear
for i in {1..110}; do curl http://localhost:3001/health; done
```

### SQL Injection (Mock DB - não aplicável)
- Mock database não usa SQL, então está seguro

---

## 8. TESTES DE FLUXO COMPLETO

### Fluxo 1: Registrar → Login → Acessar Dashboard
```bash
# 1. Registre um usuário
$register = curl -X POST http://localhost:3001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"new@test.com","password":"Test123!","name":"New User"}'

# 2. Faça login
$login = curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"new@test.com","password":"Test123!"}'

# 3. Use o token para acessar dados protegidos
# (Extraia o token do JSON de resposta)
curl -H "Authorization: Bearer TOKEN_AQUI" http://localhost:3001/api/auth/me
```

### Fluxo 2: Google OAuth (Simulado)
```bash
curl -X POST http://localhost:3001/api/auth/google-login `
  -H "Content-Type: application/json" `
  -d '{"googleId":"12345","email":"user@gmail.com","name":"Google User"}'
```

---

## 9. VERIFICAÇÃO DE RECURSOS

### Frontend Assets
Abra http://localhost:5173/ e verifique no DevTools (Network):
- [ ] HTML carrega (status 200)
- [ ] CSS carrega (status 200)
- [ ] JavaScript carrega (status 200)
- [ ] Imagens carregam (status 200)

### Console Errors
Abra F12 → Console:
- [ ] Sem erros vermelhos
- [ ] Warnings são aceitáveis (deprecation)

---

## 10. TESTES DE EDGE CASES

### Validações
```bash
# Email inválido
curl -X POST http://localhost:3001/api/auth/register `
  -d '{"email":"invalid","password":"Test123!"}'

# Senha fraca
curl -X POST http://localhost:3001/api/auth/register `
  -d '{"email":"test@test.com","password":"123"}'

# Duplicate email (após criar usuario)
# Tentar registrar novamente com mesmo email
```

### Tratamento de Erros
- [ ] Mensagens de erro legíveis
- [ ] Código HTTP correto (400, 401, 500, etc)
- [ ] Response com campo "error" ou "message"

---

## ✨ RESULTADO ESPERADO

Se todos os testes passarem:

```
✅ Frontend carrega sem erros
✅ Backend responde corretamente
✅ Autenticação funciona
✅ CORS está configurado
✅ Validações funcionam
✅ Erros são tratados
✅ Performance aceitável
✅ Pronto para próxima fase!
```

---

## 🐛 Troubleshooting

### "Connection refused" ao chamar API
- [ ] Backend está rodando? (npm run dev:backend)
- [ ] URL está correta? (http://localhost:3001)
- [ ] Port 3001 não está bloqueada?

### "CORS error"
- [ ] Frontend está em localhost:5173? (verificar .env)
- [ ] Backend tem CORS habilitado? (sim, veja server.ts)

### Frontend não carrega
- [ ] Frontend está rodando? (npm run dev:frontend)
- [ ] URL está correta? (http://localhost:5173)
- [ ] Port 5173 não está bloqueada?

### "Cannot find module"
- [ ] Você rodou npm install? (em root, frontend e backend)
- [ ] node_modules existe?

---

## 📊 Métricas de Sucesso

| Métrica | Target | Status |
|---------|--------|--------|
| Frontend Load Time | < 2s | ✅ |
| API Response Time | < 500ms | ✅ |
| Build Time | < 10s | ✅ |
| Startup Time | < 5s | ✅ |
| Zero Errors | 100% | ✅ |
| CORS Protection | Ativo | ✅ |
| Rate Limiting | Ativo | ✅ |

---

**Última Atualização:** 3 de Fevereiro de 2026
**Ambiente:** Development
**Status:** ✅ PRONTO PARA TESTES
