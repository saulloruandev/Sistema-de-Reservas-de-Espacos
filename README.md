# Sistema de Reservas de Espaços

API REST feita com Node.js, Express e arquivos JSON.

## 1. Requisitos

- Node.js instalado.
- Visual Studio Code.
- Thunder Client instalado no VS Code.

## 2. Instalação

Abra o terminal dentro da pasta do projeto e execute:

```bash
npm install
```

Crie um arquivo chamado `.env` na raiz do projeto, copiando o conteúdo de `.env.example`.

No `.env`, altere `JWT_SECRET` para uma chave secreta sua. Para a demonstração, o administrador padrão será:

- Email: `admin@reservas.com`
- Senha: `Admin123!`

A conta ADMIN é criada automaticamente na primeira inicialização. O cadastro público sempre cria usuários USER.

## 3. Iniciar

```bash
npm run dev
```

A API ficará em `http://localhost:3000`.

## 4. Como a arquitetura funciona

1. **Routes:** recebem a URL e direcionam para o controller.
2. **Middlewares:** verificam o token JWT e o perfil do usuário.
3. **Controllers:** recebem os dados e devolvem o status HTTP.
4. **Services:** aplicam as regras de negócio.
5. **Repositories:** leem e gravam os arquivos JSON.
6. **Models:** representam os dados de cada entidade.

## 5. Entidades e relacionamentos

- User: usuário cadastrado.
- Space: espaço que pode ser reservado.
- Reservation: reserva que conecta um usuário a um espaço.

`Reservation.userId` aponta para `User.id` e `Reservation.spaceId` aponta para `Space.id`.

## 6. Testes no Thunder Client

Base URL: `http://localhost:3000`

### Teste 1 — Consultar espaços (GET)

`GET http://localhost:3000/api/spaces`

Não precisa de token. A resposta deve mostrar os três espaços iniciais.

### Teste 2 — Cadastrar usuário (POST)

`POST http://localhost:3000/api/auth/register`

Body > JSON:

```json
{
  "nome": "Maria",
  "email": "maria@email.com",
  "senha": "123456"
}
```

### Teste 3 — Fazer login como usuário (POST)

`POST http://localhost:3000/api/auth/login`

```json
{
  "email": "maria@email.com",
  "senha": "123456"
}
```

Copie o campo `token` da resposta. Nos próximos testes, use a aba Auth > Bearer e cole o token.

### Teste 4 — Criar uma reserva (POST)

`POST http://localhost:3000/api/reservations`

Com Bearer Token do usuário:

```json
{
  "spaceId": "espaco-1",
  "dataInicio": "2027-01-15T14:00:00.000Z",
  "dataFim": "2027-01-15T16:00:00.000Z",
  "quantidadePessoas": 5
}
```

Guarde o `id` da reserva retornada.

### Teste 5 — Ver minhas reservas (GET)

`GET http://localhost:3000/api/reservations/mine`

Com Bearer Token do usuário.

### Teste 6 — Tentar reservar o mesmo horário (POST)

Repita o Teste 4 com o mesmo espaço e período. A API deverá responder `409 Conflict`, porque o horário já está ocupado.

### Teste 7 — Tentar acessar todas as reservas como USER (GET)

`GET http://localhost:3000/api/reservations`

Com token de usuário comum. Deve responder `403 Forbidden`.

### Teste 8 — Login como ADMIN (POST)

`POST http://localhost:3000/api/auth/login`

```json
{
  "email": "admin@reservas.com",
  "senha": "Admin123!"
}
```

Copie o token administrativo.

### Teste 9 — Cadastrar espaço como ADMIN (POST)

`POST http://localhost:3000/api/spaces`

Com token ADMIN:

```json
{
  "nome": "Sala de Estudos 02",
  "tipo": "Sala",
  "capacidade": 12,
  "localizacao": "Bloco D",
  "descricao": "Espaço para estudos em grupo."
}
```

### Teste 10 — Consultar todas as reservas como ADMIN (GET)

`GET http://localhost:3000/api/reservations`

Com token ADMIN. A resposta inclui os dados relacionados do usuário e do espaço.

### Teste 11 — Cancelar reserva (PATCH)

`PATCH http://localhost:3000/api/reservations/ID_DA_RESERVA/cancel`

Com token do dono da reserva ou ADMIN. Substitua `ID_DA_RESERVA` pelo id retornado no Teste 4.

### Teste 12 — Atualizar espaço (PUT)

`PUT http://localhost:3000/api/spaces/espaco-1`

Com token ADMIN:

```json
{
  "capacidade": 10,
  "descricao": "Sala atualizada para reuniões."
}
```

### Teste 13 — Excluir espaço (DELETE)

`DELETE http://localhost:3000/api/spaces/espaco-1`

Com token ADMIN. Se houver uma reserva ativa nesse espaço, a API impede a exclusão com `409`.

## 7. Endpoints resumidos

| Método | Endpoint | Acesso |
|---|---|---|
| POST | /api/auth/register | Público |
| POST | /api/auth/login | Público |
| GET | /api/spaces | Público |
| GET | /api/spaces/:id | Público |
| POST | /api/spaces | ADMIN |
| PUT | /api/spaces/:id | ADMIN |
| DELETE | /api/spaces/:id | ADMIN |
| POST | /api/reservations | USER/ADMIN autenticado |
| GET | /api/reservations/mine | Usuário autenticado |
| GET | /api/reservations | ADMIN |
| GET | /api/reservations/:id | Dono ou ADMIN |
| PUT | /api/reservations/:id | Dono ou ADMIN |
| PATCH | /api/reservations/:id/cancel | Dono ou ADMIN |
| DELETE | /api/reservations/:id | Dono ou ADMIN |

## 8. Códigos HTTP utilizados

- `200`: operação realizada.
- `201`: cadastro realizado.
- `204`: exclusão realizada sem conteúdo de resposta.
- `400`: dados inválidos.
- `401`: token ausente ou inválido.
- `403`: usuário sem permissão.
- `404`: registro não encontrado.
- `409`: conflito, como email duplicado ou horário ocupado.
- `500`: erro interno.

## 9. Persistência JSON

Os arquivos ficam em `src/data`:

- `users.json`
- `spaces.json`
- `reservations.json`

Quando uma operação cria, altera ou exclui um registro, o repositório grava novamente o arquivo. Por isso, os dados continuam salvos mesmo depois de desligar e iniciar o servidor.

> Projeto didático: a gravação em JSON é simples e adequada para a atividade. Em um sistema real com muitos acessos simultâneos, seria melhor utilizar um banco de dados.
