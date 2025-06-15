import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Interface para os dados de redirecionamento
interface LocationState {
    redirectTo?: string;
    locacaoData?: {
        carro: any;
        locacao: any;
    };
}

export function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            // Tenta fazer login
            await authService.login(email, senha);

            // Verifica se há um redirecionamento pendente
            if (state?.redirectTo) {
                navigate(state.redirectTo, {
                    state: {
                        locacaoData: state.locacaoData
                    }
                });
            } else {
                // Redireciona para a página inicial se não houver redirecionamento pendente
                navigate('/');
            }
        } catch (error) {
            // Exibe mensagem de erro
            setErro(error instanceof Error ? error.message : 'Erro ao fazer login');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="containerLogin">
            <div className="cartaoLogin">
                <h1 className="tituloLogin">Bem-vindo</h1>
                {erro && <p className="mensagemErro">{erro}</p>}
                <form onSubmit={handleSubmit} className="formularioLogin">
                    <div className="campoFormulario">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu e-mail"
                            required
                            disabled={carregando}
                        />
                    </div>
                    <div className="campoFormulario">
                        <label htmlFor="senha">Senha</label>
                        <div className="campo-senha-container">
                            <input
                                type={mostrarSenha ? 'text' : 'password'}
                                id="senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Digite sua senha"
                                required
                                disabled={carregando}
                            />
                            <button
                                type="button"
                                className="botao-mostrar-senha"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="botaoEntrar"
                        disabled={carregando}
                    >
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <p className="textoRegistro">
                    Não tem uma conta?{' '}
                    <Link to="/cadastro" className="linkCadastro">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
} 