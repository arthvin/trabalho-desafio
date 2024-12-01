# API MAGIC

Esta API de cartas Magic oferece um serviço que gera decks aleatórios para o jogo, validando se as cartas selecionadas são apropriadas e se o deck possui exatamente 99 cartas, além do comandante. A integração com APIs externas como Scryfall e Magic: The Gathering permite buscar informações sobre cartas e montar os decks. Este serviço é ideal para ser usado em plataformas que possibilitam a criação de decks dinâmicos e personalizados.

## Documentação

### Instalação

Antes de iniciar o projeto, é necessário configurar o ambiente e baixar as dependências. Para isso, siga os passos abaixo:

1. **Configuração do RabbitMQ:**
   - Para baixar o RabbitMQ e criar uma imagem Docker, execute o seguinte comando:
   
     ```bash
     docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management
     ```

2. **Baixar Dependências do Projeto:**
   - Navegue até o diretório `CardsCrud` e instale as dependências:
   
     ```bash
     cd CardsCrud
     npm i
     ```

3. **Iniciar o Servidor Localmente:**
   - Para iniciar o servidor do aplicativo Magic:
   
     ```bash
     npm run start:dev 'CRUD'
     ```

   - Para iniciar o servidor de fila de notificações:
   
     ```bash
     npm run start:dev 'notification_queue'
     ```

   - Para iniciar o servidor de fila de importação:
   
     ```bash
     npm run start:dev 'rmq-process'
     ```

---

### Endpoints

#### 1. **Cartas**
- **POST /cards**
  - URL: `http://localhost:3000/cards`  
  - Descrição: Cria uma nova carta.

- **GET /cards**
  - URL: `http://localhost:3000/cards`  
  - Descrição: Retorna uma lista de todas as cartas cadastradas.
  - **Roles:** Necessário ser `Admin` para acessar este endpoint.

- **GET /cards/:id**
  - URL: `http://localhost:3000/cards/:id`  
  - Descrição: Retorna os detalhes de uma carta específica pelo ID.

- **POST /cards/:id**
  - URL: `http://localhost:3000/cards/:id`  
  - Descrição: Atualiza os dados de uma carta específica.

- **DELETE /cards/:id**
  - URL: `http://localhost:3000/cards/:id`  
  - Descrição: Deleta uma carta específica pelo ID.

#### 2. **Geração de Decks**
- **POST /cards/generate**
  - URL: `http://localhost:3000/cards/generate`  
  - Descrição: Gera um deck de cartas aleatório, incluindo um comandante e 99 cartas não lendárias.

- **POST /cards/import**
  - URL: `http://localhost:3000/cards/import`  
  - Descrição: Importa um deck de cartas a partir de um arquivo ou dados fornecidos.

#### 3. **Usuários**
- **POST /user**
  - URL: `http://localhost:3000/user`  
  - Descrição: Cria um novo usuário.

- **POST /user/:username**
  - URL: `http://localhost:3000/user/:username`  
  - Descrição: Atualiza as informações do usuário especificado.

- **DELETE /user/:username**
  - URL: `http://localhost:3000/user/:username`  
  - Descrição: Deleta o usuário especificado.

- **GET /user**
  - URL: `http://localhost:3000/user`  
  - Descrição: Retorna uma lista de todos os usuários cadastrados.

#### 4. **Autenticação**
- **POST /auth/login**
  - URL: `http://localhost:3000/auth/login`  
  - Descrição: Realiza o login do usuário e retorna um token de autenticação.

#### 5. **Cartas do Produtor (Testes)**
- **POST /cards-producer/place-card**
  - URL: `http://localhost:3000/cards-producer/place-card`  
  - Descrição: Envia uma carta para a fila de produção, para ser processada posteriormente.

---

### Fila de Notificações (`notification_queue`)

A pasta `notification_queue` gerencia as notificações no sistema utilizando **RabbitMQ** como sistema de mensageria. O objetivo principal dessa funcionalidade é garantir que, sempre que um deck de cartas for processado ou atualizado, o sistema envie uma notificação em tempo real para os clientes conectados, mantendo-os atualizados sobre o status da operação.

#### Como Funciona
1. O servidor escuta as filas do RabbitMQ em busca de novas mensagens de notificação.
2. Quando uma mensagem é recebida, o sistema processa a informação e emite uma notificação para os clientes conectados via **WebSocket**.
3. O cliente, por sua vez, recebe essa notificação e pode atualizar a interface em tempo real.

### Funcionalidades
- **Mensageria com RabbitMQ:** O sistema se conecta ao RabbitMQ e escuta filas, processando notificações em tempo real.
- **Notificação via WebSockets:** Quando um evento relevante ocorre (por exemplo, criação ou atualização de um deck), uma notificação é enviada em tempo real para os clientes.

---

### Processamento Assíncrono de Decks (`rmq-process`)

A funcionalidade de processamento assíncrono de decks foi implementada utilizando RabbitMQ para gerenciamento de filas e WebSockets para notificações em tempo real aos usuários sobre o status da importação de decks.

#### Etapas do Processo de Importação:
1. **Requisição de Importação:** O usuário solicita a importação de um deck.
2. **Envio para a Fila de Importação:** A API valida os dados e envia a mensagem para a fila `deck_import_queue`.
3. **Processamento pelo Worker:** Um worker consome a mensagem da fila e realiza o processamento e validação do deck.
4. **Notificação de Conclusão:** Após o processamento, o worker envia uma mensagem para a fila `deck_updates_queue`, indicando a conclusão do processo.
5. **Notificação em Tempo Real:** O consumidor da fila `deck_updates_queue` emite uma notificação via WebSocket para o cliente, informando o status da importação.

Este fluxo permite que a importação de decks seja realizada de forma assíncrona, garantindo uma experiência mais eficiente e sem bloqueios para o usuário.
