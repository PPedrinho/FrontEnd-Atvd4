# Documentação da Aplicação Fullstack de Lista de Tarefas

## Visão Geral

Esta aplicação fullstack permite que usuários se registrem, façam login e gerenciem suas tarefas pessoais. O sistema possui autenticação JWT, validação de formulários, feedback visual e layout responsivo.

## Tecnologias Utilizadas

### Backend
- Node.js com Express
- TypeScript
- MongoDB Atlas (banco de dados em nuvem)
- JWT para autenticação
- Bcrypt para criptografia de senhas
- Express Validator para validação de dados
- CORS para comunicação segura entre frontend e backend

### Frontend
- React com TypeScript
- React Router para navegação
- React Toastify para mensagens de feedback
- Axios para requisições HTTP
- LocalStorage para armazenamento do token JWT
- CSS puro para estilização responsiva

## Estrutura do Projeto

```
fullstack-todo-app/
├── backend/               # API REST com Node.js e Express
│   ├── src/
│   │   ├── config/        # Configurações (banco de dados)
│   │   ├── controllers/   # Controladores de rotas
│   │   ├── middleware/    # Middlewares (autenticação)
│   │   ├── models/        # Modelos de dados (Mongoose)
│   │   ├── routes/        # Definição de rotas
│   │   └── index.ts       # Ponto de entrada da aplicação
│   ├── .env               # Variáveis de ambiente
│   ├── package.json       # Dependências do backend
│   └── tsconfig.json      # Configuração do TypeScript
│
├── frontend/              # Interface com React e TypeScript
│   ├── public/            # Arquivos estáticos
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── context/       # Contextos React (autenticação)
│   │   ├── pages/         # Páginas da aplicação
│   │   │   ├── auth/      # Páginas de autenticação
│   │   │   └── tasks/     # Páginas de tarefas
│   │   ├── services/      # Serviços de API
│   │   ├── styles/        # Arquivos CSS
│   │   ├── App.tsx        # Componente principal
│   │   └── index.tsx      # Ponto de entrada do React
│   ├── package.json       # Dependências do frontend
│   └── tsconfig.json      # Configuração do TypeScript
│
└── todo.md                # Checklist do projeto
```

## Funcionalidades

### Autenticação
- Registro de usuário com nome, email e senha
- Login com email e senha
- Proteção de rotas com JWT
- Logout

### Gerenciamento de Tarefas
- Criação de tarefas com título e descrição opcional
- Listagem de tarefas do usuário logado
- Marcação de tarefas como concluídas/pendentes
- Exclusão de tarefas

### Experiência do Usuário
- Feedback visual para ações (sucesso/erro)
- Indicadores de carregamento
- Layout responsivo para dispositivos móveis e desktop
- Validação de formulários

## Como Executar o Projeto

### Pré-requisitos
- Node.js (v14 ou superior)
- NPM ou Yarn
- MongoDB Atlas (conta e cluster configurados)

### Backend
1. Navegue até a pasta do backend:
   ```
   cd fullstack-todo-app/backend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env.example` para `.env`
   - Preencha a string de conexão do MongoDB Atlas e a chave secreta JWT

4. Inicie o servidor:
   ```
   npm run dev
   ```
   O servidor estará rodando em http://localhost:5000

### Frontend
1. Navegue até a pasta do frontend:
   ```
   cd fullstack-todo-app/frontend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Inicie a aplicação:
   ```
   npm start
   ```
   A aplicação estará rodando em http://localhost:3000

## Rotas da API

### Autenticação
- `POST /api/users/register` - Registrar novo usuário
- `POST /api/users/login` - Autenticar usuário
- `GET /api/users/profile` - Obter perfil do usuário (protegida)

### Tarefas
- `GET /api/tasks` - Listar todas as tarefas do usuário (protegida)
- `POST /api/tasks` - Criar nova tarefa (protegida)
- `GET /api/tasks/:id` - Obter tarefa específica (protegida)
- `PUT /api/tasks/:id` - Atualizar tarefa (protegida)
- `DELETE /api/tasks/:id` - Excluir tarefa (protegida)

## Considerações para Produção

Para deploy em ambiente de produção:

1. Configure variáveis de ambiente adequadas para produção
2. Ajuste a URL da API no frontend para apontar para o servidor de produção
3. Construa a versão otimizada do frontend com `npm run build`
4. Configure um servidor web para servir os arquivos estáticos do frontend
5. Configure um processo de gerenciamento para o backend (PM2, Docker, etc.)
6. Implemente HTTPS para comunicação segura
