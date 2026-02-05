# 🚀 Deploy em 45 Minutos - Instruções Rápidas

## Opção 1: Script Automatizado (MAIS RÁPIDO)

Execute um único comando para preparar tudo:

```bash
bash scripts/quick-deploy.sh
```

Este script irá:
- ✅ Validar seu projeto
- ✅ Gerar secrets de segurança (JWT_SECRET, SESSION_SECRET)
- ✅ Criar arquivo com todas as configurações necessárias
- ✅ Guiá-lo através do processo

## Opção 2: Passo a Passo Manual

### 1. Validar Projeto

```bash
bash scripts/validate-deploy.sh
```

Verifica se tudo está pronto para deploy.

### 2. Gerar Configurações

```bash
bash scripts/prepare-deploy.sh
```

Gera secrets e cria arquivo `deploy-config.txt` com todas as configurações.

### 3. Seguir Guia de Deploy

```bash
cat CHECKLIST_DEPLOY.md
```

Siga os 5 passos no checklist.

## Opção 3: Ler Documentação

```bash
cat COMECE_AQUI.md
```

Veja todas as opções de deploy disponíveis.

---

## 📁 Arquivos Criados

Após executar os scripts, você terá:

- **deploy-config.txt** - Todas as configurações e secrets gerados
  - ⚠️ Este arquivo NÃO deve ser commitado (já está no .gitignore)
  - Contém JWT_SECRET e SESSION_SECRET prontos para usar
  - Tem checklist de deploy integrado

---

## 🎯 Próximos Passos

1. Execute: `bash scripts/quick-deploy.sh`
2. Siga as instruções na tela
3. Em 45 minutos, seu app estará online! 🎉

---

## 🆘 Problemas?

- Ver logs completos dos builds em `/tmp/backend-build.log` e `/tmp/frontend-build.log`
- Consultar `GUIA_DEPLOY_COMPLETO.md` para troubleshooting
- Verificar `CHECKLIST_DEPLOY.md` para passo a passo detalhado

---

**Data:** 5 de Fevereiro de 2026  
**Status:** ✅ Scripts prontos para uso
