const path = require('path');

module.exports = {
    // Caminho para o arquivo db.json
    dbPath: path.join(__dirname, '../data/db.json'),

    // Chave secreta para JWT
    secretKey: 'mmk-motors-secret-key-2024'
}; 