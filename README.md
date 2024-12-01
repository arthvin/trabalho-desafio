# API MAGIC
Esta API de cartas Magic é um serviço que gera decks aleatórios para o jogo, validando se as cartas selecionadas são adequadas e se o deck possui exatamente 99 cartas além do comandante. A integração com APIs externas como Scryfall e Magic: The Gathering é feita para buscar informações sobre cartas e montar o deck. Esse serviço é ideal para ser utilizado em plataformas que permitam a criação de decks de forma dinâmica e personalizada.
# Documentação

## Instalacao
Antes de iniciar o projeto é necessário
Para baixar o rabbitmq e criar uma imagem docker:
- docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management

  
Para baixar as dependencias e começar o projeto, é necessário entrar no arquivo 
- cd CardsCrud
- npm i

para iniciar o servidor localmente:
- cd CardsCrud
- npm run start:dev 'CRUD' <- para iniciar o servidor local do aplicativo do Magic
- npm run start":dev 'notification_queue' <- para iniciar o servidor local da fila de notificacao
- npm run start":dev 'rmq-process' <- para iniciar o servidor local da fila de importacao

## PASTA `CRUD`
endpoints gerados na pasta CRUD são:
### 1. **Cartas**
- **POST /cards**  
  URL: `http://localhost:3000/cards`  
  Descrição: Cria uma nova carta.

- **GET /cards**  
  URL: `http://localhost:3000/cards`  
  Descrição: Retorna uma lista de todas as cartas cadastradas.
  
  Roles: É necessário ser `Admin` para acessar este endpoint

- **GET /cards/:id**  
  URL: `http://localhost:3000/cards/:id`  
  Descrição: Retorna os detalhes de uma carta específica pelo ID.

- **POST /cards/:id**  
  URL: `http://localhost:3000/cards/:id`  
  Descrição: Atualiza os dados de uma carta específica.

- **DELETE /cards/:id**  
  URL: `http://localhost:3000/cards/:id`  
  Descrição: Deleta uma carta específica pelo ID.

### 2. **Geração de Cartas (Decks)**

- **POST /cards/generate**  
  URL: `http://localhost:3000/cards/generate`  
  Descrição: Gera um novo deck de cartas, incluindo um comandante aleatório e 99 cartas não lendárias.

- **POST /cards/import**  
  URL: `http://localhost:3000/cards/import`  
  Descrição: Importa um deck de cartas a partir de um arquivo ou dados fornecidos.

### 3. **Usuários**

- **POST /user**  
  URL: `http://localhost:3000/user`  
  Descrição: Cria um novo usuário.

- **POST /user/:username**  
  URL: `http://localhost:3000/user/:username`  
  Descrição: Atualiza informações do usuário com o nome de usuário especificado.

- **DELETE /user/:username**  
  URL: `http://localhost:3000/user/:username`  
  Descrição: Deleta o usuário com o nome de usuário especificado.

- **GET /user**  
  URL: `http://localhost:3000/user`  
  Descrição: Retorna uma lista de todos os usuários cadastrados.

### 4. **Autenticação**

- **POST /auth/login**  
  URL: `http://localhost:3000/auth/login`  
  Descrição: Realiza o login do usuário e retorna um token de autenticação.

### 5. **Cartas do Produtor (testes)**

- **POST /cards-producer/place-card**  
  URL: `http://localhost:3000/cards-producer/place-card`  
  Descrição: Envia uma carta para a fila de produção, para ser processada posteriormente.


## PASTA `notification_queue`

A pasta `notification_queue` é responsável pela gestão das notificações no sistema, utilizando **RabbitMQ** como mecanismo de mensageria. O objetivo principal dessa funcionalidade é garantir que, sempre que um deck de cartas for processado ou atualizado, o sistema envie uma notificação em tempo real para os clientes conectados, mantendo-os atualizados sobre o status da operação.

### Funcionalidade

- **Mensageria com RabbitMQ**: Ao iniciar o servidor, o sistema se conecta ao RabbitMQ para receber e processar mensagens de filas, como notificações de atualização de decks.
- **Processamento das Notificações**: Quando um evento relevante ocorre (por exemplo, a criação de um novo deck ou a atualização de um deck existente), o sistema publica uma mensagem na fila correspondente.
- **Notificação em Tempo Real**: Outro componente do sistema, o consumidor da fila, escuta as mensagens e emite eventos de atualização para os clientes conectados, utilizando **WebSockets**. Isso garante que as notificações sejam entregues em tempo real para os clientes sem a necessidade de polling.

### Como Funciona

1. O servidor escuta as filas do RabbitMQ em busca de novas mensagens de notificações.
2. Quando uma mensagem é recebida, o sistema processa a informação e, em seguida, emite uma notificação para os clientes por meio de um **WebSocket**.
3. O cliente, por sua vez, recebe essa notificação e pode atualizar a interface conforme necessário, proporcionando uma experiência dinâmica e interativa.



## PASTA `rmq-process`

A funcionalidade foi implementada para permitir a importação de baralhos de forma assíncrona, utilizando RabbitMQ para o gerenciamento de filas e WebSockets para notificações em tempo real aos usuários sobre o status da importação.

## Etapas Implementadas

### 1. Requisição de Importação de Baralho
- O usuário faz uma requisição para importar um baralho.
- A API recebe a requisição, valida os dados e salva as informações iniciais do baralho no banco de dados.

### 2. Envio para Fila `deck_import_queue`
- Após a validação e salvamento inicial, a API envia uma mensagem contendo os detalhes do baralho a ser importado para a fila `deck_import_queue` no RabbitMQ.
- Um worker dedicado está escutando a fila `deck_import_queue`.

### 3. Processamento do Baralho pelo Worker
- O worker consome a mensagem da fila e realiza o processamento da importação do baralho.
- Durante o processamento, é realizada uma **validação adicional** do baralho, que foi implementada conforme necessário.

### 4. Envio para Fila `deck_updates_queue`
- Após concluir o processamento da importação, o worker envia uma mensagem para a fila `deck_updates_queue` para notificar sobre a conclusão do processo.

### 5. Notificação ao Cliente via WebSockets
- Um outro worker, responsável por gerenciar notificações, consome a mensagem da fila `deck_updates_queue`.


