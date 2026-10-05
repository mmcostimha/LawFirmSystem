# Ferramentas de qualidade: JaCoCo e SonarQube

Este guia explica como medir a qualidade do backend (`LawFirmAPI`): **cobertura de testes** com o JaCoCo e **análise estática** com o SonarQube.
Os números servem de ponto de partida ("antes") e permitem comparar a evolução do projeto ("depois").

## Visão geral

| Ferramenta | O que mede | Onde está configurada | Como corre |
|---|---|---|---|
| **JaCoCo** | % de linhas e de branches executadas pelos testes | Plugin `jacoco-maven-plugin` no [`LawFirmAPI/pom.xml`](../LawFirmAPI/pom.xml) | Automaticamente a cada `mvnw test` |
| **SonarQube** | Bugs, vulnerabilidades, code smells, security hotspots, duplicação, dívida técnica | Serviço `sonarqube` no [`docker-compose.yml`](../docker-compose.yml), profile `quality` | Servidor em http://localhost:9000; análise com `mvnw sonar:sonar` |

As duas trabalham em conjunto: o JaCoCo gera `target/site/jacoco/jacoco.xml` e o SonarQube lê esse ficheiro para mostrar a cobertura no dashboard.

## Decisões de configuração

### JaCoCo
- **`prepare-agent`** liga um *Java agent* à JVM dos testes. O agent instrumenta o bytecode à medida que as classes são carregadas e regista em `target/jacoco.exec` que linhas e branches foram executados.
- **`report`** está ligado à fase `test`, por isso um `mvnw test` gera logo o HTML e o XML em `target/site/jacoco/`, sem passos extra.

### SonarQube no Docker Compose
- **No compose, e não com `docker run`:** a configuração fica versionada no repositório e qualquer pessoa arranca o mesmo ambiente com um comando.
- **Profile próprio (`quality`):** um serviço com profile não arranca com o `docker compose up` normal. O SonarQube é pesado (~2 GB de RAM) e só é preciso quando se mede a qualidade. Não fica no profile `debug` porque esse serve para inspecionar a BD (pgAdmin), e não faz sentido arrancar os dois juntos.
- **Volumes nomeados** (`sonarqube_data`, `sonarqube_extensions`, `sonarqube_logs`): guardam a password do admin, os tokens e o **histórico das análises**. Sem eles, ao apagar o contentor perdia-se a análise "antes", que é precisa para comparar com o "depois".
- **Sem `restart: always`:** é uma ferramenta de uso ocasional, não deve arrancar sozinha com o Docker.
- **BD interna (H2) do SonarQube:** chega para uso local. Não se usa o Postgres da aplicação, para não misturar dados de ferramentas com dados do sistema.

## Como usar

### 1. Cobertura de testes (só JaCoCo)
Dentro de `LawFirmAPI/`:
```powershell
.\mvnw.cmd test "-Dmaven.test.failure.ignore=true"
start target\site\jacoco\index.html
```
- O `-Dmaven.test.failure.ignore=true` faz o relatório ser gerado mesmo que algum teste falhe. **Não usar em CI**: lá, um teste partido tem de partir o build.
- No relatório, a linha **Total** dá os números. Cores no código: 🟢 executado, 🔴 nunca executado, 🟡 branch coberto só em parte.

### 2. Arrancar o SonarQube
Pré-requisito: o **Docker Desktop** ligado, com "Engine running" a verde.
```powershell
docker compose --profile quality up -d sonarqube
docker compose logs -f sonarqube     # esperar por "SonarQube is operational", depois Ctrl+C
```
O nome do serviço no fim do comando faz arrancar **só** o SonarQube, e não a aplicação inteira.

### 3. Configuração inicial (só na primeira vez)
1. Abrir http://localhost:9000 e entrar com `admin` / `admin`. O SonarQube pede logo uma password nova (mínimo de 12 caracteres, com maiúscula, minúscula, número e símbolo).
2. Escolher **Create a local project**:
   - **Project display name / key:** `LawFirmAPI`.
   - **Main branch name:** `main`, a branch principal do repositório. A edição Community só analisa uma branch, por isso qualquer análise fica registada como `main`, seja qual for a branch local de onde é lançada.
3. Em **Set up new code for project**, escolher **Use the global setting** (*Previous version*).
   - O Sonar separa o *Overall Code* (todo o projeto) do *New Code* (o que mudou desde um ponto de referência). Esta separação vem da prática "Clean as You Code": o código novo tem de estar limpo, e com o tempo o projeto melhora.
   - A versão no `pom.xml` é fixa (`0.0.1-SNAPSHOT`), por isso o *New Code* passa a ser tudo o que muda desde a primeira análise. É uma forma direta de ver o progresso.
4. Em **Analysis method**, escolher **Locally**, depois **Generate**, e copiar o token (`sqp_...`). O token só é mostrado uma vez.

