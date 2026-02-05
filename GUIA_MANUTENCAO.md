# 📊 Guia de Monitoramento e Manutenção - Bingo2Gether

## 🔍 Monitoramento Contínuo

### 1. Health Checks Automáticos

#### Backend Health Check
```bash
# Verificar status da API
curl https://seu-backend.onrender.com/health

# Resposta esperada:
{
  "status": "OK",
  "timestamp": "2026-02-05T...",
  "uptime": 12345.67,
  "environment": "production",
  "version": "1.0.0",
  "memory": {
    "used": 45,
    "total": 512,
    "unit": "MB"
  }
}
```

#### Frontend Health Check
```bash
curl https://seu-app.vercel.app/
# Deve retornar HTML da página principal
```

### 2. Configurar Uptime Monitoring (Grátis)

**UptimeRobot:** https://uptimerobot.com (gratuito)

1. Criar conta
2. Adicionar monitores:
   - **Backend API:** https://seu-backend.onrender.com/health
   - **Frontend:** https://seu-app.vercel.app
3. Configurar alertas por email/SMS
4. Intervalo: 5 minutos

---

## 📈 Métricas Importantes

### Performance
- **Tempo de resposta:** < 500ms ideal
- **Uptime:** > 99% esperado
- **Taxa de erro:** < 1% aceitável

### Uso de Recursos
- **CPU:** < 70% ideal
- **Memória:** < 80% ideal
- **Disco (Supabase):** Monitorar crescimento

### Aplicação
- **Registros/dia:** Acompanhar crescimento
- **Logins/dia:** Taxa de engajamento
- **Transações/dia:** Volume de pagamentos

---

## 🚨 Alertas Críticos

### Configurar no Sentry

1. Acesse: https://sentry.io
2. Vá para: **Alerts** → **Create Alert**
3. Configure alertas para:
   - Erros 500 (server errors)
   - Taxa de erro > 5%
   - Tempo de resposta > 2s
   - Falhas de deploy

### Configurar no Render

1. Vá para o seu serviço
2. **Settings** → **Notifications**
3. Ativar:
   - Deploy failed
   - Service unhealthy
   - Resource limits

---

## 🔒 Segurança

### Checklist Semanal

- [ ] Revisar logs de erro no Sentry
- [ ] Verificar tentativas de login suspeitas
- [ ] Revisar uso anormal de API
- [ ] Verificar updates de dependências
- [ ] Backup manual do banco (Supabase)

### Checklist Mensal

- [ ] Atualizar dependências: `npm audit fix`
- [ ] Revisar chaves de API expiradas
- [ ] Verificar certificados SSL
- [ ] Testar recuperação de desastres
- [ ] Revisar logs de acesso

### Comandos Úteis

```bash
# Verificar vulnerabilidades
cd backend && npm audit
cd frontend && npm audit

# Atualizar dependências seguras
npm update

# Atualizar dependências com breaking changes
npm audit fix --force
```

---

## 📊 Logs e Debugging

### Acessar Logs do Backend (Render)

1. Dashboard do Render
2. Selecione seu serviço
3. Aba **"Logs"**
4. Filtros disponíveis:
   - Por data
   - Por nível (info, warning, error)
   - Busca por texto

### Acessar Logs do Frontend (Vercel)

1. Dashboard da Vercel
2. Selecione seu projeto
3. **Deployments** → Clique no deploy
4. Aba **"Functions"** ou **"Runtime Logs"**

### Comandos de Debug

```bash
# Logs em tempo real (Render CLI)
render logs -f -s bingo2gether-api

# Conectar ao banco para debug
psql "postgresql://postgres:SENHA@db.xxxxx.supabase.co:5432/postgres"

# Ver últimas queries
SELECT query, calls, total_time 
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
```

---

## 🔄 Backups

### Banco de Dados (Supabase)

**Backup Automático:**
- Supabase faz backups diários automaticamente
- Retenção: 7 dias (plano free), 30 dias (plano pro)

**Backup Manual:**
```bash
# Exportar banco completo
pg_dump "postgresql://..." > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql "postgresql://..." < backup_20260205.sql
```

**Agendamento de Backups:**
```bash
# Cron job diário (Linux/Mac)
0 2 * * * pg_dump "postgresql://..." > /backups/db_$(date +\%Y\%m\%d).sql
```

### Código (GitHub)

- ✅ Código já versionado no GitHub
- ✅ Branches protegidas (main)
- ⚠️ Recomendação: Tag releases

```bash
# Criar release tag
git tag -a v1.0.0 -m "Production release 1.0.0"
git push origin v1.0.0
```

---

## 🚀 Deploys e Rollbacks

