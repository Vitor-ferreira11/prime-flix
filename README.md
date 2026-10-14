# Prime Flix

Projeto educacional em React que consulta filmes do TMDB, mostra detalhes e permite salvar favoritos no navegador. Inclui rotas de catálogo, detalhes, favoritos e página não encontrada.

## Configuração e execução

Use Node.js 22 e npm. Na raiz:

```
npm ci
```

Copie `.env.example` para `.env.local`, preencha `REACT_APP_TMDB_API_KEY` com sua chave TMDB e execute `npm start`. Reinicie o servidor ao mudar a configuração. O catálogo depende da internet e da disponibilidade do TMDB.

A chave anteriormente versionada deve ser revogada e substituída na conta TMDB. Variáveis de ambiente de frontend continuam visíveis no bundle; credenciais confidenciais exigem backend.

## Verificação

```
npm test -- --watchAll=false --runInBand
npm run build
```

Sete testes cobrem sucesso/falha da Home, favoritos com dados inválidos ou armazenamento bloqueado, gravação/leitura e respostas atrasadas na troca de filme. API e roteador são simulados; não validam a API real ou navegação integrada. O GitHub executa testes e build em PRs e mudanças em main.

## Estrutura

- `src/pages`: catálogo, detalhes, favoritos e página de erro.
- `src/services/api.js`: cliente TMDB com timeout e configuração centralizada.
- `src/services/favorites.js`: leitura e gravação tolerantes a falhas.
- `src/routes.js`: rotas da aplicação.

## Limitações

Favoritos usam a chave `@primeflix` no localStorage: pertencem ao navegador e não são sincronizados com contas. Dados inválidos são ignorados na leitura; falhas ao gravar são comunicadas ao usuário. Requisições são canceladas ao sair da página ou trocar de filme, e respostas antigas não substituem o filme atual.

O build usa roteamento de aplicação de página única. A hospedagem precisa direcionar rotas como `/filme/42` e `/favoritos` ao `index.html`. A validação local foi feita com pnpm; a verificação automática usa `npm ci` e preserva `package-lock.json`.