⚠️ **O token é um segredo.**
- Nunca o pôr no `pom.xml`, num `.env` commitado, em nenhum ficheiro do repositório nem em mensagens ou chats.
- Se for exposto, revogá-lo e gerar outro em **My Account → Security**.
- Em cada máquina gera-se um token novo.

### 4. Correr a análise
O Sonar sugere um comando escrito para **bash**, que não funciona tal como está no PowerShell:
```bash
mvn clean verify org.sonarsource.scanner.maven:sonar-maven-plugin:sonar \
  -Dsonar.projectKey=LawFirmAPI \
  -Dsonar.projectName='LawFirmAPI' \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=<TOKEN>
```

Adaptações para este projeto:

| No comando sugerido | Problema | Adaptação |
|---|---|---|
| `mvn` | O Maven pode não estar instalado globalmente | `.\mvnw.cmd`, o Maven Wrapper do projeto |
| `\` no fim das linhas | É a continuação de linha do bash; o PowerShell não a reconhece | Tudo numa só linha |
| `-Dsonar.projectName=...` | O projeto já foi criado com esse nome | Remover |
| `verify` corre os testes | O `contextLoads` falha e o build pára antes da análise | Juntar `"-Dmaven.test.failure.ignore=true"` |
| `-Dsonar.token=...` | O token fica no histórico do terminal | Usar a variável de ambiente `SONAR_TOKEN`, que o scanner lê automaticamente |

Comando final, dentro de `LawFirmAPI/`:
```powershell
$env:SONAR_TOKEN = "<TOKEN>"
.\mvnw.cmd clean verify org.sonarsource.scanner.maven:sonar-maven-plugin:sonar "-Dmaven.test.failure.ignore=true" "-Dsonar.projectKey=LawFirmAPI" "-Dsonar.host.url=http://localhost:9000"
```
- `clean` apaga o `target/`, para não ficarem restos de builds antigos. `verify` compila, corre os testes e gera o relatório do JaCoCo antes de o Sonar o ler.
- `org.sonarsource.scanner.maven:sonar-maven-plugin:sonar` é o nome completo do plugin (`groupId:artifactId:goal`). É mais fiável do que o atalho `sonar:sonar`.
- O `$env:SONAR_TOKEN` só existe nessa janela do terminal e desaparece quando a fechas.
- No fim deve aparecer `ANALYSIS SUCCESSFUL, you can find the results at: http://localhost:9000/dashboard?id=LawFirmAPI`.

### 5. Ler os resultados
Em **Projects → LawFirmAPI → Overview**, escolher o separador **Overall Code**. O *New Code* só mostra alterações recentes e fica vazio na primeira análise.

| Cartão | Nome antigo | Significado |
|---|---|---|
| Security | Vulnerabilities | Falhas exploráveis; têm de ser corrigidas |
| Reliability | Bugs | Código que provavelmente se comporta mal |
| Maintainability | Code Smells | Código difícil de manter (duplicação, métodos longos, ...) |
| Security Hotspots | — | Código sensível que um humano tem de rever (pode ou não ser um problema) |
| Coverage | — | Vem do relatório do JaCoCo |
| Duplications | — | % de linhas duplicadas |

Cada cartão mostra o número de issues e uma nota de **A** (melhor) a **E** (pior). O separador **Measures** mostra a **dívida técnica** em tempo estimado de correção.

### 6. Parar e limpar
```powershell
docker compose --profile quality stop sonarqube     # para; os dados ficam guardados
docker compose --profile quality start sonarqube    # volta a arrancar
```
⚠️ `docker compose down -v` apaga **todos** os volumes do projeto, incluindo o histórico do SonarQube **e a BD da aplicação**.

## Problemas comuns

| Sintoma | Causa | Solução |
|---|---|---|
| `ERR_CONNECTION_REFUSED` em localhost:9000 | Docker Desktop desligado, ou contentor parado | Ligar o Docker Desktop; `docker ps -a` para ver o estado |
| `error during connect ... dockerDesktopLinuxEngine` | O Docker Engine (VM do WSL2) não está a correr | Abrir o Docker Desktop e esperar pelo "Engine running" |
| Página "SonarQube is starting" | Ainda está a inicializar (1-2 min) | Esperar e atualizar a página |
| Contentor fica em `Exited` logo a seguir | Normalmente falta de memória na VM do WSL2 | `docker logs sonarqube --tail 30`; dar mais RAM ao WSL2 |
| Coverage a 0% no Sonar | O `jacoco.xml` não existia quando correu a análise | Correr `test` antes de `sonar:sonar` (como no passo 4) |
| `contextLoads` falha com `'vault://' cannot be found` | Conflito no `application-test.properties` (Vault desligado mas importado) | Problema conhecido do projeto, registado na auditoria |
