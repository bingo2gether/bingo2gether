Resumo do que eu criei automaticamente

- `backend/.env.production.example`
- `frontend/.env.production.example`
- `.github/workflows/ci.yml` — workflow que instala e faz build do frontend e backend em CI (rodar em GitHub Actions).

O que eu rodei localmente (próximo passo):
- `npm install` no root
- `npm run build` (builda frontend + backend)
- `npm run preview` em `frontend` para checar o build

Passos manuais que você precisa fazer (mínimos):
1) Criar repositório no GitHub e dar push do código (ou me peça para gerar um PR caso queira).
   - Comandos:
     git init
     git add .
     git commit -m "Prepare production: env examples + CI"
     git remote add origin https://github.com/YOUR_USER/bingo2gether.git
     git branch -M main
     git push -u origin main

2) Criar projeto no Supabase (ou outro Postgres) e copiar a `DATABASE_URL` para o Render environment.

3) Criar Web Service no Render (backend):
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Add environment variables (use `backend/.env.production.example` como referência)

4) Criar Project no Vercel (frontend):
   - Root Directory: `frontend`
   - Set `VITE_API_URL` para `https://<your-backend>/api`
   - Deploy

5) No Render, atualize `FRONTEND_URL` com a URL do Vercel e force um redeploy.

Verificações finais:
- `curl https://<your-backend>/health` deve retornar `{"status":"OK"}`
- Abra o frontend e verifique se as chamadas vão para `VITE_API_URL`

Se quiser eu posso:
- Tentar criar o repositório GitHub e fazer o primeiro push (preciso do token ou da URL remota que você deseja usar).
- Gerar templates de secrets/README mais detalhado.
