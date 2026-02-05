# 🚀 Guia de Deploy no Vercel - Bingo2Gether Frontend

Este guia mostra como fazer deploy do frontend no Vercel.

## 📋 Pré-requisitos

1. Conta no Vercel (criar em https://vercel.com)
2. Repositório GitHub com o código
3. Backend já deployado (se necessário)

## 🔧 Configuração no Vercel

### Passo 1: Importar Projeto

1. Acesse https://vercel.com/dashboard
2. Clique em "Add New..." → "Project"
3. Selecione seu repositório `bingo2gether`
4. Clique em "Import"

### Passo 2: Configuração Automática

O Vercel agora vai detectar automaticamente as configurações do `vercel.json`:

- ✅ **Build Command**: `cd frontend && npm run build`
- ✅ **Output Directory**: `frontend/dist`
- ✅ **Install Command**: `npm install`
- ✅ **Framework**: Detectado automaticamente (Vite)

**Não precisa alterar nada!** As configurações já estão no `vercel.json`.

### Passo 3: Variáveis de Ambiente

Clique em "Environment Variables" e adicione:

#### Obrigatórias:
- `VITE_API_URL` - URL do backend (ex: `https://bingo2gether-api.onrender.com/api`)

#### Opcionais (mas recomendadas):
- `VITE_VAPID_PUBLIC_KEY` - Chave pública para notificações push
- `VITE_GOOGLE_CLIENT_ID` - ID do cliente Google OAuth
- `VITE_GEMINI_API_KEY` - API key do Google Gemini (se usar IA)

**Exemplo:**
```
VITE_API_URL=https://bingo2gether-api.onrender.com/api
VITE_VAPID_PUBLIC_KEY=BHtjVHoTBqoYMHOPEdp4XuT0Bf6NA7dn-B0KfKhyelFt_izpgnUsNW3iRgqEiJ-gTxMwEDoNo-LALu0jvLJaYpg
VITE_GOOGLE_CLIENT_ID=seu-google-client-id.apps.googleusercontent.com
```

### Passo 4: Deploy

1. Clique em "Deploy"
2. Aguarde ~2-3 minutos
3. Você receberá uma URL como: `https://bingo2gether.vercel.app`

## ✅ Verificação

Após o deploy, verifique:

1. **Frontend carrega**: Acesse a URL do Vercel
2. **Console sem erros**: Abra DevTools (F12) → Console
3. **API conecta**: DevTools → Network → Verifique chamadas para o backend

## 🔄 Atualizações Futuras

Vercel faz deploy automático quando você:
- Fizer push para a branch main
- Merge de pull requests

## 📁 Estrutura do Projeto

```
bingo2gether/
├── vercel.json          ← Configuração do Vercel
├── .vercelignore        ← Arquivos ignorados no deploy
├── frontend/            ← Código do frontend
│   ├── dist/           ← Build output (gerado)
│   ├── src/            ← Código fonte
│   └── package.json
└── backend/             ← Backend (não deployado no Vercel)
```

## 🐛 Troubleshooting

### Build falhou

**Erro**: "Build failed with error"

**Solução**: 
1. Teste localmente: `cd frontend && npm run build`
2. Verifique se não há erros TypeScript
3. Confirme que `vercel.json` está no root do repo

### Página em branco após deploy

**Erro**: Página carrega mas está em branco

**Solução**:
1. Verifique Console no browser (F12)
2. Confirme que `VITE_API_URL` está configurada
3. Verifique se backend está respondendo

### CORS Error

**Erro**: "Access to fetch at '...' has been blocked by CORS policy"

**Solução**:
1. Configure CORS no backend para aceitar o domínio Vercel
2. Adicione `https://seu-app.vercel.app` nas origens permitidas

### Deploy lento

**Observação**: Primeiro deploy pode levar 3-5 minutos

**Solução**: 
- É normal! Deploys subsequentes são mais rápidos (~1-2 min)

## 📞 Suporte

- Documentação Vercel: https://vercel.com/docs
- Status Vercel: https://www.vercel-status.com/

---

**✨ Configuração completa!** Seu frontend estará acessível no Vercel.
