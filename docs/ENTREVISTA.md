# Preparação para entrevistas

Perguntas técnicas treinadas ao longo do plano, com respostas curtas (30–60 s a falar) ligadas ao que foi feito neste projeto.
Em cada pergunta: a **resposta modelo**, os **erros comuns** e a **ligação ao projeto**, que serve de exemplo concreto.

**Como treinar:** tapar a resposta, responder em voz alta e só depois comparar.

---

## Git

### Porque é que o `.gitignore` não protegeu o `.env`?
**Resposta:** O `.gitignore` só impede que ficheiros **ainda não seguidos** entrem no Git. O `.env` foi commitado antes de estar no `.gitignore`, por isso continuou a ser seguido. Corrige-se com `git rm --cached .env`, que tira o ficheiro do índice sem o apagar do disco. Como o ficheiro esteve num repositório público, as credenciais têm de ser **rodadas**, porque o histórico continua a tê-las.

**Erros comuns:**
- Achar que apagar o ficheiro (ou adicioná-lo ao `.gitignore`) remove o segredo. O histórico mantém-no.
- Limpar o histórico (`git filter-repo`) sem rodar a credencial. Clones e caches já a podem ter copiado.

**No projeto:** os `.env` estavam seguidos desde o primeiro commit. Foram apagados no GitHub, mas continuavam recuperáveis com `git restore --source=<commit>`. Ver a issue #1.

---

## Base de dados / JPA

### O que é o problema N+1 e como o detetaste?
**Resposta:** É quando o ORM faz **1 query** para trazer uma lista e depois **mais 1 query por cada elemento**, para carregar dados relacionados. Detetei-o ativando as estatísticas do Hibernate (`hibernate.generate_statistics=true`): o endpoint de tarefas fazia **51 queries** num só pedido, para 100 tarefas de 50 clientes. O `show-sql` mostrava o mesmo `select ... where id=?` repetido 50 vezes. Corrige-se carregando tudo numa query, com `JOIN FETCH`, `@EntityGraph` ou uma projeção para DTO.

**Erros comuns:**
- Confundir com "número de pedidos à API". Foi **1 pedido HTTP**, que gerou 51 **queries à BD**.
- Pensar que N é sempre o nº de linhas. É o nº de entidades relacionadas **distintas**, porque a cache de primeiro nível do Hibernate não repete a mesma entidade dentro da sessão (100 tarefas, 50 clientes → 1 + 50).
- Resolver mudando tudo para `FetchType.EAGER`. Não elimina as queries extra e passa a carregar dados desnecessários em todo o lado.

**No projeto:** `GET /api/supervisor`, `/api/email/list` e `/api/task` faziam 51 queries cada (55–76 ms). Ver [AUDITORIA.md](AUDITORIA.md) e a issue #15.

### Diferença entre uma constraint `UNIQUE` na BD e um `existsBy` no service?
**Resposta:** O `existsBy` é uma verificação na **aplicação** e sofre de **race conditions** (*check-then-act*): dois pedidos simultâneos podem ambos verificar "não existe" e ambos gravar. A constraint `UNIQUE` é garantida pela **base de dados** de forma atómica, por isso é impossível gravar o duplicado, venha o pedido de onde vier. Uso a constraint como **fonte de verdade** e trato a violação (`DataIntegrityViolationException`) no `@ControllerAdvice`, devolvendo **409 Conflict**. O `existsBy` pode ficar como verificação prévia para dar uma mensagem mais clara, mas nunca como única proteção.

```
Pedido A: existsBy? → não ✓
Pedido B: existsBy? → não ✓   ← A ainda não gravou
Pedido A: save()   → grava
Pedido B: save()   → grava    ← duplicado
```

**Erros comuns:**
- Achar que o `existsBy` chega "porque os pedidos são rápidos". Basta um duplo clique ou um retry automático.
- Pôr a constraint sem tratar o erro, e o utilizador recebe um 500 genérico.

**No projeto:** a API aceitava o mesmo alarme duas vezes (2 linhas para `email_id = 1, tribunal`). Ver a issue #10 (Dia 6).

---

## Perguntas por preparar
- Java: diferença entre `HashMap` e `ConcurrentHashMap`. O que faz `@Transactional`? Como funcionam as Streams?
- Spring: injeção de dependências, ciclo de vida de um bean, como proteger um endpoint.
- React: porquê as dependências do `useEffect`? Quando usar `useMemo`? Como evitar re-renders?
- SQL: `INNER` vs `LEFT JOIN`, `WHERE` vs `HAVING`. O que é um índice e quando prejudica?
- Projeto: como garantiste que não há alertas duplicados? O que farias diferente?
- Geral: `git rebase` vs `merge`, o que é CI/CD, o que é Scrum.
