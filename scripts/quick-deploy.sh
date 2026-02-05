#!/bin/bash

# ============================================================================
# Bingo2Gether - Quick Deploy Starter
# ============================================================================
# Script rápido para iniciar o processo de deploy em 45 minutos
# ============================================================================

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║           🚀 DEPLOY EM 45 MINUTOS - BINGO2GETHER 🚀          ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${CYAN}Bem-vindo ao assistente de deploy!${NC}"
echo ""
echo "Este script irá:"
echo "  ✓ Validar seu projeto"
echo "  ✓ Gerar configurações necessárias"
echo "  ✓ Guiá-lo pelo processo de deploy"
echo ""
echo -e "${YELLOW}Pressione ENTER para começar...${NC}"
read

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🔍 PASSO 1: Validando Projeto"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Executar validação
if [ -f "./scripts/validate-deploy.sh" ]; then
    chmod +x ./scripts/validate-deploy.sh
    if ./scripts/validate-deploy.sh; then
        echo ""
        echo -e "${GREEN}✅ Validação aprovada!${NC}"
    else
        echo ""
        echo -e "${YELLOW}⚠️  Validação encontrou problemas. Corrija-os e tente novamente.${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Script de validação não encontrado. Continuando...${NC}"
fi

echo ""
echo -e "${YELLOW}Pressione ENTER para continuar...${NC}"
read

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🔧 PASSO 2: Gerando Configurações"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Executar preparação
if [ -f "./scripts/prepare-deploy.sh" ]; then
    chmod +x ./scripts/prepare-deploy.sh
    ./scripts/prepare-deploy.sh
else
    echo -e "${YELLOW}⚠️  Script de preparação não encontrado.${NC}"
fi

echo ""
echo -e "${YELLOW}Pressione ENTER para ver o guia de deploy...${NC}"
read

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  📋 PASSO 3: Guia de Deploy"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Escolha qual guia seguir:"
echo ""
echo "  1) Checklist Rápido (45 min) - RECOMENDADO"
echo "  2) Guia Completo (1-2h)"
echo "  3) Ver configurações geradas (deploy-config.txt)"
echo "  4) Sair"
echo ""
echo -n "Digite sua escolha [1-4]: "
read choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}Abrindo CHECKLIST_DEPLOY.md...${NC}"
        echo ""
        cat CHECKLIST_DEPLOY.md
        ;;
    2)
        echo ""
        echo -e "${BLUE}Abrindo GUIA_DEPLOY_COMPLETO.md...${NC}"
        echo ""
        cat GUIA_DEPLOY_COMPLETO.md | head -100
        echo ""
        echo -e "${CYAN}(Use 'cat GUIA_DEPLOY_COMPLETO.md' para ver o guia completo)${NC}"
        ;;
    3)
        echo ""
        if [ -f "deploy-config.txt" ]; then
            echo -e "${BLUE}Suas configurações de deploy:${NC}"
            echo ""
            cat deploy-config.txt
        else
            echo -e "${YELLOW}Arquivo deploy-config.txt não encontrado.${NC}"
            echo "Execute: ./scripts/prepare-deploy.sh"
        fi
        ;;
    4)
        echo ""
        echo "Até logo!"
        exit 0
        ;;
    *)
        echo ""
        echo -e "${YELLOW}Opção inválida. Execute o script novamente.${NC}"
        exit 1
        ;;
esac

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}  ✅ Tudo pronto! Siga o guia acima para fazer o deploy.${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Recursos úteis:"
echo "  - Configurações: cat deploy-config.txt"
echo "  - Checklist rápido: cat CHECKLIST_DEPLOY.md"
echo "  - Guia completo: cat GUIA_DEPLOY_COMPLETO.md"
echo ""
echo -e "${CYAN}Boa sorte com o deploy! 🚀${NC}"
echo ""
