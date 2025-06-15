const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');

module.exports = (authController) => {
    // Rota de cadastro
    router.post('/cadastro', (req, res) => authController.cadastrar(req, res));

    // Rota de login
    router.post('/login', (req, res) => authController.login(req, res));

    // Rota protegida para obter dados do usuário
    router.get('/usuario', verificarToken, (req, res) => authController.getUsuario(req, res));

    return router;
}; 