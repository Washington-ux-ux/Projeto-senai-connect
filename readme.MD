# SENAI Connect


## 📌 Sobre o Projeto


O **SENAI Connect** é uma plataforma corporativa de comunicação interna desenvolvida para melhorar a interação entre alunos, professores, coordenação e direção do SENAI.


O sistema centraliza comunicados, mensagens, notificações e solicitações institucionais em um único ambiente digital, tornando a comunicação mais rápida, organizada e eficiente.


---


# 🎯 Objetivo


Desenvolver uma plataforma web responsiva que permita:


- Comunicação institucional eficiente
- Divulgação de comunicados oficiais
- Contato entre alunos e direção
- Organização acadêmica
- Centralização de informações
- Melhor experiência de comunicação interna


---


# 🏢 Público-Alvo


- Alunos
- Professores
- Coordenação
- Direção
- Administração do SENAI


---


# 🚀 Funcionalidades


## 🔐 Sistema de Login


- Login com autenticação JWT segura
- Recuperação de senha
- Controle de permissões por role
- Sessão de usuário
- Proteção de rotas com middleware


---


## 📢 Plataforma de Comunicados


- Publicação de avisos oficiais
- Comunicados urgentes
- Categorias de avisos
- Upload de arquivos
- Histórico de comunicados
- Pesquisa de comunicados
- Comentários e reações
- Criação de posts/eventos por ADMIN, DIRECTOR, COORDINATOR e TEACHER
- Exclusão de posts/eventos por ADMIN, DIRECTOR e COORDINATOR
- Atualização automática da página após criar/excluir


### Categorias
- Cursos
- Eventos (EVENT)
- Direção
- Estágios (INTERNSHIP)
- Manutenção
- Acadêmico
- Apresentações (PRESENTATION)
- Anúncios (ANNOUNCEMENT)


---


## 💬 Comunicação com a Direção


- Envio de mensagens privadas
- Solicitações formais
- Sistema de protocolos
- Agendamento de reuniões
- Feedback institucional


### Status das solicitações
- Enviada
- Em análise
- Respondida
- Finalizada


---


## 🧑‍🤝‍🧑 Chat Corporativo


- Conversas privadas
- Grupos por turma
- Grupos por curso
- Compartilhamento de arquivos
- Mensagens em tempo real
- Mensagens fixadas


---


## 🔔 Sistema de Notificações


- Notificações em tempo real
- Avisos importantes
- Alertas acadêmicos
- Mudança de sala
- Eventos do SENAI
- Atividades disponíveis


---


## 📅 Organização Acadêmica


- Calendário escolar
- Agenda de provas
- Horários de aula
- Eventos
- Mural da turma


---


## 📊 Painel Administrativo


- Gerenciamento de usuários
- Criação de alunos por ADMIN, DIRECTOR e COORDINATOR
- Controle de comunicados
- Relatórios do sistema
- Estatísticas de acesso
- Controle de permissões por role


---


# 👥 Tipos de Usuários


| Usuário | Permissões |
|---|---|
| Aluno | Visualizar comunicados, eventos e enviar solicitações |
| Professor | Criar posts/eventos, enviar mensagens para turmas |
| Coordenação | Criar/excluir posts/eventos, criar alunos, gerenciar solicitações |
| Direção | Criar/excluir posts/eventos, criar alunos, gerenciar solicitações |
| Administrador | Controle total do sistema, criar/excluir posts/eventos e alunos |


---


# 🧠 Funcionalidades Extras


## 🤖 Inteligência Artificial
- Resumo automático de comunicados
- Organização automática de mensagens


## 🌙 Tema Escuro
- Interface moderna
- Melhor experiência visual


## 📱 Responsividade
- Compatível com celulares
- Compatível com tablets
- Compatível com computadores


## 📈 Dashboard
- Gráficos
- Métricas do sistema
- Usuários ativos


## 🏆 Gamificação
- Sistema de pontos
- Medalhas
- Participação dos alunos


---


# 🛠️ Tecnologias Utilizadas


## Front-end
- HTML5
- CSS3
- JavaScript
- TypeScript (para scripts)


## Back-end
- Node.js
- Express
- TypeScript


## Banco de Dados
- JSON (armazenamento temporário)
- Planejado: MySQL


## Autenticação
- JWT (JSON Web Tokens)
- bcrypt (criptografia de senhas)


## Ferramentas
- GitHub
- Figma
- Postman
- tsx (execução TypeScript)


---


# 🧱 Arquitetura do Sistema


```bash
Frontend → API REST → Banco de Dados
```


---


# 📂 Estrutura do Projeto


```bash
senai-connect/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   └── database/
│
├── docs/
│
└── README.md
```


---


# 🔒 Segurança


- Autenticação JWT com tokens seguros
- Criptografia de senhas com bcrypt
- Controle de acesso por role (RBAC)
- Proteção de rotas com middleware
- Validação de dados
- Autorização baseada em roles (ADMIN, DIRECTOR, COORDINATOR, TEACHER, STUDENT)


---


# 📋 Requisitos Funcionais


- Usuário deve conseguir realizar login
- Direção deve publicar comunicados
- Alunos devem enviar solicitações
- Sistema deve enviar notificações
- Usuários devem participar de chats
- Administração deve gerenciar usuários


---


# ⚙️ Requisitos Não Funcionais


- Sistema responsivo
- Interface intuitiva
- Alta disponibilidade
- Segurança de dados
- Boa performance


---


# 📌 Diferenciais do Projeto


- Comunicação centralizada
- Interface moderna
- Organização institucional
- Sistema em tempo real
- Dashboard administrativo
- Integração acadêmica


---


# 🎨 Protótipos


Os protótipos da interface serão desenvolvidos no Figma.


---


# 📖 Documentação


O projeto contará com:


- Diagrama UML
- Casos de uso
- DER do banco de dados
- API REST documentada
- Protótipos de interface


---


# 📈 Futuras Melhorias


- Aplicativo mobile
- Videochamadas
- Integração com e-mail
- Chat com IA
- QR Code para presença
- Sistema de enquetes


---


# 👨‍💻 Desenvolvedores


Projeto desenvolvido para a disciplina de Desenvolvimento de Sistemas.


---


# 📄 Licença


Este projeto é destinado para fins educacionais.
