# SENAI Connect

Plataforma corporativa de comunicação interna para o SENAI, desenvolvida para centralizar a interação entre alunos, professores, coordenação e direção.

## 📌 Sobre o Projeto

O **SENAI Connect** é uma aplicação web full-stack que centraliza comunicados, eventos, links úteis e solicitações institucionais em um único ambiente digital. O sistema utiliza autenticação JWT, controle de acesso por roles e armazenamento em PostgreSQL para persistência de dados.

---


## 🎯 Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- Login com matrícula (registration) e senha em texto plano
- Autenticação JWT com token contendo userId, matricula e role
- Controle de sessão via localStorage
- Middleware de autenticação e autorização por roles
- Identificação de usuário por matricula (única) em vez de ID
- Roles: Administrador, Coordenadores, professores e alunos

### 📢 Plataforma de Posts/Comunicados
- Criação de posts por Administradores e Coordenadores
- Exclusão de posts por Administradores e Coordenadores
- Categorias: Eventos, Empregabilidade e Comunicados
- Sistema de visibilidade (Todos, Alunos, Professores e coordenadores)
- Sistema de reações com múltiplos emojis por usuário (só uma vez cada)
- Toggle de reações (clicar novamente remove a reação)
- Botões de reação ficam azuis quando ativos
- Sistema de compartilhamento de posts (Web Share API)
- Upload de imagens via Cloudinary (armazenamento em nuvem persistente)

### 📅 Eventos Acadêmicos
- Criação de eventos por Administradores e Coordenadores
- Exclusão de eventos por Administradores e Coordenadores
- Tipos: Evento, Empregabilidade e Comunicado
- Calendário interativo integrado com eventos acadêmicos
- Visualização de eventos marcados com indicadores no calendário

### 🔗 Mural de Links
- Visualização de links úteis para todos os usuários
- Criação de links por Administradores e Coordenadores
- Edição e exclusão de links por Administradores e Coordenadores
- Interface em tabela com ações administrativas

### 🌙 Interface do Usuário
- Tema claro/escuro com transições suaves
- Calendário interativo
- Menu de usuário com dropdown
- Modal de confirmação de exclusão customizado
- Modais para criação de posts, usuários e links
---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** + **Express** - Servidor web e API REST
- **TypeScript** - Tipagem estática
- **JWT** - Autenticação via tokens
- **PostgreSQL** - Banco de dados relacional
- **pg** - Cliente PostgreSQL para Node.js
- **Cloudinary** - Armazenamento de imagens em nuvem

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
│   ├── config/            # Configurações
│   │   └── database.ts    # Configuração do PostgreSQL
│   ├── controllers/        # Controladores da API
│   │   ├── usersControllers.ts
│   │   ├── postsControllers.ts
│   │   ├── academicEventsController.ts
│   │   ├── linksControllers.ts
│   │   ├── reactionsControllers.ts
│   │   └── authControllers.ts
│   ├── services/           # Lógica de negócio
│   │   ├── usersServices.ts
│   │   ├── postsServices.ts
│   │   ├── academicEventsServices.ts
│   │   ├── linksServices.ts
│   │   ├── reactionsServices.ts
│   │   └── authServices.ts
│   ├── repository/        # Acesso aos dados (PostgreSQL)
│   │   ├── userRepository.ts
│   │   ├── postsRepository.ts
│   │   ├── academicEventsRepository.ts
│   │   ├── linksRepository.ts
│   │   └── reactionsRepository.ts
│   ├── middlewares/       # Middlewares Express
│   │   └── authMiddleware.ts
│   ├── utils/             # Utilitários
│   │   ├── auth.ts
│   │   └── http-helper.ts
│   └── data/              # Arquivos JSON usados durante a prototipagem
│       ├── user.json
│       ├── posts.json
│       ├── links.json
│       └── reactions.json
├── docs/                  # Frontend
│   ├── html/              # Páginas HTML
│   │   ├── index.html     # Página inicial com calendário
│   │   ├── eventos.html   # Página de eventos
│   │   ├── mural.html     # Mural de links
│   │   ├── sobre.html     # Página sobre o projeto
│   │   └── utils/         # Componentes reutilizáveis
│   │       └── perfil.html # Dropdown de perfil
│   ├── script/            # JavaScript do frontend
│   │   ├── login.js
│   │   ├── login-page.js
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
│   ├── assets/            # Imagens e ícones
│   │   ├── images/
│   │   └── uploads/      # Uploads de imagens
│   └── database/         # Scripts de banco de dados
│       ├── recreate_tables.cjs    # Recria todas as tabelas
│       ├── imports/
│       │   ├── importar_alunos.cjs    # Importa alunos do Excel
│       │   ├── importar_gestao.cjs     # Importa gestores do Excel
│       │   ├── importar_dados.cjs      # Importa posts e links
│       │   └── importar_eventos.cjs    # Importa eventos de exemplo
│       ├── update_passwords.cjs        # Atualiza senhas para texto plano
│       └── check_tables.cjs            # Verifica tabelas e contagens
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
- `POST /api/user/login` - Fazer login com matrícula e senha
- `GET /api/user/me` - Obter dados do usuário autenticado
- `POST /api/auth/change-password` - Alterar senha (autenticado)
- `POST /api/auth/forgot-password` - Recuperar senha

