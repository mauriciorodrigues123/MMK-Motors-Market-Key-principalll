const express = require('express');
const cors = require('cors');
const jsonServer = require('json-server');
const path = require('path');

// Importa os módulos necessários
const AuthController = require('./controllers/authController');
const createAuthRoutes = require('./routes/authRoutes');

// Cria o servidor Express
const app = express();

// Middleware para CORS e parsing do body
app.use(cors());
app.use(express.json());

// Configura o caminho do banco de dados
const dbPath = path.join(__dirname, 'data', 'db.json');

// Configura o json-server
const jsonRouter = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

// Cria instância do controlador de autenticação
const authController = new AuthController(jsonRouter.db);

// Configura as rotas de autenticação
app.use('/api', createAuthRoutes(authController));

// Usa os middlewares padrão do json-server
app.use(middlewares);

// Usa o router do json-server para outras rotas
app.use('/api', jsonRouter);

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
});

// Inicia o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Banco de dados: ${dbPath}`);
}); 