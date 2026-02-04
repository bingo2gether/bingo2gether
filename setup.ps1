# Setup script para Bingo2Gether (Windows PowerShell)
# Uso: .\setup.ps1

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           BINGO2GETHER - SETUP SCRIPT                          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "ℹ️  Verificando Node.js..." -ForegroundColor Blue
$node = & node -v 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js não encontrado. Instale em: https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $node encontrado" -ForegroundColor Green

# Verificar npm
Write-Host "ℹ️  Verificando npm..." -ForegroundColor Blue
$npm = & npm -v 2>$null
Write-Host "✅ npm $npm encontrado" -ForegroundColor Green

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray

# Instalar dependências
Write-Host ""
Write-Host "ℹ️  Instalando dependências..." -ForegroundColor Blue

if (!(Test-Path "node_modules")) {
    Write-Host "ℹ️  Instalando dependências do root..." -ForegroundColor Blue
    npm install
    Write-Host "✅ Dependências do root instaladas" -ForegroundColor Green
} else {
    Write-Host "✅ node_modules do root já existe" -ForegroundColor Green
}

if (!(Test-Path "backend/node_modules")) {
    Write-Host "ℹ️  Instalando dependências do backend..." -ForegroundColor Blue
    cd backend
    npm install
    cd ..
    Write-Host "✅ Dependências do backend instaladas" -ForegroundColor Green
} else {
    Write-Host "✅ node_modules do backend já existe" -ForegroundColor Green
}

if (!(Test-Path "frontend/node_modules")) {
    Write-Host "ℹ️  Instalando dependências do frontend..." -ForegroundColor Blue
    cd frontend
    npm install
    cd ..
    Write-Host "✅ Dependências do frontend instaladas" -ForegroundColor Green
} else {
    Write-Host "✅ node_modules do frontend já existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray

# Verificar arquivos .env
Write-Host ""
Write-Host "ℹ️  Verificando arquivos .env..." -ForegroundColor Blue

if (!(Test-Path "backend/.env")) {
    Write-Host "⚠️  backend/.env não encontrado" -ForegroundColor Yellow
    Write-Host "ℹ️  Criando a partir do .env.example..." -ForegroundColor Blue
    Copy-Item "backend/.env.example" "backend/.env"
    Write-Host "✅ backend/.env criado (edite com suas credenciais)" -ForegroundColor Green
} else {
    Write-Host "✅ backend/.env encontrado" -ForegroundColor Green
}

if (!(Test-Path "frontend/.env")) {
    Write-Host "⚠️  frontend/.env não encontrado" -ForegroundColor Yellow
    Write-Host "ℹ️  Criando a partir do .env.example..." -ForegroundColor Blue
    Copy-Item "frontend/.env.example" "frontend/.env"
    Write-Host "✅ frontend/.env criado" -ForegroundColor Green
} else {
    Write-Host "✅ frontend/.env encontrado" -ForegroundColor Green
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray

# Compilar backend
Write-Host ""
Write-Host "ℹ️  Compilando TypeScript do backend..." -ForegroundColor Blue
cd backend
npm run build
if ($LASTEXITCODE -eq 0) {
    cd ..
    Write-Host "✅ Backend compilado com sucesso" -ForegroundColor Green
} else {
    cd ..
    Write-Host "❌ Erro na compilação do backend" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray

# Exibir próximos passos
Write-Host ""
Write-Host "🎉 SETUP CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor White
Write-Host ""
Write-Host "1️⃣  Edite as variáveis de ambiente:" -ForegroundColor White
Write-Host "   - backend/.env (edite suas credenciais)" -ForegroundColor White
Write-Host "   - frontend/.env (edite suas credenciais)" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  Inicie a aplicação:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "3️⃣  Acesse no navegador:" -ForegroundColor White
Write-Host "   - Frontend: http://localhost:5173/" -ForegroundColor Cyan
Write-Host "   - Backend: http://localhost:3001/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "4️⃣  Para fazer deploy em produção:" -ForegroundColor White
Write-Host "   - Leia: DEPLOYMENT_PRODUCTION.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Gray
