const express = require('express');
const cors = require('cors');
const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

// Importa os módulos necessários
const AuthController = require('./controllers/authController');
const createAuthRoutes = require('./routes/authRoutes');

// Cria o servidor Express
const app = express();

// Middleware para CORS e parsing do body
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumenta o limite para imagens grandes

// Configura o caminho do banco de dados
const dbPath = path.join(__dirname, 'data', 'db.json');

// Verifica se o arquivo db.json existe e tem permissões de escrita
try {
    if (!fs.existsSync(dbPath)) {
        console.error('Arquivo db.json não encontrado em:', dbPath);
        process.exit(1);
    }

    // Testa permissões de escrita
    fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK);
    console.log('Permissões de acesso ao db.json verificadas com sucesso');
} catch (err) {
    console.error('Erro ao acessar db.json:', err);
    process.exit(1);
}

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
    console.error('Erro no servidor:', err);
    res.status(500).json({
        mensagem: 'Erro interno do servidor',
        erro: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Inicia o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Banco de dados: ${dbPath}`);
    console.log('Para acessar a API, use: http://localhost:3000/api');
}); 