# MedClinic API

API REST para gerenciamento de uma clínica médica, desenvolvida como projeto avaliativo do módulo de Desenvolvimento Back-End com Node.js.

O sistema permite gerenciar usuários, especialidades médicas, médicos, pacientes e consultas, com autenticação JWT, controle de acesso por perfil e relatórios administrativos.

## Tecnologias utilizadas

- **Node.js** e **TypeScript**
- **Express** – construção da API REST
- **TypeORM** – mapeamento objeto-relacional
- **PostgreSQL** – banco de dados
- **JWT (JSON Web Token)** – autenticação
- **bcryptjs** – hash de senhas
- **Winston** – registro de logs
- **Swagger / OpenAPI** – documentação da API
- **CORS** – controle de origens permitidas
- **express-rate-limit** – limitação de requisições

## Funcionalidades

### Autenticação e controle de acesso
- Cadastro de usuários com senha protegida por hash.
- Login com autenticação JWT e expiração de token.
- Consulta dos dados do usuário autenticado.
- Controle de acesso baseado em papéis (RBAC).

### Gerenciamento
- CRUD de especialidades médicas.
- CRUD de médicos, vinculados a especialidades.
- CRUD de pacientes, com validação de CPF e dados cadastrais.
- Agendamento, consulta, realização e cancelamento de consultas.
- Validação de disponibilidade de médicos e prevenção de conflitos de horários.

### Consultas e relatórios
- Filtros de consultas por período, status, médico e paciente.
- Filtros de médicos e pacientes.
- Paginação de resultados.
- Relatórios de consultas por status.
- Relatórios de consultas por médico.
- Relatórios de médicos por especialidade.
- Relatório de pacientes com consultas agendadas.

## Perfis de acesso

O sistema utiliza dois perfis:

| Perfil | Permissões |
|---|---|
| ADMIN | Acesso administrativo, gerenciamento completo e relatórios. |
| ATENDENTE | Consulta de dados e operações permitidas de atendimento, pacientes e consultas. |

As rotas protegidas exigem autenticação por token Bearer. As permissões são verificadas conforme o perfil do usuário.

## Estrutura do projeto

A aplicação utiliza uma arquitetura em camadas, separando responsabilidades:

```text
src/
├── config/
│   ├── cors.ts
│   ├── logger.ts
│   └── swagger.ts
├── controllers/
├── database/
│   ├── datasource.ts
│   └── seeds/
│       └── createAdmin.ts
├── entities/
├── middlewares/
├── routes/
├── services/
├── utils/
└── server.ts
```

- **Entities:** representação das entidades e tabelas do banco de dados.
- **Controllers:** tratamento das requisições e respostas HTTP.
- **Services:** implementação das regras de negócio.
- **Routes:** definição dos endpoints e permissões.
- **Middlewares:** autenticação, autorização, logs HTTP e tratamento centralizado de erros.
- **Config:** configurações de CORS, logs e documentação Swagger.

## Requisitos para execução

- Node.js e npm instalados.
- PostgreSQL local ou instância PostgreSQL remota.
- Git para clonar o repositório.

## Instalação e configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/lmkindermann/medclinic_api.git
cd medclinic_api
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie uma cópia do arquivo de exemplo:

```bash
cp .env.example .env
```

No Windows, também é possível copiar o arquivo manualmente pelo explorador de arquivos.

Edite o `.env` com as configurações do seu ambiente.

Principais variáveis:

| Variável | Descrição |
|---|---|
| `PORT` | Porta de execução da API. |
| `JWT_SECRET` | Chave secreta para assinatura dos tokens JWT. |
| `JWT_EXPIRES_IN` | Tempo de validade do token. |
| `DB_HOST` | Endereço do servidor PostgreSQL. |
| `DB_PORT` | Porta do PostgreSQL. |
| `DB_USERNAME` | Usuário do banco de dados. |
| `DB_PASSWORD` | Senha do banco de dados. |
| `DB_DATABASE` | Nome do banco de dados. |
| `DB_SSL` | Habilita ou desabilita SSL. |
| `ADMIN_NAME` | Nome do administrador inicial. |
| `ADMIN_EMAIL` | E-mail do administrador inicial. |
| `ADMIN_PASSWORD` | Senha do administrador inicial. |
| `CORS_ORIGINS` | Lista de origens permitidas, separadas por vírgula. |
| `LOG_LEVEL` | Nível de detalhamento dos logs. |
| `RATE_LIMIT_WINDOW_MS` | Janela de tempo do limite global. |
| `RATE_LIMIT_MAX` | Número máximo de requisições globais por janela. |
| `AUTH_RATE_LIMIT_WINDOW_MS` | Janela de tempo do limite de autenticação. |
| `AUTH_RATE_LIMIT_MAX` | Número máximo de tentativas de autenticação por janela. |

