# Benchmark dos endpoints principais

Mede o **tempo de resposta** e o **número de queries por pedido** dos endpoints de listagem, com um volume de dados fixo e repetível. Também verifica se a API aceita **alarmes duplicados**.

O procedimento serve para comparar o **antes** (Dia 1) com o **depois** (Dia 9, depois de corrigir o N+1 e criar índices). As duas medições têm de usar exatamente os mesmos passos e os mesmos dados.

## Ficheiros

| Ficheiro | O que faz |
|---|---|
| [`seed.sql`](seed.sql) | Cria 50 clientes, 50 caixas de correio (1 por cliente) e 100 tarefas (2 por cliente) com `generate_series` |
| [`medir-endpoints.ps1`](medir-endpoints.ps1) | Com `-CriarAlarmes`: cria 2 alarmes por cliente (`tribunal`, `financas`) pela API. Sem esse parâmetro: mede os endpoints (1 pedido de aquecimento + média de N) |

## O que significam os dados criados

| Tabela | Representa | Volume |
|---|---|---|
| `users` (role `client`) | Clientes do escritório | 50 |
| `emails` | Caixa de correio de um cliente (endereço, password e flag `alarm`) | 50 |
| `email_supervised` | Regra de vigilância: "avisar se a caixa X receber algo do tipo Y" | 100 |
| `tasks` | Tarefas do dashboard, por cliente | 100 |

O volume serve para tornar o N+1 visível: com 2 ou 3 registos, a diferença entre 1 query e N+1 queries não se nota.

### Segurança dos dados de teste
- **Base de dados separada (`lawfirm_bench`):** os dados reais (`lawfirm_db`) não são tocados e a limpeza é um `DROP DATABASE`.
- **Endereços `@exemplo.test`:** o domínio `.test` está reservado (RFC 2606) e não existe na Internet. O polling também só aceita endereços com `gmail` ou `sapo`, por isso lança `Provedor não suportado` antes de qualquer ligação IMAP. Nenhuma ligação externa é feita e nenhum e-mail é enviado.
- **Erro esperado no log:** se o backend ficar ligado até uma hora par, o cron (`0 0 */2 * * *`) corre e falha na primeira regra. É esperado, e mostra um problema da auditoria: uma caixa inválida aborta a verificação de todas as outras.
- **Não chamar `POST /api/supervisor/check`** durante o benchmark: dá o mesmo erro, como resposta 500.
- **Dados sintéticos:** nunca se testa com dados reais de clientes (RGPD).

## Pré-requisitos
- Docker Desktop ligado ("Engine running").
- `LawFirmAPI/.env` com `DB_URL`, `DB_USER` e `DB_PASSWORD`. O `DB_URL` é substituído no arranque (ver o passo 2).

## Procedimento
Todos os comandos são PowerShell, na raiz do projeto, salvo indicação em contrário.

### 1. Base de dados de teste
```powershell
docker compose up -d db
docker compose exec db psql -U user_admin -d lawfirm_db -c "CREATE DATABASE lawfirm_bench;"
```
- `up -d db` arranca **só** o PostgreSQL, em segundo plano. O backend corre fora do Docker para os logs ficarem visíveis no terminal.
- `exec db psql ...` corre o `psql` dentro do contentor. É preciso estar ligado a uma base existente (`lawfirm_db`) para criar outra.
- Se aparecer `already exists`, a base já existe: avançar.

```
Contentor "db" (PostgreSQL)
├── lawfirm_db     ← dados reais (não usados)
└── lawfirm_bench  ← só para o benchmark
```

### 2. Arrancar o backend contra a base de teste
Num **segundo terminal**, que fica aberto:
```powershell
cd LawFirmAPI
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--spring.datasource.url=jdbc:postgresql://localhost:5432/lawfirm_bench --spring.jpa.properties.hibernate.generate_statistics=true"
```
- `--spring.datasource.url=...` sobrepõe-se ao `DB_URL` do `.env`, só nesta execução.
- `generate_statistics=true` faz o Hibernate escrever no log, no fim de cada pedido, um bloco `Session Metrics` com o número de queries.
- Esperar por `Started LawFirmApiApplication`. O Hibernate cria as tabelas (`ddl-auto=update`).