### Deploy Nova Versão

```bash
# 1. Fazer mudanças localmente
# 2. Testar localmente
npm run dev

# 3. Commit e push
git add .
git commit -m "feat: nova feature"
git push origin main

# 4. Render e Vercel fazem deploy automático
# 5. Aguardar 3-5 minutos
# 6. Verificar logs
```

### Rollback em Caso de Problema

**Render (Backend):**
1. Dashboard → Seu serviço
2. **Manual Deploy**
3. Selecionar commit anterior
4. Deploy

**Vercel (Frontend):**
1. Dashboard → Seu projeto
2. **Deployments**
3. Encontrar deploy anterior com ✓
4. **...** → **Promote to Production**

**Git:**
```bash
# Reverter último commit
git revert HEAD
git push origin main
```

---

## 📱 Manutenção de Rotina

### Diariamente (5 min)
- [ ] Verificar UptimeRobot (uptime)
- [ ] Olhar alertas do Sentry (erros)
- [ ] Verificar status Render/Vercel

### Semanalmente (30 min)
- [ ] Revisar logs de erro
- [ ] Verificar performance (tempo resposta)
- [ ] Revisar métricas de uso
- [ ] Backup manual do banco
- [ ] Teste de smoke (testar features principais)

### Mensalmente (2 horas)
- [ ] Atualizar dependências
- [ ] Revisar e otimizar queries lentas
- [ ] Limpar dados antigos/não usados
- [ ] Revisar custos de infraestrutura
- [ ] Testar recuperação de desastre
- [ ] Documentar mudanças

---

## 💰 Controle de Custos

### Monitorar Uso

**Supabase:**
- Dashboard → Settings → Usage
- Métricas:
  - Database size
  - Bandwidth
  - API requests

**Render:**
- Dashboard → Billing
- Métricas:
  - Hours used
  - Bandwidth
  - Build minutes

**Vercel:**
- Dashboard → Settings → Usage
- Métricas:
  - Bandwidth
  - Serverless function invocations
  - Build minutes

### Otimizações para Reduzir Custos

1. **Caching:**
   - Usar Redis para dados frequentes
   - Cache de queries repetidas

2. **Compressão:**
   - Ativar gzip no servidor
   - Minificar assets (JS, CSS)

3. **CDN:**
   - Vercel já usa CDN (incluído)
   - Imagens: usar serviço de CDN externo

4. **Limpeza:**
   - Deletar logs antigos
   - Arquivar dados antigos

---

## 🆘 Troubleshooting Comum

### Problema: API lenta

**Diagnóstico:**
```bash
# Verificar queries lentas
SELECT query, mean_time 
FROM pg_stat_statements 
WHERE mean_time > 100
ORDER BY mean_time DESC;
```

**Solução:**
- Adicionar índices no banco
- Implementar cache com Redis
- Otimizar queries N+1

### Problema: Alto uso de memória

**Diagnóstico:**
- Verificar /health endpoint (memory)
- Revisar logs no Render

**Solução:**
- Aumentar limite de memória no Render
- Otimizar código (memory leaks)
- Implementar pagination

### Problema: Erros 500

**Diagnóstico:**
- Ver logs no Sentry (detalhes do erro)
- Ver logs no Render (stack trace)

**Solução:**
- Fix do bug específico
- Deploy da correção
- Monitorar por 24h

---

## 📞 Canais de Suporte

### Plataformas

- **Render:** https://render.com/docs/troubleshooting
- **Vercel:** https://vercel.com/support
- **Supabase:** https://supabase.com/support

### Comunidades

- Discord do Render
- Comunidade Vercel
- Supabase Discord

---

## ✅ Checklist de Saúde do Sistema

Execute semanalmente:

```bash
# 1. Health checks
curl https://seu-backend.onrender.com/health
curl https://seu-app.vercel.app/

# 2. Test endpoints principais
curl -X POST https://seu-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# 3. Verificar banco
psql "postgresql://..." -c "SELECT COUNT(*) FROM \"User\";"

# 4. Verificar logs
# (Ver no dashboard Render e Sentry)

# 5. Verificar vulnerabilidades
cd backend && npm audit
cd frontend && npm audit
```

**Status esperado:** Todos os comandos devem retornar sucesso

---

## 📚 Documentação Adicional

- [Guia de Deploy](./GUIA_DEPLOY_COMPLETO.md)
- [Checklist de Deploy](./CHECKLIST_DEPLOY.md)
- [Guia de Testes](./TESTING_GUIDE.md)

---

**Mantenha este guia atualizado conforme o sistema evolui!**

Última atualização: Fevereiro 2026
