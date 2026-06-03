# Requisitos do Projeto SENAI Connect

## Requisitos Funcionais

### RF-01: Autenticação de Usuários
- O sistema deve permitir que usuários se cadastrem com nome, email, senha, CPF, matrícula, role, curso (opcional), gênero e data de nascimento
- O sistema deve permitir que usuários façam login utilizando email e senha
- O sistema deve criptografar senhas usando bcrypt antes de armazená-las
- O sistema deve gerar tokens JWT para autenticação após login bem-sucedido
- O sistema deve permitir que usuários façam logout
- O sistema deve manter sessão ativa via localStorage com token JWT

### RF-02: Gestão de Roles e Permissões
- O sistema deve suportar os seguintes roles: STUDENT, TEACHER, COORDINATOR, DIRECTOR, ADMIN
- O sistema deve controlar acesso a rotas baseado em roles
- O sistema deve permitir que usuários com role COORDINATOR e ADMIN criem novos usuários
- O sistema deve permitir que usuários com role ADMIN tenham controle total do sistema

### RF-03: Plataforma de Posts/Comunicados
- O sistema deve permitir que usuários com roles TEACHER, COORDINATOR e ADMIN criem posts
- O sistema deve permitir que usuários com roles COORDINATOR e ADMIN excluam posts
- O sistema deve suportar categorias de posts: EVENT, INTERNSHIP, PRESENTATION, ANNOUNCEMENT
- O sistema deve permitir configuração de visibilidade: ALL, STUDENT, TEACHER, COORDINATOR
- O sistema deve permitir que usuários adicionem reações (emojis) aos posts
- O sistema deve permitir adicionar e remover reações
- O sistema deve suportar resumo automático de posts via IA (endpoint disponível)
- O sistema deve listar todos os posts publicamente
- O sistema deve permitir buscar posts por ID

### RF-04: Eventos Acadêmicos
- O sistema deve permitir que usuários com roles COORDINATOR e ADMIN criem eventos acadêmicos
- O sistema deve permitir que usuários com roles COORDINATOR e ADMIN excluam eventos acadêmicos
- O sistema deve suportar tipos de eventos: EXAM, HOLIDAY, PRESENTATION, WORK
- O sistema deve permitir adicionar localização aos eventos
- O sistema deve listar todos os eventos acadêmicos publicamente
- O sistema deve permitir buscar eventos por data/calendário
- O sistema deve exibir eventos acadêmicos e posts de forma unificada na página de eventos
- O sistema deve implementar paginação mostrando 6 eventos por página
- O sistema deve exibir botão "Mostrar mais" quando houver mais de 6 eventos

### RF-05: Mural de Links
- O sistema deve permitir que todos os usuários visualizem links úteis
- O sistema deve permitir que usuários com roles COORDINATOR e ADMIN criem links
- O sistema deve permitir que usuários com roles COORDINATOR e ADMIN editem links
- O sistema deve permitir que usuários com roles COORDINATOR e ADMIN excluam links
- O sistema deve exibir links em formato de tabela
- O sistema deve permitir acessar links externos
- O sistema deve ordenar links alfabeticamente por nome

### RF-06: Sistema de Solicitações
- O sistema deve permitir que alunos enviem solicitações
- O sistema deve suportar status de solicitações: SENT, ANALYZING, RESPONDED, FINISHED
- O sistema deve gerar protocolos para solicitações
- O sistema deve permitir agendamento de reuniões
- O sistema deve permitir listar todas as solicitações (para administradores)
- O sistema deve permitir listar solicitações do usuário autenticado
- O sistema deve permitir atualizar status e conteúdo de resposta das solicitações

### RF-07: Chat Corporativo
- O sistema deve permitir criar salas de chat (PRIVATE, GROUP)
- O sistema deve permitir listar salas de chat disponíveis
- O sistema deve permitir listar mensagens de uma sala específica
- O sistema deve suportar mensagens com arquivos anexos
- O sistema deve permitir fixar mensagens importantes
- O sistema deve gerenciar membros em salas de grupo

