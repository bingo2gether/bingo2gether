#!/bin/bash

# ============================================================================
# DEPLOY EM 45 MINUTOS - BINGO2GETHER
# ============================================================================
# Execute este script para começar o deploy
# ============================================================================

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

clear
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║           🚀 DEPLOY EM 45 MINUTOS - BINGO2GETHER 🚀          ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Preparando seu projeto para deploy..."
echo ""

# Executar script de preparação
if [ -f "scripts/prepare-deploy.sh" ]; then
    bash scripts/prepare-deploy.sh
    
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "✅ Configurações geradas com sucesso!"
    echo ""
    echo "📖 Próximos passos:"
    echo ""
    echo "   1. Abra as configurações:"
    echo "      cat deploy-config.txt"
    echo ""
    echo "   2. Siga o checklist rápido:"
    echo "      cat CHECKLIST_DEPLOY.md"
    echo ""
    echo "   3. Em 45 minutos, seu app estará no ar! 🎉"
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo ""
else
    echo "❌ Erro: Script de preparação não encontrado"
    echo "   Procurado em: $SCRIPT_DIR/scripts/prepare-deploy.sh"
    exit 1
fi
