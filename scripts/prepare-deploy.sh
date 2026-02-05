#!/bin/bash

# ============================================================================
# Bingo2Gether - Script de Preparação para Deploy
# ============================================================================
# Este script prepara o projeto para deployment, gerando secrets e configurações
# ============================================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║        🔧 PREPARAÇÃO PARA DEPLOY - BINGO2GETHER 🔧            ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Função para gerar secret aleatório
generate_secret() {
    if command -v openssl &> /dev/null; then
        openssl rand -base64 64 | tr -d '\n'
    else
        # Fallback se openssl não estiver disponível
        LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 64
    fi
}

echo "═══════════════════════════════════════════════════════════════"
echo "  🔑 Gerando Secrets de Segurança"
echo "═══════════════════════════════════════════════════════════════"
echo ""

JWT_SECRET=$(generate_secret)
SESSION_SECRET=$(generate_secret)

echo -e "${GREEN}✅ JWT_SECRET gerado${NC}"
echo -e "${GREEN}✅ SESSION_SECRET gerado${NC}"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  📝 Criando Arquivo de Configuração"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Criar arquivo deploy-config.txt com as informações
cat > deploy-config.txt << EOF
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║           CONFIGURAÇÕES DE DEPLOY - BINGO2GETHER              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

Data de Geração: $(date)

═══════════════════════════════════════════════════════════════
  🔑 SECRETS GERADOS (COPIE PARA RENDER/VERCEL)
═══════════════════════════════════════════════════════════════

JWT_SECRET=$JWT_SECRET

SESSION_SECRET=$SESSION_SECRET

═══════════════════════════════════════════════════════════════
  🗄️ CONFIGURAÇÃO DO SUPABASE
═══════════════════════════════════════════════════════════════

1. Criar projeto em: https://supabase.com
2. Nome do projeto: bingo2gether-prod
3. Região: South America (São Paulo)
4. Copiar DATABASE_URL e adicionar abaixo:

DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

═══════════════════════════════════════════════════════════════
  🖥️ CONFIGURAÇÃO DO RENDER (BACKEND)
═══════════════════════════════════════════════════════════════

Environment Variables para adicionar no Render:

DATABASE_URL=[Pegar do Supabase acima]
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET
NODE_ENV=production
PORT=3001
FRONTEND_URL=[Será preenchido depois com URL da Vercel]

Build Command: npm install && npx prisma generate && npm run build
Start Command: npm run start
Root Directory: backend

═══════════════════════════════════════════════════════════════
  🎨 CONFIGURAÇÃO DA VERCEL (FRONTEND)
═══════════════════════════════════════════════════════════════

Environment Variables para adicionar na Vercel:

VITE_API_URL=[Será preenchido com URL do Render]/api

Framework: Vite
Root Directory: frontend

═══════════════════════════════════════════════════════════════
  📋 CHECKLIST DE DEPLOY
═══════════════════════════════════════════════════════════════

Pré-Deploy (Local):
□ Executar: npm install em backend e frontend
□ Testar builds localmente
□ Commitar mudanças no Git
□ Push para GitHub

Supabase (15 min):
□ Criar conta e projeto
□ Copiar DATABASE_URL
□ Executar migrations: npx prisma migrate deploy

Render (20 min):
□ Conectar repositório GitHub
□ Configurar Environment Variables (copiar da seção acima)
□ Deploy
□ Copiar URL do backend

Vercel (10 min):
□ Import projeto
□ Configurar VITE_API_URL com URL do Render
□ Deploy
□ Copiar URL do frontend

Finalização (5 min):
□ Voltar no Render
□ Atualizar FRONTEND_URL com URL da Vercel
□ Testar health check: curl [BACKEND_URL]/health
□ Abrir app no navegador

═══════════════════════════════════════════════════════════════
  🔗 LINKS ÚTEIS
═══════════════════════════════════════════════════════════════

Supabase: https://supabase.com
Render: https://render.com
Vercel: https://vercel.com

Documentação:
- CHECKLIST_DEPLOY.md (guia rápido)
- GUIA_DEPLOY_COMPLETO.md (guia detalhado)

═══════════════════════════════════════════════════════════════

IMPORTANTE: Guarde este arquivo em local seguro!
Contém informações sensíveis (secrets).

EOF

echo -e "${GREEN}✅ Arquivo deploy-config.txt criado${NC}"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "  ⚠️  IMPORTANTE - SEGURANÇA"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}O arquivo deploy-config.txt contém secrets sensíveis!${NC}"
echo -e "${YELLOW}NÃO commite este arquivo no Git${NC}"
echo ""
echo "O arquivo já está em .gitignore para sua segurança."
echo ""

# Adicionar ao .gitignore se não estiver lá
if ! grep -q "deploy-config.txt" .gitignore 2>/dev/null; then
    echo "deploy-config.txt" >> .gitignore
    echo -e "${GREEN}✅ deploy-config.txt adicionado ao .gitignore${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  📊 RESUMO"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ Secrets de segurança gerados${NC}"
echo -e "${GREEN}✅ Arquivo de configuração criado${NC}"
echo -e "${GREEN}✅ .gitignore atualizado${NC}"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo -e "${CYAN}  🚀 PRÓXIMOS PASSOS${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "1. Abra o arquivo gerado:"
echo -e "   ${BLUE}cat deploy-config.txt${NC}"
echo ""
echo "2. Siga o checklist de deploy no arquivo"
echo ""
echo "3. Ou siga o guia detalhado:"
echo -e "   ${BLUE}cat CHECKLIST_DEPLOY.md${NC}"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ Preparação concluída! Boa sorte com o deploy! 🚀${NC}"
echo ""