### 3. Dados, utilizador e alarmes
De volta ao primeiro terminal:
```powershell
# Clientes, caixas de correio e tarefas
Get-Content scripts\benchmark\seed.sql | docker compose exec -T db psql -U user_admin -d lawfirm_bench

# Utilizador admin (o registo público aceita role=admin, um problema P0 da auditoria)
$reg = Invoke-RestMethod -Method Post -Uri http://localhost:8080/auth/register -ContentType "application/json" -Body '{"name":"Admin Teste","email":"admin@exemplo.test","phone":"910000000","prefix":"+351","role":"admin"}'

# Login e token
$login = Invoke-RestMethod -Method Post -Uri http://localhost:8080/auth/login -ContentType "application/json" -Body (@{username=$reg.username; password=$reg.password} | ConvertTo-Json)
$token = $login.token

# 100 alarmes pela API
.\scripts\benchmark\medir-endpoints.ps1 -Token $token -CriarAlarmes
```
- O `-T` no `exec` desliga o terminal interativo, para o `psql` poder ler o SQL que chega pelo pipe.
- Os alarmes são criados pela API, e não por SQL, para seguirem o caminho real da aplicação.

⚠️ A chave JWT é gerada aleatoriamente em cada arranque do backend. Se o backend for reiniciado, repetir o login.

### 4. Alarmes duplicados
```powershell
$id = docker compose exec -T db psql -U user_admin -d lawfirm_bench -t -A -c "SELECT min(id) FROM users WHERE role='client'"
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/supervisor/$id/tribunal" -Headers @{Authorization="Bearer $token"} | Out-Null
docker compose exec db psql -U user_admin -d lawfirm_bench -c "SELECT email_id, type, count(*) FROM email_supervised GROUP BY email_id, type HAVING count(*) > 1;"
```
Cria pela segunda vez um alarme que já existe. Uma linha com `count = 2` mostra que a API aceitou o duplicado, porque não há constraint UNIQUE em `(email_id, type)`.
- `-t -A` no `psql` devolve só o valor, sem cabeçalhos nem formatação.
- O `HAVING` filtra **grupos** depois do `GROUP BY`; o `WHERE` filtraria **linhas** antes de agrupar.

### 5. Medir
```powershell
.\scripts\benchmark\medir-endpoints.ps1 -Token $token
```
- **Tempo:** o script mostra a média, o mínimo e o máximo de 5 pedidos por endpoint. O 1.º pedido (aquecimento: JIT do Java, caches frias) não conta.
- **Nº de queries:** no terminal do backend, procurar em cada pedido a linha do bloco `Session Metrics`:
  ```
  ... nanoseconds spent executing X JDBC statements;
  ```
  O **X** é o número de queries desse pedido. O `spring.jpa.show-sql=true` também mostra cada query como `Hibernate: select ...`. Uma longa sequência de selects iguais é o **N+1**.

| Endpoint | O que lista | Causa provável do N+1 |
|---|---|---|
| `GET /api/supervisor` | Alarmes | Para cada alarme: a caixa de correio e o nome do cliente |
| `GET /api/email/list` | Caixas de correio válidas | Para cada caixa: o nome do cliente |
| `GET /api/task` | Tarefas | Para cada tarefa: o utilizador |

**N+1:** 1 query traz a lista e depois cada linha dispara mais 1 (ou mais) para os dados relacionados. A correção (Dia 9) é ir buscar tudo numa só query com `JOIN FETCH`, `@EntityGraph` ou uma projeção para DTO.

### 6. Limpar
```powershell
# Parar o backend: Ctrl+C no segundo terminal
docker compose exec db psql -U user_admin -d lawfirm_db -c "DROP DATABASE lawfirm_bench;"
```
Para repetir a medição, recomeçar no passo 1. A base é recriada do zero, com os mesmos dados.

## Resultados

| Endpoint | Antes (Dia 1): tempo médio | Antes: nº de queries | Depois (Dia 9): tempo médio | Depois: nº de queries |
|---|---|---|---|---|
| `GET /api/supervisor` | 75,9 ms | 51 | | |
| `GET /api/email/list` | 55,1 ms | 51 | | |
| `GET /api/task` | 63,9 ms | 51 | | |
| Alarmes duplicados aceites | Sim | — | | — |

Medição "antes" feita a 6 Out 2026. Os tempos dependem da máquina, por isso só se comparam medições feitas no mesmo PC e nas mesmas condições.

**Como ler os 51:**
- **1 + 50:** uma query para a lista e depois uma por cliente distinto. Os 101 alarmes pertencem a 50 clientes, e a cache de primeiro nível do Hibernate evita repetir o mesmo cliente.
- **Pedidos autenticados:** todos fazem ainda mais 2 queries no filtro JWT (o bloco `Session Metrics` com "2 JDBC statements"). Esse bloco não conta nos 51.
