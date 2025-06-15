// Interface para o usuário
interface Usuario {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    cidade: string;
    admin?: boolean; // Campo opcional para indicar se o usuário é administrador
}

// Interface para resposta da API
interface RespostaAuth {
    token: string;
    usuario: Usuario;
}

// URL base da API
export const API_URL = 'http://localhost:3000/api';

// Serviço de autenticação
export const authService = {
    // Função de login
    async login(email: string, senha: string): Promise<RespostaAuth> {
        const resposta = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.mensagem || 'Erro ao fazer login');
        }

        const dados = await resposta.json();

        // Salva o token e usuário no localStorage
        localStorage.setItem('token', dados.token);
        localStorage.setItem('usuario', JSON.stringify(dados.usuario));

        return dados;
    },

    // Função de cadastro
    async cadastrar(
        nome: string,
        email: string,
        senha: string,
        telefone: string,
        cpf: string,
        cidade: string
    ): Promise<RespostaAuth> {
        const resposta = await fetch(`${API_URL}/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email, senha, telefone, cpf, cidade }),
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.mensagem || 'Erro ao cadastrar usuário');
        }

        const dados = await resposta.json();

        // Salva o token e usuário no localStorage
        localStorage.setItem('token', dados.token);
        localStorage.setItem('usuario', JSON.stringify(dados.usuario));

        return dados;
    },

    // Função para verificar se está autenticado
    isAutenticado(): boolean {
        return !!localStorage.getItem('token');
    },

    // Função para verificar se o usuário é administrador
    isAdmin(): boolean {
        const usuario = this.getUsuario();
        return usuario?.admin === true;
    },

    // Função para obter o usuário atual
    getUsuario(): Usuario | null {
        const usuarioString = localStorage.getItem('usuario');
        return usuarioString ? JSON.parse(usuarioString) : null;
    },

    // Função para obter o token
    getToken(): string | null {
        return localStorage.getItem('token');
    },

    // Função de logout
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }
}; 