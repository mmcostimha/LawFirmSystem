# CLAUDE.md

Contexto para o Claude Code (e para mim) continuar o trabalho em qualquer PC.

## Como trabalhar neste projeto
- Responder em **português (PT-PT)**.
- **Modo estudo:** o Claude explica o conceito (com uma nota curta "📚 Estudo") e dá os comandos ou o código. **Eu executo e interpreto.** O Claude só intervém quando fico preso e não corrige código em silêncio. Tarefas mecânicas (ex.: criar issues com `gh`) só depois de eu confirmar.
- **Git:**
  - uma branch e um PR por melhoria;
  - **nunca commitar diretamente na `main`**;
  - mensagens no formato `tipo: descrição` (`feat`, `fix`, `test`, `chore`, `docs`, `refactor`).
- Se uma tarefa for fácil, aprofundar em vez de avançar. Se houver atraso, cortar extras, **nunca testes**.
- O repositório é **público**: nada de passwords, tokens ou detalhes que facilitem explorar vulnerabilidades em ficheiros commitados.

## Stack
- `LawFirmAPI/`: Spring Boot 3.5.6, Java 17, Maven Wrapper, JPA/Hibernate (`ddl-auto=update`, sem migrações), Spring Security + JWT (jjwt 0.11.5), jakarta.mail (polling IMAP).
- `LawFirmWebApp/`: React 19 + Vite 7 (JavaScript, sem testes).
- `docker-compose.yml`: nginx (80), db/Postgres 15 (5432), pgadmin (profile `debug`, 5050), backend (8080), frontend.

## Plano de estudo de 15 dias (3–17 Out)
| Dia | Foco | Entregável |
|---|---|---|
| 1 | Setup e auditoria | Lista de problemas priorizada + métricas "antes" |
| 2 | Segredos em `.env`/variáveis de ambiente, Docker com Postgres, OOP/SOLID | Projeto arranca sem segredos no código |
| 3 | Collections/Streams; fluxo de e-mail em camadas; extrair classificador | Classificador isolado e testável |
| 4 | JUnit + Mockito; exceções custom + `@ControllerAdvice` | Primeiros testes verdes + erros globais |
| 5 | DTOs, `@Valid`, códigos HTTP, paginação, Postman | API limpa |
| 6 | Flyway + UNIQUE, regras na BD, retry IMAP, SLF4J | Polling resiliente, sem alertas duplicados |
| 7 | Testcontainers, GreenMail, `@WebMvcTest` | Teste ponta a ponta e-mail → alerta |
| 8 | SQL: JOIN, GROUP BY/HAVING, CTEs | `queries.sql` comentado |
| 9 | Window functions, índices, EXPLAIN ANALYZE | Relatório + tempos antes/depois |
| 10 | Roles, `@PreAuthorize`, JWT, BCrypt, CORS, encriptação, auditoria | Acessos por papel |
| 11 | TypeScript e hooks | Frontend tipado |
| 12 | Hook de polling/WebSocket, estados de UI, dashboard | Alertas em tempo real |
| 13 | Vitest + React Testing Library; compose completo; README | `docker compose up` do zero |
| 14 | GitHub Actions, rebase/conflitos, Scrum, Azure | CI verde |
| 15 | Métricas "depois", pitch de 2 min, perguntas de entrevista | Portefólio pronto |

Kanban: https://github.com/users/mmcostimha/projects/1 (issues #1–#27, com labels `P0`–`P3` e `dia-N`). A #27 é o card do Dia 1.

## Estado atual (Dias 1–3 concluídos)
> Atualizar esta secção no fim de cada dia, no PR desse dia.

