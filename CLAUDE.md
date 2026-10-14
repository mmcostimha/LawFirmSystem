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

## Estado atual (Dias 1–3 concluídos; Dia 4 em curso)
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

**Dia 4: testes + exceções** (issues #6 e #7)
- **#6 fechada** (PR #37): testes do `AlarmService` e do `fetchRecentSubjects`.
- **#7 em curso**, na branch `feat/excecoes-dominio` (PR ainda por abrir, vai com `Refs #7`). Já feito nesta branch:
  - `GlobalExceptionHandler` devolve `ProblemDetail` (RFC 9457) em todos os handlers, através de um helper `problem(status, title, detail)` com `timestamp`.
  - 404 `ResourceNotFound`, 409 `ConflictException` (nova), 409 `DataIntegrityViolationException` (a do Spring, `org.springframework.dao`), 500 genérico.
  - O 409 de integridade e o 500 têm `detail` **fixo**: a mensagem original só vai para o log (`warn` / `error`), para não expor SQL nem dados.
  - `UserRepository.existsByUsername` + `UserService.newUser` lança `ConflictException` **antes** do BCrypt.
  - Testes: `GlobalExceptionHandlerTest` (sem Spring, com `doesNotContain` a provar que não há fuga) e o caso do duplicado no `UserServiceTest` (`never().save`).

**Testes backend atuais:** `LawFirmApiApplicationTests`, `UserRepositoryTest`, `UserServiceTest`, `EmailClassifierTest`, `EmailSupervisorServiceTest`, `AlarmServiceTest`, `GlobalExceptionHandlerTest`.

**Pendentes fora do código:**
- ✅ Password da conta de e-mail exposta mudada e instância RDS antiga verificada (issue #1).
- ✅ Token do SonarQube exposto revogado.
- ✅ Secret Scanning e Push Protection ativos no GitHub.
- ✅ Issues de Security/Reliability de severidade alta exploradas no Sonar.

**Limpeza de Git:** os PRs foram integrados com *squash*, por isso o `git branch --merged` não os mostra. Podem ser apagadas a `docs/atualizar-claude-md` (local e remota, #36 integrado) e a `origin/fix/segredos-env` (#32). Há também um stash `!!GitHub_Desktop<main>`: rever com `git stash show -p` antes de descartar.

**Próximo: continuar a #7 na branch `feat/excecoes-dominio`**
Retomar com `git fetch`, `git switch feat/excecoes-dominio`, `git pull` e `.\mvnw.cmd test` (tem de estar verde antes de mexer).

*Ainda neste PR (formato e status de todos os erros):*
1. `MailboxAuthenticationException` → **422**: traduzir a `AuthenticationFailedException` no `ImapMailReader` (com `cause`) e tirar o `try/catch` do `EmailSupervisorController.emailValidator` (hoje devolve 403 vazio). Nota: o `fetchRecentSubjects` está testado (PR #37) para propagar a `AuthenticationFailedException`; esse teste tem de ser atualizado.
2. `UnsupportedMailProviderException` → **400**: em vez do `IllegalArgumentException("só Gmail")` no `ImapMailReader`.
3. Outras `MessagingException` do IMAP → **502** (servidor externo falhou), em vez de `RuntimeException` → 500.
4. `RuntimeException("Alarme não encontrado")` em `EmailSupervisorService.deleteEmailSupervisedById` → `ResourceNotFound` (404).
5. `GlobalExceptionHandler extends ResponseEntityExceptionHandler`: JSON inválido → 400, método errado → 405, etc., em `ProblemDetail`. Sem isto, o handler de `Exception` apanha-as primeiro e devolve 500.
6. Handler da `MethodArgumentTypeMismatchException` → 400 (ex.: `/supervisor/abc/X`).
7. Handler da `AuthenticationException` → **401**: hoje um login com a password errada dá 500, porque o `authenticate()` corre dentro do controller.
8. Testes para cada um, no `GlobalExceptionHandlerTest`, com valores distintos e `doesNotContain` quando a mensagem vem de uma biblioteca.
9. Abrir o PR com `Refs #7`.

*PR seguinte, `refactor/email-optional` (fecha a #7):*
- `EmailRepository.findByUser_Id` / `findByEmail` (e `UserRepository.findByEmail`) passam a devolver `Optional`.
- `EmailController.registerClientEmail` deixa de usar `try/catch (Exception)`: hoje o "não existe → criar" depende de um **NPE** no `changeClientEmail`.
- NPE → 404 em `GET /email/id/{id}`, `GET /email/username/{u}` (hoje um e-mail inválido devolve 200 com corpo vazio), `addToCheckList`, `turnOffAlarm` e `setValidEmail`.
- Teste que prove que um erro de BD **não** cria um e-mail novo.

*Fora da #7 (não misturar):*
- Services que devolvem `ResponseEntity` (`UserService`, `EmailService`, `TaskService`, `EmailSupervisorService`) → Dia 5 (#8).
- `RecoveryService.codeCreator` engole a `MessagingException` com `printStackTrace` → #17.
- `register` com `phone` < 3 caracteres ou `name` vazio → `StringIndexOutOfBounds` → `@Valid` no Dia 5 (#8).
- Colisão do username gerado no registo → já anotado na checklist da #17 (P3).
- Exceções nos filtros (`JwtAuthFilter`) não chegam ao `@ControllerAdvice` → #18, Dia 10.

**Decisões tomadas no Dia 4** (para não as reabrir):
- Exceções de domínio não conhecem HTTP; o mapeamento exceção → status fica só no `GlobalExceptionHandler`.
- `detail` com `ex.getMessage()` só para exceções **nossas**. As de biblioteca e as desconhecidas levam um texto fixo, e a mensagem vai para o log.
- Duplicados: `existsBy` para dar uma mensagem clara + o handler da `DataIntegrityViolationException` para a race condition (só o UNIQUE da BD é atómico).
- Duplicado = `log.warn` (comportamento normal); 500 = `log.error`.
- Credenciais IMAP do cliente inválidas = 422, não 403 (o 403 é para permissões do utilizador da API). O frontend só verifica `status === 200`, por isso não parte.

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

No Dia 1, o `contextLoads` falhava com `ConfigDataLocationNotFoundException: 'vault://'`. Foi corrigido no Dia 2 (#32), com a remoção da configuração do Vault dos testes. Nota: o `@ActiveProfiles("test")` **sobrepõe** o `application-test.properties` ao `application.properties`, não o substitui. Por isso, as propriedades que só existem no base (ex.: `spring.task2.scheduling.cron`) também ficam disponíveis nos testes.

## Comandos úteis
```powershell
# Testes + relatório de cobertura (dentro de LawFirmAPI)
.\mvnw.cmd test "-Dmaven.test.failure.ignore=true"
start target\site\jacoco\index.html

# SonarQube (com o Docker Desktop ligado; serviço no docker-compose.yml, profile quality)
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
- `gh`: instalar (`winget install --id GitHub.cli`) e fazer `gh auth login` em cada máquina.
- O histórico das conversas com o Claude e a memória dele são locais a cada PC. O contexto passa **só** por este ficheiro: atualizar a secção "Próximo" antes de mudar de PC.

**Mudar de PC:** no PC de saída, `git status` limpo e depois `git push`. No PC de chegada, `git fetch`, `git switch <branch>`, `git pull` e `.\mvnw.cmd test`. Nunca trabalhar na mesma branch em dois PCs sem fazer push/pull.
