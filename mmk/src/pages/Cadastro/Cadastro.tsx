import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Cadastro.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [cidade, setCidade] = useState('São Paulo');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
    const navigate = useNavigate();

    const formatarCPF = (valor: string) => {
        const apenasNumeros = valor.replace(/\D/g, '');
        return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    };

    const formatarTelefone = (valor: string) => {
        const apenasNumeros = valor.replace(/\D/g, '');
        if (apenasNumeros.length === 11) {
            return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
        }
        return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/g, '($1) $2-$3');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem!');
            return;
        }

        if (senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        const cpfNumeros = cpf.replace(/\D/g, '');
        if (cpfNumeros.length !== 11) {
            setErro('CPF inválido');
            return;
        }

        const telefoneNumeros = telefone.replace(/\D/g, '');
        if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
            setErro('Telefone inválido');
            return;
        }

        setCarregando(true);

        try {
            await authService.cadastrar(nome, email, senha, telefone, cpf, cidade);

            navigate('/');
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao fazer cadastro');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="containerCadastro">
            <div className="cartaoCadastro">
                <h1 className="tituloCadastro">Criar Conta</h1>
                {erro && <p className="mensagemErro">{erro}</p>}
                <form onSubmit={handleSubmit} className="formularioCadastro">
                    <div className="campoFormulario">
                        <label htmlFor="nome">Nome Completo</label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Digite seu nome completo"
                            required
                            disabled={carregando}
                            minLength={3}
                        />
                    </div>
                    <div className="campoFormulario">
                        <label htmlFor="cpf">CPF</label>
                        <input
                            type="text"
                            id="cpf"
                            value={cpf}
                            onChange={(e) => setCpf(formatarCPF(e.target.value))}
                            placeholder="000.000.000-00"
                            required
                            disabled={carregando}
                            maxLength={14}
                        />
                    </div>
                    <div className="campoFormulario">
                        <label htmlFor="telefone">Telefone</label>
                        <input
                            type="text"
                            id="telefone"
                            value={telefone}
                            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                            placeholder="(00) 00000-0000"
                            required
                            disabled={carregando}
                            maxLength={15}
                        />
                    </div>
                    <div className="campoFormulario">
                        <label htmlFor="cidade">Cidade</label>
                        <input
                            type="text"
                            id="cidade"
                            value={cidade}
                            disabled={true}
                            title="No momento, atendemos apenas a cidade de São Paulo"
                        />
                    </div>
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
                                minLength={6}
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
                    <div className="campoFormulario">
                        <label htmlFor="confirmarSenha">Confirmar Senha</label>
                        <div className="campo-senha-container">
                            <input
                                type={mostrarConfirmarSenha ? 'text' : 'password'}
                                id="confirmarSenha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                placeholder="Confirme sua senha"
                                required
                                disabled={carregando}
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="botao-mostrar-senha"
                                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                aria-label={mostrarConfirmarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="botaoEntrar botaoCadastrar"
                        disabled={carregando}
                    >
                        {carregando ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>
                <p className="textoLogin">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="linkLogin">
                        Faça login
                    </Link>
                </p>
            </div>
        </div>
    );
} 