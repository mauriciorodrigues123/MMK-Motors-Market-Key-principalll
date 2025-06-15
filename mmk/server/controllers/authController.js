const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/database');

class AuthController {
    constructor(db) {
        this.db = db;
    }

    async cadastrar(req, res) {
        try {
            const { nome, email, senha, telefone, cpf, cidade } = req.body;

            // Verifica se o usuário já existe
            const usuarios = this.db.get('usuarios').value();
            const usuarioExistente = usuarios.find(u => u.email === email);

            if (usuarioExistente) {
                return res.status(400).json({ mensagem: 'Email já cadastrado' });
            }

            // Validação do CPF (formato básico)
            if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
                return res.status(400).json({ mensagem: 'CPF inválido' });
            }

            // Validação do telefone (formato básico)
            if (!telefone || telefone.replace(/\D/g, '').length < 10) {
                return res.status(400).json({ mensagem: 'Telefone inválido' });
            }

            // Validação da cidade (apenas São Paulo)
            if (!cidade || cidade.toLowerCase() !== 'são paulo') {
                return res.status(400).json({ mensagem: 'No momento, atendemos apenas a cidade de São Paulo' });
            }

            // Cria novo usuário com os campos adicionais
            const novoUsuario = {
                id: Date.now().toString(),
                nome,
                email,
                senha,
                telefone,
                cpf,
                cidade,
                admin: false // Por padrão, novos usuários não são administradores
            };

            // Salva o usuário
            this.db.get('usuarios').push(novoUsuario).write();

            // Gera token
            const token = jwt.sign({ id: novoUsuario.id, email }, secretKey, { expiresIn: '24h' });

            res.status(201).json({
                token,
                usuario: {
                    id: novoUsuario.id,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email,
                    telefone: novoUsuario.telefone,
                    cpf: novoUsuario.cpf,
                    cidade: novoUsuario.cidade,
                    admin: novoUsuario.admin
                }
            });
        } catch (erro) {
            console.error('Erro ao cadastrar:', erro);
            res.status(500).json({ mensagem: 'Erro ao cadastrar usuário' });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;

            // Busca usuário
            const usuarios = this.db.get('usuarios').value();
            const usuario = usuarios.find(u => u.email === email);

            if (!usuario) {
                return res.status(401).json({ mensagem: 'Email ou senha incorretos' });
            }

            // Verifica senha (comparação direta)
            if (senha !== usuario.senha) {
                return res.status(401).json({ mensagem: 'Email ou senha incorretos' });
            }

            // Gera token
            const token = jwt.sign({ id: usuario.id, email }, secretKey, { expiresIn: '24h' });

            res.json({
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    admin: usuario.admin
                }
            });
        } catch (erro) {
            console.error('Erro ao fazer login:', erro);
            res.status(500).json({ mensagem: 'Erro ao fazer login' });
        }
    }

    getUsuario(req, res) {
        try {
            const usuarios = this.db.get('usuarios').value();
            const usuario = usuarios.find(u => u.id === req.usuario.id);

            if (!usuario) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }

            res.json({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                admin: usuario.admin
            });
        } catch (erro) {
            console.error('Erro ao buscar usuário:', erro);
            res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
        }
    }
}

module.exports = AuthController; 