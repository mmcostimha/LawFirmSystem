# Auditoria inicial (Dia 1)

Diagnóstico do projeto **antes** de qualquer melhoria: o estado do código, os problemas encontrados por prioridade e as métricas de partida.
A coluna "Depois" da tabela de métricas é preenchida no Dia 15.

- Data da auditoria: 3–6 Out 2026
- Estado medido: `main` em `de9091f` (antes dos PRs #28 e #29), salvo indicação em contrário
- Plano de trabalho: [Kanban](https://github.com/users/mmcostimha/projects/1), issues #1–#27

## 1. Checklist

| Pergunta | Resposta | Detalhe |
|---|---|---|
| Há testes? | ❌ **Praticamente não** | O backend tinha 1 teste (`contextLoads`), que nem arranca por causa de um conflito de configuração do Vault. O frontend não tem testes nem script de teste. O Dockerfile do backend compila com `-DskipTests`. |
| Credenciais fora do código? | ❌ **Não** | 8 segredos escritos em ficheiros versionados (compose, properties). Os `.env` estiveram no Git e foram apagados, mas continuam no histórico de um repositório público. |
| O polling trata falhas? | ❌ **Não** | Uma caixa de correio que falhe aborta a verificação de todas as outras: o `catch` volta a lançar a exceção e um provedor não suportado lança antes do `try`. Não há retry, não há `finally` (as ligações IMAP ficam abertas), os logs são `System.out`, o `@Async` não está aplicado e nada impede o cron e a verificação manual de correrem ao mesmo tempo. |
| Duplicados? | ⚠️ **Parcialmente** | Há UNIQUE em `users.username` e `emails.email`. **Não há** em `users.email` nem em `email_supervised(email_id, type)`: a API aceita o mesmo alarme duas vezes (confirmado no benchmark). Bug: `activationDate` tem `updatable = false` e nunca é gravado. |

## 2. Problemas priorizados

Prioridade = impacto × probabilidade. Cada problema tem uma issue no Kanban.

### P0 — Segurança (crítico)
| # | Problema | Issue |
|---|---|---|
| 1 | Credenciais no histórico do Git de um repositório público (e-mail, BD antiga na AWS) | #1 |
| 2 | Segredos escritos no compose e nos properties | #2 |
| 3 | O fluxo de recuperação de password não valida o código de recuperação | #17 |
| 4 | O registo público permite escolher o papel `admin` | #17 |
| 5 | Credenciais das caixas de correio em texto simples na BD; entidades com campos sensíveis devolvidas pela API | #8, #19 |
| 6 | O frontend guarda a password no `localStorage` | #21 |
| 7 | Actuator totalmente exposto (`include=*`, `show-details=always`) | #18 |

### P1 — Fiabilidade (alto)
| # | Problema | Issue |
|---|---|---|
| 8 | Polling frágil: sem isolamento de falhas, retry, `finally`, logger nem lock | #11 |
| 9 | `activationDate` dos alarmes nunca é gravado | #11 |
| 10 | Chave JWT gerada aleatoriamente no arranque: cada restart invalida todas as sessões | #18 |
| 11 | O endpoint de criar/alterar e-mail usa uma exceção como controlo de fluxo | #7 |
| 12 | Sem migrações: o schema vem do `ddl-auto=update` | #10 |

### P2 — Qualidade e performance (médio)
| # | Problema | Issue |
|---|---|---|
| 13 | Queries N+1 nas listas de alarmes, e-mails e tarefas (51 queries por pedido) | #15 |
| 14 | Código duplicado (verificação de e-mails 2×, lógica IMAP 2×, mapeamento de DTO 2×, `TaskCompleteDTO` 3×, `@CrossOrigin` em todos os controllers) | #4 |
| 15 | Faltam constraints UNIQUE (`users.email`, `email_supervised(email_id, type)`) | #10 |
| 16 | Pasta `postgres_data/` commitada | #3 |

### P3 — Baixo
| # | Problema | Issue |
|---|---|---|
| 17 | README desatualizado (portas, variáveis, hostname) | #24 |
| 18 | O frontend em Docker corre o servidor de desenvolvimento (`npm run dev`) | #24 |
| 19 | Mistura de JUnit 4 e JUnit 5 no `pom.xml` | #13 |

## 3. Métricas

| Métrica | Antes (Dia 1) | Depois (Dia 15) |
|---|---|---|
| Testes backend | **1**, que falha (`contextLoads`) | |
| Cobertura backend: linhas | **0%** (0/626) | |
| Cobertura backend: branches | **0%** (0/80) | |
| Testes frontend | **0** | |
| Sonar: Security | **3 issues, nota D** | |
| Sonar: Reliability | **12 issues, nota D** | |
| Sonar: Maintainability (code smells) | **125 issues, nota A** | |
| Sonar: Duplications | **0,0%** (em 2,3k linhas) | |
| ESLint frontend | **43 problemas** (39 errors, 4 warnings) | |
| Segredos em ficheiros versionados | **8** | |
| Alarmes duplicados aceites pela API | **Sim** (o mesmo alarme criado 2× → 2 linhas) | |
| `GET /api/supervisor`: tempo médio / nº de queries | **75,9 ms / 51** | |
| `GET /api/email/list`: tempo médio / nº de queries | **55,1 ms / 51** | |
| `GET /api/task`: tempo médio / nº de queries | **63,9 ms / 51** | |

### Como foram medidas
- **Cobertura:** JaCoCo (`.\mvnw.cmd test`). Depois do PR #28 (testes iniciais), a cobertura passa para 9,9% de linhas e 2,5% de branches, com 8 testes (7 ✅, 1 ❌). Essa já é a primeira melhoria e não conta como "antes".
- **Sonar:** SonarQube Community 26.9, separador *Overall Code*. Ver [QUALIDADE.md](QUALIDADE.md).
- **ESLint:** `npm run lint` em `LawFirmWebApp`.
- **Segredos:** pesquisa manual nos ficheiros versionados:
  - compose: 4;
  - `application-test.properties`: 2;
  - linhas comentadas no `application.properties`: 2.
- **Endpoints e duplicados:** procedimento de [scripts/benchmark](../scripts/benchmark/README.md).
  - Dados: 50 clientes, 50 caixas de correio, 100 alarmes e 100 tarefas, numa BD separada.
  - Tempo: média de 5 pedidos depois de 1 de aquecimento, no mesmo PC.
  - Queries: contadas com as estatísticas do Hibernate.

### Notas de interpretação
- **51 queries = 1 + 50.** Uma query traz a lista e depois é feita **uma query por cliente distinto** (50), não por linha. Os 101 alarmes pertencem a 50 clientes, e a cache de primeiro nível do Hibernate evita repetir o mesmo cliente dentro do pedido. Com 500 clientes seriam ~501 queries: o custo cresce com os dados. Uma única query com `JOIN` resolve o pedido inteiro.
- **+2 queries em cada pedido autenticado:** o filtro JWT vai buscar o utilizador à BD em cada pedido, e a relação `OneToOne` *eager* com `Email` acrescenta uma segunda query.
- **Duplications a 0% no Sonar** não significa ausência de duplicação. O Sonar só deteta blocos idênticos (~10 instruções seguidas ou mais), e os duplicados encontrados são "quase iguais".
- **Nota A em Maintainability** mede a dívida técnica relativa ao tamanho do código, não o número de smells.
- **ESLint:** 33 dos 43 problemas são variáveis ou imports não usados. Alguns escondem bugs: um `handleSubmit` nunca usado no registo, um estado de erro nunca mostrado ao utilizador e `useEffect` sem dependências (*stale closure*).

## 4. Ações imediatas (fora do código)
- [ ] Mudar a password da conta de e-mail exposta no histórico (#1)
- [ ] Verificar se a instância RDS antiga ainda existe; se sim, apagá-la ou rodar a password (#1)
- [ ] Revogar o token do SonarQube que ficou exposto
- [ ] Ativar o *Secret Scanning* e o *Push Protection* do GitHub (*Settings → Code security*)
