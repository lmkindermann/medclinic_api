# MedClinic API 🏥

API REST desenvolvida em **Node.js + TypeScript** para a etapa inicial do projeto **MedClinic**, uma aplicação voltada ao gerenciamento de uma clínica médica.

> **Etapa atual:** Autenticação e Autorização

Nesta primeira etapa, o foco está na construção da base de **autenticação e autorização de usuários**, que servirá como ponto de partida para as próximas funcionalidades do sistema.

---

## 📋 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Escopo desta etapa](#-escopo-desta-etapa)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Requisitos para execução](#-requisitos-para-execução)
- [Configuração do banco de dados](#-configuração-do-banco-de-dados)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Instalação e execução](#-instalação-e-execução)
- [Arquitetura do projeto](#-arquitetura-do-projeto)
- [Fluxo de autenticação](#-fluxo-de-autenticação)
- [Endpoints](#-endpoints)
- [Perfis de acesso](#-perfis-de-acesso)
- [Segurança](#-segurança)
- [Testando a API](#-testando-a-api)
- [Próximas etapas](#-próximas-etapas)

---

## 📌 Sobre o projeto

O MedClinic API foi desenvolvido como projeto avaliativo do módulo de **Back End Node**, utilizando conceitos de desenvolvimento de APIs REST, TypeScript, Express, TypeORM, PostgreSQL, autenticação com JWT e controle de acesso baseado em perfis.

A ideia desta etapa foi construir uma base funcional e organizada para que, futuramente, possam ser adicionados os módulos relacionados ao funcionamento da clínica, como médicos, pacientes, especialidades e consultas.

---

## 🎯 Escopo desta etapa

Nesta versão foram implementadas funcionalidades relacionadas a:

- ✅ Cadastro de usuários;
- ✅ Validação de e-mail;
- ✅ Armazenamento seguro da senha utilizando hash;
- ✅ Login utilizando e-mail e senha;
- ✅ Geração de token JWT;
- ✅ Validação do token através de middleware;
- ✅ Identificação do usuário autenticado;
- ✅ Perfis de acesso;
- ✅ Endpoint de verificação administrativa;
- ✅ Conexão com PostgreSQL utilizando TypeORM.

> **Importante:** as funcionalidades de negócio da clínica, como cadastro de médicos, pacientes, especialidades e consultas, **não fazem parte desta etapa** e poderão ser adicionadas posteriormente.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| **Node.js** | Ambiente de execução da aplicação |
| **TypeScript** | Linguagem utilizada no desenvolvimento |
| **Express.js** | Framework para criação da API REST |
| **TypeORM** | ORM para comunicação com o banco de dados |
| **PostgreSQL** | Banco de dados relacional |
| **jsonwebtoken** | Geração e validação dos tokens JWT |
| **bcryptjs** | Criação e comparação do hash das senhas |
| **dotenv** | Carregamento das variáveis de ambiente |
| **reflect-metadata** | Suporte utilizado pelo TypeORM |
| **ts-node-dev** | Execução da aplicação durante o desenvolvimento |

As dependências utilizadas pelo projeto estão definidas no arquivo `package.json`.

---

## 💻 Requisitos para execução

Para executar o projeto localmente, é necessário ter instalado:

- [Node.js](https://nodejs.org/)
- npm
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

Também é necessário possuir acesso a um banco de dados PostgreSQL.

As demais dependências do projeto são instaladas através do `npm install`.

---

## 🗄️ Configuração do banco de dados

O projeto utiliza o **PostgreSQL** como banco de dados e o **TypeORM** para realizar a comunicação entre a aplicação e o banco.

A configuração da conexão é feita através de variáveis de ambiente, evitando que as credenciais do banco sejam colocadas diretamente no código.

### Criação do banco

No PostgreSQL, pode ser criado inicialmente o banco de dados:

```sql
CREATE DATABASE medclinic;
```

As estruturas utilizadas nesta etapa são gerenciadas pelo TypeORM.

A entidade `Usuario` representa a tabela de usuários e possui os campos:

- `id`
- `nome`
- `email`
- `senha`
- `categoria`
- `criadoEm`

A senha é armazenada somente em formato de hash.

---

## 🔐 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=medclinic
DB_SSL=false

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1d

PORT=3333
```

### Descrição das variáveis

| Variável | Descrição |
|---|---|
| `DB_HOST` | Endereço do servidor PostgreSQL |
| `DB_PORT` | Porta utilizada pelo PostgreSQL |
| `DB_USERNAME` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |
| `DB_DATABASE` | Nome do banco utilizado pela aplicação |
| `DB_SSL` | Define se a conexão utilizará SSL |
| `JWT_SECRET` | Chave utilizada para assinar e validar os tokens JWT |
| `JWT_EXPIRES_IN` | Tempo de expiração do token JWT |
| `PORT` | Porta utilizada pela API |

> ⚠️ **Atenção:** não versione o arquivo `.env` no GitHub quando ele contiver credenciais reais ou chaves utilizadas em produção.

---

## 🚀 Instalação e execução

### 1. Clonar o repositório

```bash
git clone https://github.com/lmkindermann/medclinic_api.git
cd medclinic_api
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar o `.env`

Crie o arquivo `.env` na raiz do projeto e informe as configurações do PostgreSQL e do JWT conforme apresentado na seção [Variáveis de ambiente](#-variáveis-de-ambiente).

### 4. Executar em desenvolvimento

```bash
npm run dev
```

A API será iniciada na porta configurada pela variável `PORT`.

Por exemplo:

```text
Servidor rodando na porta 3333
```

### 5. Gerar o build

```bash
npm run build
```

### 6. Executar a versão compilada

```bash
npm start
```

---

## 🏗️ Arquitetura do projeto

A aplicação foi organizada de forma modular, separando as responsabilidades entre rotas, controllers, entidade, middleware, banco de dados e funções auxiliares.

```text
medclinic_api/
│
├── src/
│   ├── controllers/
│   │   ├── AdminController.ts
│   │   ├── AuthController.ts
│   │   └── UserController.ts
│   │
│   ├── database/
│   │   └── datasource.ts
│   │
│   ├── entities/
│   │   └── user.ts
│   │
│   ├── middlewares/
│   │   └── authMiddleware.ts
│   │
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── admin.routes.ts
│   │
│   ├── utils/
│   │   └── jwt.ts
│   │
│   └── server.ts
│
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

### Responsabilidade das principais pastas

#### `controllers`

Responsáveis por receber as requisições HTTP, processar as entradas e retornar as respostas da API.

- `AuthController`: cadastro e login;
- `UserController`: informações do usuário autenticado;
- `AdminController`: endpoint de verificação administrativa.

#### `database`

Centraliza a configuração da conexão com o PostgreSQL através do TypeORM.

#### `entities`

Contém as entidades utilizadas pelo TypeORM.

Nesta etapa, a principal entidade é `Usuario`.

#### `middlewares`

Contém funcionalidades executadas durante o processamento das requisições.

O `authMiddleware` é responsável por verificar o token JWT enviado no header `Authorization`.

#### `routes`

Define os endpoints disponíveis na API e direciona cada requisição para seu respectivo controller.

Principais grupos de rotas:

```text
/auth
/user
/admin
```

#### `utils`

Contém funções auxiliares utilizadas pela aplicação.

Nesta etapa, o arquivo `jwt.ts` concentra funções relacionadas à criação e validação dos tokens JWT.

---

## 🔄 Fluxo de autenticação

O fluxo básico de autenticação da aplicação pode ser representado da seguinte forma:

```text
                 ┌───────────────┐
                 │    Cliente    │
                 └───────┬───────┘
                         │
                         │ POST /auth/register/user
                         ▼
                 ┌───────────────┐
                 │    Cadastro   │
                 │   do usuário  │
                 └───────┬───────┘
                         │
                         │ senha → bcrypt hash
                         ▼
                 ┌───────────────┐
                 │  PostgreSQL   │
                 └───────┬───────┘
                         │
                         │ POST /auth/login
                         ▼
                 ┌───────────────┐
                 │ Validação das │
                 │  credenciais   │
                 └───────┬───────┘
                         │
                         │ JWT
                         ▼
                 ┌───────────────┐
                 │ Cliente recebe│
                 │     token     │
                 └───────┬───────┘
                         │
                         │ Authorization: Bearer <token>
                         ▼
                 ┌───────────────┐
                 │ authMiddleware│
                 └───────┬───────┘
                         │
                  ┌──────┴──────┐
                  │             │
              inválido        válido
                  │             │
                  ▼             ▼
             HTTP 401     Rota protegida
```

---

# 🔌 Endpoints

## 1. Cadastro de usuário

### `POST /auth/register/user`

Realiza o cadastro de um novo usuário.

Por padrão, os usuários cadastrados por esta rota recebem o perfil:

```text
ATENDENTE
```

### Requisição

```http
POST /auth/register/user
Content-Type: application/json
```

```json
{
  "nome": "João da Silva",
  "email": "joao.silva@example.com",
  "senha": "Senha123"
}
```

### Parâmetros

| Campo | Tipo | Obrigatório |
|---|---|---|
| `nome` | string | Sim |
| `email` | string | Sim |
| `senha` | string | Sim |

### Resposta — sucesso

**HTTP 201 Created**

```json
{
  "id": "c2d8c5c1-1234-4567-8901-123456789abc",
  "nome": "João da Silva",
  "email": "joao.silva@example.com",
  "categoria": "ATENDENTE"
}
```

A senha não é retornada na resposta.

### E-mail já cadastrado

**HTTP 400 Bad Request**

```json
{
  "erro": "E-mail já cadastrado"
}
```

### E-mail inválido

**HTTP 400 Bad Request**

```json
{
  "erro": "E-mail inválido"
}
```

### Campos obrigatórios ausentes

**HTTP 400 Bad Request**

```json
{
  "erro": "nome, email e senha são obrigatórios."
}
```

---

## 2. Login

### `POST /auth/login`

Realiza a autenticação de um usuário cadastrado.

### Requisição

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "joao.silva@example.com",
  "senha": "Senha123"
}
```

### Resposta — sucesso

**HTTP 200 OK**

```json
{
  "token": "<JWT_GERADO_PELA_API>",
  "usuario": {
    "id": "c2d8c5c1-1234-4567-8901-123456789abc",
    "nome": "João da Silva",
    "email": "joao.silva@example.com",
    "categoria": "ATENDENTE"
  }
}
```

O token retornado deve ser utilizado nas próximas requisições que exigirem autenticação.

### Credenciais inválidas

**HTTP 401 Unauthorized**

```json
{
  "erro": "Credenciais Inválidas"
}
```

A mesma resposta é utilizada quando o usuário não é encontrado ou quando a senha informada não corresponde ao hash armazenado.

---

## 3. Consultar usuário autenticado

### `GET /user/me`

Retorna os dados do usuário identificado pelo token JWT.

### Header

```http
Authorization: Bearer <JWT>
```

### Exemplo com cURL

```bash
curl -X GET http://localhost:3333/user/me \
  -H "Authorization: Bearer <JWT>"
```

### Resposta — sucesso

**HTTP 200 OK**

```json
{
  "id": "c2d8c5c1-1234-4567-8901-123456789abc",
  "nome": "João da Silva",
  "email": "joao.silva@example.com",
  "categoria": "ATENDENTE",
  "criadoEm": "2026-09-10T14:30:00.000Z"
}
```

A senha não é incluída na resposta.

### Token não informado

**HTTP 401 Unauthorized**

```json
{
  "erro": "Token não informado."
}
```

### Token mal formatado

**HTTP 401 Unauthorized**

```json
{
  "erro": "Token mal formatado."
}
```

### Token inválido ou expirado

**HTTP 401 Unauthorized**

```json
{
  "erro": "Token inválido ou expirado"
}
```

---

## 4. Endpoint de verificação administrativa

### `GET /admin/ping`

Endpoint utilizado para demonstrar o acesso relacionado ao perfil administrativo.

### Header

```http
Authorization: Bearer <JWT>
```

### Exemplo com cURL

```bash
curl -X GET http://localhost:3333/admin/ping \
  -H "Authorization: Bearer <JWT>"
```

### Resposta

**HTTP 200 OK**

```json
{
  "message": "Usuário administrador identificado. Acesso autorizado!"
}
```

> Este endpoint faz parte da etapa de autenticação/autorização e serve como ponto de verificação do acesso administrativo.

---

# 👤 Perfis de acesso

A aplicação possui dois perfis de usuário:

| Perfil | Descrição |
|---|---|
| `ADMIN` | Perfil administrativo |
| `ATENDENTE` | Perfil operacional utilizado pelos usuários cadastrados normalmente |

Os perfis são definidos através do enum `UsuarioRole`:

```typescript
export enum UsuarioRole {
    ATENDENTE = 'ATENDENTE',
    ADMIN = 'ADMIN'
}
```

### ATENDENTE

O perfil `ATENDENTE` é atribuído por padrão aos usuários criados através do endpoint de cadastro.

É o perfil pensado para usuários que utilizarão a aplicação nas atividades operacionais, com permissões mais restritas.

### ADMIN

O perfil `ADMIN` representa o usuário administrativo e é utilizado para demonstrar o controle de acesso administrativo da API.

---

# 🔒 Segurança

Algumas medidas de segurança foram aplicadas nesta etapa.

## Senhas

As senhas não são armazenadas diretamente no banco de dados.

Durante o cadastro, a senha é transformada em hash utilizando `bcryptjs`:

```text
Senha informada
      ↓
bcrypt.hash()
      ↓
Hash armazenado no PostgreSQL
```

Durante o login, a senha informada é comparada com o hash armazenado utilizando `bcrypt.compare()`.

## JWT

Após um login válido, a aplicação gera um token JWT contendo informações necessárias para identificar o usuário e seu perfil.

O tempo de expiração do token pode ser configurado através de:

```env
JWT_EXPIRES_IN=1d
```

A chave utilizada para assinar o token é definida através de:

```env
JWT_SECRET=chave-secreta
```

Essas informações devem permanecer fora do código-fonte.

---

# 🧪 Testando a API

Os testes podem ser realizados utilizando ferramentas como:

- Postman;
- Insomnia;
- Thunder Client;
- cURL.

Uma sequência simples para verificar o funcionamento da aplicação é apresentada abaixo.

### 1. Cadastrar um usuário

```http
POST /auth/register/user
```

```json
{
  "nome": "Usuário Teste",
  "email": "usuario.teste@example.com",
  "senha": "Senha123"
}
```

### 2. Fazer login

```http
POST /auth/login
```

```json
{
  "email": "usuario.teste@example.com",
  "senha": "Senha123"
}
```

Copie o `token` retornado pela API.

### 3. Consultar o usuário autenticado

```http
GET /user/me
```

Adicionar o token no header:

```http
Authorization: Bearer <token>
```

### 4. Testar uma requisição sem token

```http
GET /user/me
```

Resultado esperado:

```http
401 Unauthorized
```

### 5. Testar um token inválido

```http
GET /user/me
Authorization: Bearer token-invalido
```

Resultado esperado:

```http
401 Unauthorized
```

Esses testes permitem verificar o fluxo básico de cadastro, login, geração do JWT e proteção das rotas.

---

# 🔮 Próximas etapas

Esta versão representa somente a base de **autenticação e autorização** do MedClinic API.

A partir desta estrutura, o projeto poderá evoluir para incluir os módulos de negócio da clínica, como:

- 🩺 Especialidades;
- 👨‍⚕️ Médicos;
- 🧑‍🤝‍🧑 Pacientes;
- 📅 Consultas;
- 📊 Demais funcionalidades relacionadas ao gerenciamento da clínica.

A ideia é aproveitar a estrutura criada nesta etapa como base para essas próximas funcionalidades.

---

## 📚 Considerações finais

O principal objetivo desta etapa foi colocar em prática os conceitos estudados no módulo de Back End, principalmente a construção de uma API REST utilizando **TypeScript, Express e TypeORM**, além da integração com **PostgreSQL**.

Também foi possível trabalhar conceitos importantes de segurança, como armazenamento de senhas utilizando hash, autenticação através de JWT e identificação do perfil do usuário durante as requisições.

O projeto ainda pode receber melhorias e novas funcionalidades nas próximas etapas, mas a estrutura atual fornece uma base para a continuidade do desenvolvimento do **MedClinic API**.

---

### 👨‍💻 Projeto

**MedClinic API**

Desenvolvido por **Lucas Kindermann** como projeto avaliativo do módulo de Back End Node.
