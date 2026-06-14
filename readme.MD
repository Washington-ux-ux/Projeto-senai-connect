# SENAI Connect

Plataforma corporativa de comunicação interna para o SENAI, desenvolvida para centralizar a interação entre alunos, professores, coordenação e direção.

## 📌 Sobre o Projeto

O **SENAI Connect** é uma aplicação web full-stack que centraliza comunicados, eventos, links úteis e solicitações institucionais em um único ambiente digital. O sistema utiliza autenticação JWT, controle de acesso por roles e armazenamento em JSON para prototipagem rápida.

---


## 🎯 Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- Registro de usuários com criptografia de senhas (bcrypt)
- Login com autenticação JWT
- Controle de sessão via localStorage
- Middleware de autenticação e autorização por roles
- Roles: ADMIN, COORDINATOR, DIRECTOR, TEACHER, STUDENT

### 📢 Plataforma de Posts/Comunicados
- Criação de posts por TEACHER, COORDINATOR e ADMIN
- Exclusão de posts por COORDINATOR e ADMIN
- Categorias: EVENT, INTERNSHIP, PRESENTATION, ANNOUNCEMENT
- Sistema de visibilidade (ALL, STUDENT, TEACHER, COORDINATOR)
- Sistema de reações com múltiplos emojis por usuário (só uma vez cada)
- Toggle de reações (clicar novamente remove a reação)
- Botões de reação ficam azuis quando ativos
- Sistema de compartilhamento de posts (Web Share API)
- Resumo automático via IA (endpoint disponível)

### 📅 Eventos Acadêmicos
- Criação de eventos por COORDINATOR e ADMIN
- Exclusão de eventos por COORDINATOR e ADMIN
- Tipos: EXAM, HOLIDAY, PRESENTATION, WORK
- Exibição unificada com posts na página de eventos

### 🔗 Mural de Links
- Visualização de links úteis para todos os usuários
- Criação de links por COORDINATOR e ADMIN
- Edição e exclusão de links por COORDINATOR e ADMIN
- Interface em tabela com ações administrativas

### 📋 Sistema de Solicitações
- Envio de solicitações por alunos
- Status: SENT, ANALYZING, RESPONDED, FINISHED
- Sistema de protocolos
- Agendamento de reuniões

### 💬 Chat Corporativo
- Salas de chat (PRIVATE, GROUP)
- Mensagens com suporte a arquivos
- Mensagens fixadas
- Membros em salas de grupo

### 🌙 Interface do Usuário
- Tema claro/escuro com transições suaves
- Logo otimizado para modo dark (fundo transparente)
- Calendário interativo
- Menu de usuário com dropdown
- Modal de confirmação de exclusão customizado
- Modais para criação de posts, usuários e links
- Design responsivo

---


## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** + **Express** - Servidor web e API REST
- **TypeScript** - Tipagem estática
- **JWT** - Autenticação via tokens
- **bcrypt** - Criptografia de senhas
- **JSON** - Armazenamento de dados (prototipagem)

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização com tema claro/escuro
- **JavaScript** - Lógica de interface e chamadas à API
- **Font Awesome** - Ícones

### Ferramentas
- **tsx** - Execução de TypeScript
- **tsup** - Build do projeto
- **chalk** - Logs coloridos no console

---


## 📂 Estrutura do Projeto

```
senai-connect/
├── src/
│   ├── controllers/        # Controladores da API
│   │   ├── usersControllers.ts
│   │   ├── postsControllers.ts
│   │   ├── academicEventsController.ts
│   │   ├── linksControllers.ts
│   │   ├── reactionsControllers.ts
│   │   ├── chatControllers.ts
│   │   └── requestsControllers.ts
│   ├── models/            # Interfaces TypeScript
│   │   ├── user-model.ts
│   │   ├── posts-model.ts
│   │   ├── academicEvent-model.ts
│   │   ├── requests-model.ts
│   │   ├── chatRoom-model.ts
│   │   └── message-model.ts
│   ├── services/           # Lógica de negócio
│   │   ├── usersServices.ts
│   │   ├── postsServices.ts
│   │   ├── academicEventsServices.ts
│   │   ├── linksServices.ts
│   │   ├── reactionsServices.ts
│   │   ├── chatServices.ts
│   │   └── requestsServices.ts
│   ├── repository/        # Acesso aos dados
│   │   ├── userRepository.ts
│   │   ├── postsRepository.ts
│   │   ├── academicEventsRepository.ts
│   │   ├── linksRepository.ts
│   │   ├── reactionsRepository.ts
│   │   ├── chatRepository.ts
│   │   └── requestsRepository.ts
│   ├── middlewares/       # Middlewares Express
│   │   └── authMiddleware.ts
│   ├── utils/             # Utilitários
│   │   ├── auth.ts
│   │   └── http-helper.ts
│   └── data/              # Arquivos JSON (banco de dados)
│       ├── user.json
│       ├── posts.json
│       ├── academicEvent.json
│       ├── links.json
│       ├── reactions.json
│       ├── requests.json
│       ├── chat.json
│       └── message.json
├── docs/                  # Frontend
│   ├── index.html         # Página inicial com calendário
│   ├── eventos.html       # Página de eventos
│   ├── mural.html         # Mural de links
│   ├── sobre.html         # Página sobre o projeto
│   ├── perfil.html        # Perfil do usuário
│   ├── script/            # JavaScript do frontend
│   │   ├── login.js
│   │   ├── events.js
│   │   ├── mural.js
│   │   ├── calendar.js
│   │   ├── dayNightMode.js
│   │   ├── reactions.js
│   │   ├── exclude.js
│   │   └── profile.js
│   ├── style/             # CSS
│   │   ├── style.css
│   │   ├── index.css
│   │   ├── eventos.css
│   │   ├── mural.css
│   │   ├── sobre.css
│   │   └── profile.css
│   └── assets/            # Imagens e ícones
├── server.ts              # Entry point do servidor
├── app.ts                 # Configuração do Express
├── routes.ts              # Definição das rotas da API
├── package.json           # Dependências do projeto
├── .env                   # Variáveis de ambiente
└── README.md              # Este arquivo
```

