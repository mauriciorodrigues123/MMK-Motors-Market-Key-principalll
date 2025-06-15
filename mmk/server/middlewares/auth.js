const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/database');

// Middleware para verificar token
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token) {
        jwt.verify(token.replace('Bearer ', ''), secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ mensagem: 'Token inválido' });
            }
            req.usuario = decoded;
            next();
        });
    } else {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }
};

module.exports = {
    verificarToken
}; 