**Dia 1: auditoria** (PRs #28–#31)
- Auditoria completa em [`docs/AUDITORIA.md`](docs/AUDITORIA.md): checklist, problemas priorizados, métricas "antes".
- Kanban: 27 issues.
- Testes iniciais (#28); JaCoCo + SonarQube + [`docs/QUALIDADE.md`](docs/QUALIDADE.md) (#29).
- Benchmark repetível em [`scripts/benchmark/`](scripts/benchmark/README.md) (seed, medição e procedimento).
- Perguntas de entrevista do Dia 1 (#31).

**Dia 2: segredos** (PR #32, fecha a #2, refs #3)
- O compose e os properties usam `${VAR}`. Há um `.env.example` na raiz e outro em `LawFirmAPI/`.
- Removida a configuração do Vault nos testes, o que corrige o `contextLoads`.
- `.dockerignore` para o `.env` não entrar na imagem.
- BD, pgAdmin e Sonar só em `127.0.0.1`; portas configuráveis.
- `postgres_data/` removida do repo (os dados ficam no volume nomeado). `target/` e `.idea/` passam a ser ignorados.

**Dia 3: fluxo de e-mail em camadas** (PRs #33–#35)
- `EmailClassifier`: classe pura com testes unitários (`EmailClassifierTest`). Também passa a aceitar endereços Gmail com maiúsculas.
- `ImapMailReader` + record `MailMessage`: lógica IMAP numa só classe, com `try-with-resources` no `Store`.
- `EmailSupervisorService.runCheck()` (`@Scheduled`, `spring.task2.scheduling.cron`) é o orquestrador: lê, classifica e chama o `AlarmService`. Uma falha numa caixa é registada com SLF4J e não aborta as restantes. Testado em `EmailSupervisorServiceTest` (Mockito).
- `AsyncSupervisorService` removido.

**Testes backend atuais:** `LawFirmApiApplicationTests`, `UserRepositoryTest`, `UserServiceTest`, `EmailClassifierTest`, `EmailSupervisorServiceTest`.

**Pendentes fora do código:**
- ✅ Password da conta de e-mail exposta mudada e instância RDS antiga verificada (issue #1).
- ✅ Token do SonarQube exposto revogado.
- ✅ Secret Scanning e Push Protection ativos no GitHub.
- ✅ Issues de Security/Reliability de severidade alta exploradas no Sonar.

**Limpeza de Git:** os PRs foram integrados com *squash*, por isso o `git branch --merged` não os mostra. As branches `docs/auditoria-dia1`, `chore/ferramentas-qualidade` e `origin/fix/segredos-env` já estão na `main` e podem ser apagadas. Há também um stash `!!GitHub_Desktop<main>`: rever com `git stash show -p` antes de descartar.

**Próximo: Dia 4.** JUnit + Mockito, exceções custom e `@ControllerAdvice`. Entregável: mais testes verdes e erros tratados globalmente.
- Pontos de partida: em `deleteEmailSupervisedById` há um `RuntimeException("Alarme não encontrado")` a substituir por uma exceção custom. Há também services que devolvem `ResponseEntity`, o que deve ficar só no controller.
- Confirmar que o `application-test.properties` tem `spring.task2.scheduling.cron`. Neste momento só tem `task` e `task1`, e o placeholder em falta pode partir o `contextLoads`.

## Checklist de auditoria (resultado)
| Pergunta | Resposta |
|---|---|
| Há testes? | **Muito poucos.** 3 ficheiros no backend (`contextLoads`, 1 teste de repositório, testes Mockito do `UserService`), 0 no frontend. O Dockerfile do backend usa `-DskipTests`. |
| Credenciais fora do código? | **Não.** Os `.env` estiveram rastreados no Git (já foram apagados, mas continuam no histórico). O `docker-compose.yml` e o `application-test.properties` têm credenciais fixas. Há uma credencial antiga de RDS comentada no `application.properties`. |
| O polling trata falhas? | **Não.** Uma caixa de correio que falhe aborta as restantes (o catch volta a lançar a exceção). Não há retry nem `finally` (as ligações ficam abertas). Só há `System.out`. O `@Async` não está aplicado. Nada impede o cron e o check manual de correrem ao mesmo tempo. |
| Duplicados? | **Parcial.** Há UNIQUE em `username` e `Email.email`, mas não em `User.email` nem em `EmailSupervised(email, type)`. Não há `existsBy`. Bug: `EmailSupervised.activationDate` tem `updatable=false`, por isso nunca é gravado. |

## Problemas priorizados
**P0 — Segurança**
1. Credenciais no histórico do Git (repo público) → rodar passwords.
2. O fluxo de recuperação de password não valida o código de recuperação.
3. O registo público permite escolher papéis privilegiados.
4. As credenciais das caixas de correio dos clientes estão em texto simples e há entidades com campos sensíveis serializadas nas respostas.
5. O frontend guarda a password no `localStorage`.
6. O Actuator está totalmente exposto.

**P1 — Fiabilidade**
7. Polling frágil: sem isolamento de falhas, retry, `finally`, logger nem lock.
8. Bug do `activationDate`.
9. A chave JWT é gerada aleatoriamente no arranque: cada restart invalida todas as sessões.
10. O endpoint de criar/alterar e-mail usa uma exceção como controlo de fluxo.
11. Sem migrações (`ddl-auto=update`).

**P2 — Qualidade e performance**
12. Queries N+1 nas listas de alarmes, e-mails e tarefas.
13. Código duplicado:
    - `checkEmails` ≈ `forcedCheckEmails`;
    - lógica IMAP 2×;
    - mapeamento de DTO 2×;
    - `TaskCompleteDTO` 3×;
    - `BCryptPasswordEncoder` instanciado em vez de injetado;
    - `@CrossOrigin` em todos os controllers.
14. Faltam constraints UNIQUE (`User.email`, `EmailSupervised(email, type)`).
15. Pasta `postgres_data/` commitada.

**P3 — Baixo**
16. README desatualizado (portas, variáveis, hostname).
17. O frontend em Docker corre `npm run dev`.
18. Mistura de JUnit 4 e 5 no `pom.xml`.

## Métricas "antes" vs "depois"
| Métrica | Antes (Dia 1) | Depois (Dia 15) |
|---|---|---|
| Cobertura backend: linhas | **0%** na `main` (0/626). Com os testes iniciais: 9,9% (62/627) | |
| Cobertura backend: branches | **0%** na `main` (0/80). Com os testes iniciais: 2,5% (2/80) | |
| Testes backend | **1** na `main`, que falha (`contextLoads`). Com os testes iniciais: 8 (7 ✅, 1 ❌) | |
| Testes frontend | **0** | |
| Sonar: Security | **3 issues, nota D** | |
| Sonar: Reliability | **12 issues, nota D** | |
| Sonar: Maintainability (code smells) | **125 issues, nota A** | |
| Sonar: Duplications | **0,0%** (em 2,3k linhas) | |
| ESLint frontend | **43 problemas** (39 errors, 4 warnings) | |
| `GET /api/supervisor`: tempo / nº de queries | **75,9 ms / 51** | |
| `GET /api/email/list`: tempo / nº de queries | **55,1 ms / 51** | |
| `GET /api/task`: tempo / nº de queries | **63,9 ms / 51** | |
| Segredos em ficheiros versionados | **8** | |
| Alertas duplicados | **Aceites** (o mesmo alarme 2× → 2 linhas) | |

**Notas sobre as métricas:**
- **Cobertura:** o "antes" real é o da `main` (0%). Os 9,9% já incluem a primeira melhoria (os testes iniciais).
- **Sonar Duplications a 0%:** o Sonar só deteta blocos idênticos com cerca de 10 instruções ou mais. Os duplicados encontrados na auditoria são "quase iguais" e não são apanhados.
- **Security Hotspots:** nesta versão do Sonar (26.9) estão marcados como *Deprecated* e integrados nas issues de Security.
- **Nota A em Maintainability:** mede a dívida técnica relativa ao tamanho do código, não o número de smells.
- **ESLint** (43 problemas):
  - `no-unused-vars`: 33;
  - `react-hooks/exhaustive-deps`: 4;
  - `no-case-declarations`: 4 (em `formValidation.jsx`);
  - `react-refresh/only-export-components`: 2 (contexts).
- **Possíveis bugs que o ESLint revelou:**
  - `handleSubmit` nunca usado em `RegisterFormComponent.jsx`;
  - estado `error` nunca mostrado no login nem no registo;
  - `use` importado por engano em 5 ficheiros;
  - `useEffect` sem `token` nas dependências, o que dá *stale closure*.

O `contextLoads` falha com `ConfigDataLocationNotFoundException: 'vault://'`. O `application-test.properties` tem `spring.cloud.vault.enabled=false` e, ao mesmo tempo, `spring.config.import=vault://`. Possível correção: `optional:vault://` ou remover a linha.

## Comandos úteis
```powershell
# Testes + relatório de cobertura (dentro de LawFirmAPI)
.\mvnw.cmd test "-Dmaven.test.failure.ignore=true"
start target\site\jacoco\index.html

# SonarQube (com o Docker Desktop ligado; o serviço está no compose da branch chore/ferramentas-qualidade)
docker compose --profile quality up -d sonarqube
$env:SONAR_TOKEN = "<token>"
.\mvnw.cmd clean verify org.sonarsource.scanner.maven:sonar-maven-plugin:sonar "-Dmaven.test.failure.ignore=true" "-Dsonar.projectKey=LawFirmAPI" "-Dsonar.host.url=http://localhost:9000"

# Lint do frontend (dentro de LawFirmWebApp)
npm run lint

# Kanban
gh issue list --label P0
gh project view 1 --owner mmcostimha --web
# Mover card: project-id PVT_kwHOCdgd7M4Blmow · campo Status PVTSSF_lAHOCdgd7M4BlmowzhkS1d0
# opções: Todo f75ad846 · In Progress 47fc9ee4 · Done 98236657
# gh project item-edit --id <item-id> --project-id <project-id> --field-id <campo> --single-select-option-id <opção>
```

## O que NÃO está no Git (copiar à mão entre PCs)
- `.env` (raiz) e `LawFirmAPI/.env`: segredos.
- `plano_15_dias.pdf`: plano original.
- Token do SonarQube: gerar um novo em cada máquina.