### Posts
- `GET /api/posts` - Listar todos os posts
- `GET /api/posts/:id` - Obter post por ID
- `POST /api/posts` - Criar post (Administradores e Coordenadores)
- `PUT /api/posts/:id` - Atualizar post (Administradores e Coordenadores)
- `DELETE /api/posts/:id` - Excluir post (Administradores e Coordenadores)
- `POST /api/posts/:id/emoji` - Adicionar/remover emoji (autenticado)

### Reações
- `GET /api/reactions/:postId` - Obter reações de um post
- `POST /api/reactions/:postId` - Adicionar/remover reação (autenticado)
- `DELETE /api/reactions/:postId` - Excluir reações de um post (Administradores e Coordenadores)

### Eventos Acadêmicos
- `GET /api/academic-events` - Listar eventos
- `GET /api/academic-events/date/:calendar` - Buscar por data
- `POST /api/academic-events` - Criar evento (Administradores e Coordenadores)
- `DELETE /api/academic-events/:id` - Excluir evento (Administradores e Coordenadores)

### Links
- `GET /api/links` - Listar links
- `POST /api/links` - Criar link (Administradores e Coordenadores)
- `PUT /api/links/:id` - Atualizar link (Administradores e Coordenadores)
- `DELETE /api/links/:id` - Excluir link (Administradores e Coordenadores)

## 👥 Roles e Permissões

| Role | Permissões |
|------|------------|
| **Aluno** | Visualizar posts, eventos, links; reagir a posts |
| **Professor** | Criar/editar posts; visualizar tudo; reagir a posts |
| **Coordenador** | Criar/excluir posts, eventos, links; gerenciar tudo |
| **Administrador** | Controle total do sistema |

## 🚀 Como Executar

### Instalação via GitHub

1. **Clone o repositório:**
```bash
git clone https://github.com/Washington-ux-ux/Projeto-senai-connect.git

cd Projeto-senai-connect
```

2. **Instale as dependências:**
```bash
npm install
```

### Pré-requisitos
- Node.js instalado
- PostgreSQL instalado e rodando
- npm ou yarn

### Configuração do Banco de Dados

Configure as variáveis de ambiente no arquivo `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=senai_connect
DB_USER=postgres
DB_PASSWORD=sua_senha
PORT=3000
JWT_SECRET=sua-chave-secreta-aqui
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

Execute o script de configuração completa:
```bash
npm run setup
```

Este script irá automaticamente:
- Criar o banco de dados se não existir
- Recriar todas as tabelas
- Importar alunos e gestores (se houver arquivos Excel)
- Importar posts e links
- Importar eventos de exemplo
- Atualizar senhas para texto plano (123321)

### Executar em desenvolvimento
```bash
npm run dev
```

O servidor será iniciado em `http://localhost:3000`

### Scripts Disponíveis
- `npm run setup` - Configuração completa do banco de dados (cria banco, tabelas e importa dados)
- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run create-db` - Cria as tabelas do banco de dados
- `npm run bd` - Importa alunos e gestores dos arquivos Excel
- `node docs/database/imports/importar_dados.cjs` - Importa posts e links
- `node docs/database/imports/importar_eventos.cjs` - Importa eventos de exemplo
- `node docs/database/update_passwords.cjs` - Atualiza senhas para texto plano (123321)
- `node docs/database/check_tables.cjs` - Verifica tabelas e contagens de registros

## 🔒 Segurança

- Senhas armazenadas em texto plano (para prototipagem)
- Autenticação via JWT com expiração de 24h
- Token contém userId, matricula e role
- Middleware de autenticação em rotas protegidas
- Autorização baseada em roles (RBAC)
- Identificação de usuário por matricula (única) em vez de ID

## 📊 Banco de Dados

O projeto utiliza PostgreSQL para persistência de dados. O esquema inclui as seguintes tabelas:

### Tabelas Principais
- **alunos** - Dados dos alunos (id, name, registration, role, password, createdat)
- **gestores** - Dados dos gestores/professores (id, name, registration, role, cargo, password, createdat)
- **posts** - Posts/comunicados (id, title, summary, category, visibility, author_name, author_id, reactions, attachmenturl, imageurl, eventdate, location, createdat)
- **links** - Links úteis (id, name, description, url, createdat)
- **academic_events** - Eventos acadêmicos (id, title, description, type, startDate, endDate, location, author_id, author_name, createdat)
- **reactions** - Reações aos posts (id, post_id, user_id, emoji, createdat)

### Importação de Dados
Os dados podem ser importados de arquivos Excel (alunos e gestores) usando os scripts em `docs/database/imports/`.

## 🎨 Páginas do Frontend

- **index.html** - Página inicial com calendário interativo
- **eventos.html** - Exibição de posts e eventos acadêmicos com sistema de reações
- **mural.html** - Mural de links úteis
- **sobre.html** - Informações sobre o projeto
- **Perfil (dropdown)** - Perfil do usuário com informações básicas

## 📈 Futuras Melhorias

- Sistema de notificações push
- Sistema de comentários nos posts
- Filtro de eventos por data/categoria
- Busca de eventos e links
- Sistema de favoritos para posts e links
- Perfil do usuário mais completo (bio, foto, etc.)
- Histórico de atividades do usuário
- Sistema de aprovação de posts (moderação)
- Analytics de engajamento
- Sistema de arquivos/documentos compartilhados
- Enquete/polls nos posts

## 👨‍💻 Desenvolvimento

Projeto desenvolvido para a disciplina de Desenvolvimento de Sistemas do SENAI.

## 📄 Licença

Este projeto é destinado para fins educacionais.