**Banco de dados:** crie previamente um banco PostgreSQL vazio com o nome configurado em `DB_DATABASE`.

O projeto utiliza TypeORM com sincronização automática das entidades (`synchronize: true`). Assim, a estrutura das tabelas é criada ou atualizada durante a inicialização da aplicação.

Para PostgreSQL local, configure `DB_SSL=false`. Para a Aiven, utilize as credenciais fornecidas pelo serviço e configure `DB_SSL=true`.

> A sincronização automática é utilizada neste projeto para facilitar a execução em ambiente de desenvolvimento. Em aplicações de produção, recomenda-se o uso de migrations.

### 4. Criar o administrador inicial

Após configurar o `.env`, execute:

```bash
npm run seed:admin
```

O script utiliza as variáveis `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` para criar o usuário administrador inicial.

A operação verifica a existência do e-mail antes de criar um novo registro.

### 5. Executar a aplicação

Para desenvolvimento:

```bash
npm run dev
```

Para compilar o projeto:

```bash
npm run build
```

Para executar a versão compilada:

```bash
npm start
```

Por padrão, a API estará disponível em:

```text
http://localhost:3333
```

A porta pode ser alterada pela variável `PORT`.

## Documentação da API

A documentação interativa está disponível através do Swagger:

```text
http://localhost:3333/api-docs
```

O Swagger apresenta os endpoints, parâmetros, modelos de dados, respostas HTTP e permite testar as operações autenticadas utilizando o botão **Authorize** com um token JWT.

## Principais endpoints

| Recurso | Método | Endpoint |
|---|---|---|
| Autenticação | POST | `/auth/register/user` |
| Autenticação | POST | `/auth/login` |
| Usuário autenticado | GET | `/user/me` |
| Administração | GET | `/admin/ping` |
| Especialidades | GET / POST | `/especialidades` |
| Especialidade específica | GET / PUT / DELETE | `/especialidades/:id` |
| Médicos | GET / POST | `/medicos` |
| Médico específico | GET / PUT / DELETE | `/medicos/:id` |
| Pacientes | GET / POST | `/pacientes` |
| Paciente específico | GET / PUT / DELETE | `/pacientes/:id` |
| Consultas | GET / POST | `/consultas` |
| Consulta específica | GET | `/consultas/:id` |
| Atendimento | PATCH | `/consultas/:id/atendimento` |
| Cancelamento | PATCH | `/consultas/:id/cancelamento` |

Os relatórios administrativos estão disponíveis sob o prefixo `/relatorios`. Consulte o Swagger para visualizar todos os endpoints e seus respectivos parâmetros.

## Segurança e tratamento de erros

A aplicação implementa:

- Senhas armazenadas utilizando hash com bcryptjs.
- Autenticação JWT com validação de token e expiração.
- Controle de acesso por perfil (ADMIN e ATENDENTE).
- Middleware centralizado de tratamento de erros.
- Respostas padronizadas para erros HTTP.
- Validações de dados e regras de negócio.
- CORS com origens explicitamente configuradas.
- Rate limiting global e específico para autenticação.

Entre os códigos HTTP utilizados estão `400`, `401`, `403`, `404`, `409`, `429` e `500`.

## Sistema de logs

O Winston é utilizado para registrar eventos da aplicação.

Os arquivos são gerados no diretório `logs/`:

- `logs/combined.log`: registro geral da aplicação.
- `logs/error.log`: registro de erros.

Os níveis de log podem ser configurados através da variável `LOG_LEVEL`:

- `error`
- `warn`
- `info`
- `http`
- `debug`

O diretório de logs não é versionado no Git.

## Credenciais de demonstração

O administrador inicial é criado através do script de seed.

- **E-mail:** `admin@medclinic.com`
- **Senha:** utilizar o valor configurado em `ADMIN_PASSWORD` no ambiente de demonstração.

Não utilize credenciais reais ou senhas pessoais no repositório.

## Planejamento e acompanhamento

O desenvolvimento foi organizado em branches por funcionalidade, com integração das implementações na branch `development`.

**Quadro de tarefas:** [Acompanhar o desenvolvimento](https://trello.com/b/XDXFRTfk/medclinic-api)

## Melhorias futuras

Algumas evoluções possíveis para o projeto:

- Implementação de testes automatizados com Jest.
- Containerização da aplicação com Docker.
- Deploy da API em ambiente de nuvem.
- Utilização de migrations para gerenciamento da evolução do banco de dados.
- Ampliação da cobertura de testes e validações.

## Autor

**Lucas Kindermann**

Tecnólogo em Eletrônica | Desenvolvedor Hardware & Software

- GitHub: https://github.com/lmkindermann
- LinkedIn: https://linkedin.com/in/lmkindermann/
