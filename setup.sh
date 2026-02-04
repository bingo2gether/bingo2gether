#!/bin/bash
# Setup script para Bingo2Gether
# Uso: bash setup.sh

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           BINGO2GETHER - SETUP SCRIPT                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar Node.js
info "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    error "Node.js não encontrado. Instale em: https://nodejs.org/"
    exit 1
fi
success "Node.js $(node -v) encontrado"

# Verificar npm
info "Verificando npm..."
if ! command -v npm &> /dev/null; then
    error "npm não encontrado. Instale Node.js"
    exit 1
fi
success "npm $(npm -v) encontrado"

# Verificar Git
info "Verificando Git..."
if ! command -v git &> /dev/null; then
    warning "Git não encontrado. Instale em: https://git-scm.com/"
else
    success "Git $(git --version | awk '{print $3}') encontrado"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"

# Instalar dependências
echo ""
info "Instalando dependências..."

if [ ! -d "node_modules" ]; then
    info "Instalando dependências do root..."
    npm install
    success "Dependências do root instaladas"
else
    success "node_modules do root já existe"
fi

if [ ! -d "backend/node_modules" ]; then
    info "Instalando dependências do backend..."
    cd backend
    npm install
    cd ..
    success "Dependências do backend instaladas"
else
    success "node_modules do backend já existe"
fi

if [ ! -d "frontend/node_modules" ]; then
    info "Instalando dependências do frontend..."
    cd frontend
    npm install
    cd ..
    success "Dependências do frontend instaladas"
else
    success "node_modules do frontend já existe"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"

# Verificar arquivos .env
echo ""
info "Verificando arquivos .env..."

if [ ! -f "backend/.env" ]; then
    warning "backend/.env não encontrado"
    info "Criando a partir do .env.example..."
    cp backend/.env.example backend/.env
    success "backend/.env criado (edite com suas credenciais)"
else
    success "backend/.env encontrado"
fi

if [ ! -f "frontend/.env" ]; then
    warning "frontend/.env não encontrado"
    info "Criando a partir do .env.example..."
    cp frontend/.env.example frontend/.env
    success "frontend/.env criado"
else
    success "frontend/.env encontrado"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"

# Compilar backend
echo ""
info "Compilando TypeScript do backend..."
cd backend
npm run build
if [ $? -eq 0 ]; then
    cd ..
    success "Backend compilado com sucesso"
else
    cd ..
    error "Erro na compilação do backend"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════════"

# Exibir próximos passos
echo ""
echo -e "${GREEN}🎉 SETUP CONCLUÍDO COM SUCESSO!${NC}"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1️⃣  Edite as variáveis de ambiente:"
echo "   - backend/.env (edite suas credenciais)"
echo "   - frontend/.env (edite suas credenciais)"
echo ""
echo "2️⃣  Inicie a aplicação:"
echo "   ${BLUE}npm run dev${NC}"
echo ""
echo "3️⃣  Acesse no navegador:"
echo "   - Frontend: http://localhost:5173/"
echo "   - Backend: http://localhost:3001/api"
echo ""
echo "4️⃣  Para fazer deploy em produção:"
echo "   - Leia: DEPLOYMENT_PRODUCTION.md"
echo ""
echo "════════════════════════════════════════════════════════════════"