### RF-08: Interface do Usuário
- O sistema deve oferecer tema claro e escuro
- O sistema deve implementar calendário interativo na página inicial
- O sistema deve exibir menu de usuário com dropdown
- O sistema deve oferecer modais para criação de posts, usuários e links
- O sistema deve ser responsivo para diferentes tamanhos de tela
- O sistema deve exibir perfil do usuário logado
- O sistema deve permitir alternar entre temas claro/escuro

### RF-09: Navegação
- O sistema deve oferecer página inicial com calendário
- O sistema deve oferecer página de eventos
- O sistema deve oferecer página de mural de links
- O sistema deve oferecer página sobre o projeto
- O sistema deve oferecer página de perfil do usuário

## Requisitos Não Funcionais

### RNF-01: Segurança
- O sistema deve criptografar senhas usando bcrypt com salt de 10 rounds
- O sistema deve utilizar tokens JWT com expiração de 24 horas
- O sistema deve validar tokens em todas as rotas protegidas
- O sistema deve implementar controle de acesso baseado em roles (RBAC)
- O sistema deve validar dados de entrada nos controllers
- O sistema deve proteger contra ataques de injeção
- O sistema deve não expor senhas em logs ou respostas de API

### RNF-02: Performance
- O sistema deve responder a requisições de API em menos de 500ms para operações simples
- O sistema deve carregar a página inicial em menos de 2 segundos
- O sistema deve implementar paginação para listas grandes (6 itens por página)
- O sistema deve otimizar consultas ao banco de dados JSON

### RNF-03: Usabilidade
- O sistema deve oferecer interface intuitiva e fácil de usar
- O sistema deve fornecer feedback visual para ações do usuário
- O sistema deve exibir mensagens de erro claras e compreensíveis
- O sistema deve oferecer confirmação para ações destrutivas (exclusão)
- O sistema deve ser acessível para usuários com diferentes níveis de habilidade técnica

### RNF-04: Compatibilidade
- O sistema deve ser compatível com navegadores modernos (Chrome, Firefox, Edge, Safari)
- O sistema deve funcionar em diferentes tamanhos de tela (desktop, tablet, mobile)
- O sistema deve suportar resoluções mínimas de 320px de largura
- O sistema deve funcionar corretamente em temas claro e escuro

### RNF-05: Confiabilidade
- O sistema deve estar disponível 99% do tempo durante horário comercial
- O sistema deve recuperar-se de falhas sem perda de dados
- O sistema deve manter integridade dos dados armazenados
- O sistema deve implementar tratamento de erros apropriado

### RNF-06: Escalabilidade
- O sistema deve suportar até 1000 usuários simultâneos na fase de prototipagem
- O sistema deve permitir migração fácil para banco de dados relacional (MySQL/PostgreSQL)
- O sistema deve ser modular para facilitar adição de novas funcionalidades

### RNF-07: Manutenibilidade
- O sistema deve seguir padrões de código TypeScript
- O sistema deve ter estrutura de pastas organizada e lógica
- O sistema deve separar concerns (controllers, services, repository)
- O sistema deve ter comentários em código quando necessário
- O sistema deve seguir princípios SOLID

### RNF-08: Documentação
- O sistema deve ter README atualizado com instruções de uso
- O sistema deve documentar endpoints da API
- O sistema deve ter requisitos funcionais e não funcionais documentados
- O sistema deve ter estrutura de projeto documentada

### RNF-09: Armazenamento de Dados
- O sistema deve utilizar arquivos JSON para prototipagem
- O sistema deve manter estrutura consistente nos arquivos JSON
- O sistema deve permitir fácil migração para banco de dados relacional
- O sistema deve validar dados antes de persistir

### RNF-10: Desenvolvimento
- O sistema deve usar TypeScript para type safety
- O sistema deve usar tsx para execução de TypeScript
- O sistema deve ter scripts npm para desenvolvimento (npm run dev)
- O sistema deve usar variáveis de ambiente para configuração sensível
