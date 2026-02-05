#!/bin/bash

# ============================================================================
# Bingo2Gether - Script de Validação Pré-Deploy
# ============================================================================
# Este script valida se o projeto está pronto para deployment
# Execute antes de iniciar o processo de deploy
# ============================================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
ERRORS=0
WARNINGS=0
SUCCESS=0

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║          🚀 VALIDAÇÃO PRÉ-DEPLOY - BINGO2GETHER 🚀            ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Função para printar sucesso
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((SUCCESS++))
}

# Função para printar erro
print_error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

# Função para printar warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

# Função para printar info
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "═══════════════════════════════════════════════════════════════"
echo "  📋 Verificando Estrutura do Projeto"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Verificar diretórios principais
if [ -d "backend" ] && [ -d "frontend" ]; then
    print_success "Estrutura de diretórios: backend/ e frontend/ encontrados"
else
    print_error "Estrutura de diretórios incompleta"
fi

# Verificar package.json
if [ -f "package.json" ] && [ -f "backend/package.json" ] && [ -f "frontend/package.json" ]; then
    print_success "Arquivos package.json encontrados"
else
    print_error "Arquivos package.json ausentes"
fi

# Verificar arquivos de exemplo
if [ -f ".env.example" ] || [ -f ".env.production.example" ]; then
    print_success "Arquivos de exemplo de ambiente encontrados"
else
    print_warning "Arquivos .env.example não encontrados"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🔧 Verificando Node.js e npm"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js instalado: $NODE_VERSION"
    
    # Verificar versão mínima (v20)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -ge 20 ]; then
        print_success "Versão do Node.js adequada (v20+)"
    else
        print_warning "Versão do Node.js abaixo da recomendada (v20+)"
    fi
else
    print_error "Node.js não instalado"
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm instalado: v$NPM_VERSION"
else
    print_error "npm não instalado"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  📦 Verificando Dependências"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Verificar node_modules
if [ -d "backend/node_modules" ]; then
    print_success "Dependências do backend instaladas"
else
    print_warning "Dependências do backend não instaladas (execute: cd backend && npm install)"
fi

if [ -d "frontend/node_modules" ]; then
    print_success "Dependências do frontend instaladas"
else
    print_warning "Dependências do frontend não instaladas (execute: cd frontend && npm install)"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🔨 Testando Builds"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Testar build do backend
print_info "Testando build do backend..."
cd backend
if npm run build &> /tmp/backend-build.log; then
    print_success "Build do backend: OK"
else
    print_error "Build do backend: FALHOU (veja /tmp/backend-build.log)"
    cat /tmp/backend-build.log
fi
cd ..

# Testar build do frontend
print_info "Testando build do frontend..."
cd frontend
if npm run build &> /tmp/frontend-build.log; then
    print_success "Build do frontend: OK"
else
    print_error "Build do frontend: FALHOU (veja /tmp/frontend-build.log)"
    cat /tmp/frontend-build.log
fi
cd ..

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  📄 Verificando Documentação"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Verificar guias de deploy
DOCS=(
    "COMECE_AQUI.md"
    "CHECKLIST_DEPLOY.md"
    "GUIA_DEPLOY_COMPLETO.md"
    ".env.production.example"
    "README.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        print_success "Documentação: $doc"
    else
        print_warning "Documentação ausente: $doc"
    fi
done

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🔐 Verificando Prisma"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Verificar schema do Prisma
if [ -f "backend/prisma/schema.prisma" ]; then
    print_success "Schema Prisma encontrado"
else
    print_error "Schema Prisma não encontrado"
fi

# Verificar se Prisma Client foi gerado
if [ -d "backend/node_modules/.prisma" ] || [ -d "backend/node_modules/@prisma/client" ]; then
    print_success "Prisma Client gerado"
else
    print_warning "Prisma Client não gerado (execute: cd backend && npx prisma generate)"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🔒 Verificando Git"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Verificar se é um repositório git
if [ -d ".git" ]; then
    print_success "Repositório Git inicializado"
    
    # Verificar remote
    if git remote -v | grep -q "origin"; then
        REMOTE_URL=$(git remote get-url origin)
        print_success "Remote configurado: $REMOTE_URL"
    else
        print_warning "Remote Git não configurado"
    fi
    
    # Verificar branch
    BRANCH=$(git branch --show-current)
    print_info "Branch atual: $BRANCH"
    
    # Verificar mudanças não commitadas
    if [ -z "$(git status --porcelain)" ]; then
        print_success "Working directory limpo (sem mudanças não commitadas)"
    else
        print_warning "Existem mudanças não commitadas"
    fi
else
    print_error "Não é um repositório Git"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  📊 RESUMO DA VALIDAÇÃO"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "  ${GREEN}✅ Sucessos: $SUCCESS${NC}"
echo -e "  ${YELLOW}⚠️  Avisos: $WARNINGS${NC}"
echo -e "  ${RED}❌ Erros: $ERRORS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "═══════════════════════════════════════════════════════════════"
    echo -e "${GREEN}  ✅ VALIDAÇÃO COMPLETA - PRONTO PARA DEPLOY!${NC}"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "Próximos passos:"
    echo "  1. Execute: ./scripts/prepare-deploy.sh"
    echo "  2. Ou siga: cat CHECKLIST_DEPLOY.md"
    echo ""
    exit 0
else
    echo "═══════════════════════════════════════════════════════════════"
    echo -e "${RED}  ❌ VALIDAÇÃO FALHOU - CORRIJA OS ERROS${NC}"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "Corrija os erros acima antes de fazer o deploy."
    echo ""
    exit 1
fi