---


## � API Endpoints

### Autenticação
- `POST /api/user/register` - Registrar novo usuário
- `POST /api/user/login` - Fazer login
- `GET /api/user/me` - Obter dados do usuário autenticado

### Posts
- `GET /api/posts` - Listar todos os posts
- `GET /api/posts/:id` - Obter post por ID
- `POST /api/posts` - Criar post (TEACHER, COORDINATOR, ADMIN)
- `DELETE /api/posts/:id` - Excluir post (COORDINATOR, ADMIN)
- `GET /api/posts/summary` - Resumo IA (TEACHER, COORDINATOR, ADMIN)

### Reações
- `GET /api/reactions/:postId` - Obter reações de um post
- `POST /api/reactions/:postId` - Adicionar/remover reação (autenticado)
- `DELETE /api/reactions/:postId` - Excluir reações de um post (COORDINATOR, ADMIN)

### Eventos Acadêmicos
- `GET /api/academic-events` - Listar eventos
- `GET /api/academic-events/date/:calendar` - Buscar por data
- `POST /api/academic-events` - Criar evento (COORDINATOR, ADMIN)
- `DELETE /api/academic-events/:id` - Excluir evento (COORDINATOR, ADMIN)

### Links
- `GET /api/links` - Listar links
- `POST /api/links` - Criar link (COORDINATOR, ADMIN)
- `PUT /api/links/:id` - Atualizar link (COORDINATOR, ADMIN)
- `DELETE /api/links/:id` - Excluir link (COORDINATOR, ADMIN)

### Chat
- `GET /api/chat/room` - Listar salas de chat
- `GET /api/chat/messages/:roomId` - Obter mensagens da sala

### Solicitações
- `GET /api/requests` - Listar todas as solicitações
- `GET /api/requests/my` - Listar solicitações do usuário
- `POST /api/requests` - Criar solicitação
- `PUT /api/requests/:id` - Atualizar solicitação

## 👥 Roles e Permissões

| Role | Permissões |
|------|------------|
| **STUDENT** | Visualizar posts, eventos, links; enviar solicitações |
| **TEACHER** | Criar posts; visualizar tudo |
| **COORDINATOR** | Criar/excluir posts, eventos, links; criar usuários; gerenciar solicitações |
| **ADMIN** | Controle total do sistema |

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado
- npm ou yarn

### Instalação
```bash
npm install
```

### Executar em desenvolvimento
```bash
npm run dev
```

O servidor será iniciado em `http://localhost:3000`

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```
PORT=3000
JWT_SECRET=sua-chave-secreta-aqui
```

## � Segurança

- Senhas criptografadas com bcrypt
- Autenticação via JWT com expiração de 24h
- Middleware de autenticação em rotas protegidas
- Autorização baseada em roles (RBAC)
- Validação de dados nos controllers

## 📊 Dados

O projeto utiliza arquivos JSON para armazenamento temporário de dados. Para produção, recomenda-se migrar para um banco de dados relacional como MySQL ou PostgreSQL.

## 🎨 Páginas do Frontend

- **inicio.html** - Página inicial com calendário interativo
- **eventos.html** - Exibição de posts e eventos acadêmicos com sistema de reações
- **mural.html** - Mural de links úteis
- **sobre.html** - Informações sobre o projeto
- **perfil.html** - Perfil do usuário

## 📈 Futuras Melhorias

- Migração para banco de dados relacional (MySQL/PostgreSQL)
- Implementação de WebSocket para chat em tempo real
- Sistema de notificações push
- Upload de imagens nos posts
- Sistema de comentários nos posts
- Filtro de eventos por data/categoria
- Busca de eventos e links
- Sistema de favoritos para posts e links
- Perfil do usuário mais completo (bio, foto, etc.)
- Histórico de atividades do usuário
- Exportação de eventos para calendário (ICS)
- Sistema de tags/categorias para posts
- Chat/mensagens entre usuários
- Sistema de aprovação de posts (moderação)
- Analytics de engajamento
- Integração com Google Calendar
- Sistema de arquivos/documentos compartilhados
- Enquete/polls nos posts
- Aplicativo mobile (React Native)
- Testes automatizados
- CI/CD pipeline

## 👨‍💻 Desenvolvimento

Projeto desenvolvido para a disciplina de Desenvolvimento de Sistemas do SENAI.

## 📄 Licença

Este projeto é destinado para fins educacionais.
