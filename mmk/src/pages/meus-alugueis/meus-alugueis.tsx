import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../componentes/header/header';
import { Footer } from '../../componentes/footer/footer';
import { authService, API_URL } from '../../services/authService';
import './meus-alugueis.css';

// Interface para os dados do aluguel
interface Aluguel {
    id: number;
    userId: string;
    carro: {
        id: number;
        nome: string;
        tipo: string;
        imagem: string;
    };
    periodo: {
        retirada: string;
        devolucao: string;
    };
    valorTotal: number;
    status: 'ativo' | 'concluido' | 'cancelado' | 'arquivado';
    dataPagamento: string;
}

const MeusAlugueis = () => {
    const navigate = useNavigate();
    const [alugueis, setAlugueis] = useState<Aluguel[]>([]);
    const [filtroStatus, setFiltroStatus] = useState<string>('todos');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Função para carregar os aluguéis do servidor
    const carregarAlugueis = async () => {
        setLoading(true);
        setError(null);
        const usuarioLogado = authService.getUsuario();
        if (!usuarioLogado) {
            navigate('/login', { state: { redirectTo: '/meus-alugueis' } });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/alugueis?userId=${usuarioLogado.id}`, {
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });
            if (!response.ok) {
                throw new Error('Erro ao carregar aluguéis.');
            }
            const data = await response.json();
            setAlugueis(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // Verifica se o usuário está autenticado e carrega os aluguéis
    useEffect(() => {
        carregarAlugueis();
    }, [navigate]);

    // Função para formatar valores monetários
    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    // Função para formatar data
    const formatarData = (data: string) => {
        if (!data) return '';
        return new Date(data).toLocaleDateString('pt-BR');
    };

    // Função para cancelar um aluguel
    const cancelarAluguel = async (id: number) => {
        if (window.confirm('Tem certeza que deseja cancelar este aluguel?')) {
            try {
                const response = await fetch(`${API_URL}/alugueis/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authService.getToken()}`
                    },
                    body: JSON.stringify({ status: 'cancelado' }),
                });

                if (!response.ok) {
                    throw new Error('Erro ao cancelar aluguel.');
                }

                // Atualiza o estado localmente
                setAlugueis(prevAlugueis =>
                    prevAlugueis.map(aluguel =>
                        aluguel.id === id ? { ...aluguel, status: 'cancelado' } : aluguel
                    )
                );
                alert('Aluguel cancelado com sucesso!');
            } catch (err) {
                setError((err as Error).message);
                alert(`Erro ao cancelar aluguel: ${(err as Error).message}`);
            }
        }
    };

    // Função para arquivar um aluguel
    const arquivarAluguel = async (id: number) => {
        if (window.confirm('Tem certeza que deseja arquivar este aluguel? Ele não aparecerá mais na lista de cancelados.')) {
            try {
                const response = await fetch(`${API_URL}/alugueis/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authService.getToken()}`
                    },
                    body: JSON.stringify({ status: 'arquivado' }),
                });

                if (!response.ok) {
                    throw new Error('Erro ao arquivar aluguel.');
                }

                // Atualiza o estado localmente
                setAlugueis(prevAlugueis =>
                    prevAlugueis.map(aluguel =>
                        aluguel.id === id ? { ...aluguel, status: 'arquivado' } : aluguel
                    )
                );
                alert('Aluguel arquivado com sucesso!');
            } catch (err) {
                setError((err as Error).message);
                alert(`Erro ao arquivar aluguel: ${(err as Error).message}`);
            }
        }
    };

    // Filtra os aluguéis com base no status selecionado
    const alugueisFiltrados = filtroStatus === 'todos'
        ? alugueis.filter(aluguel => aluguel.status !== 'cancelado' && aluguel.status !== 'arquivado')
        : alugueis.filter(aluguel => aluguel.status === filtroStatus);

    if (loading) {
        return (
            <div className="pagina-alugueis">
                <Header />
                <div className="container-principal">
                    <div className="container-alugueis">
                        <h1 className="titulo">Meus Aluguéis</h1>
                        <p className="sem-alugueis">Carregando aluguéis...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="pagina-alugueis">
                <Header />
                <div className="container-principal">
                    <div className="container-alugueis">
                        <h1 className="titulo">Meus Aluguéis</h1>
                        <p className="sem-alugueis">Erro ao carregar aluguéis: {error}</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="pagina-alugueis">
            <Header />

            <div className="container-principal">
                <div className="container-alugueis">
                    <h1 className="titulo">Meus Aluguéis</h1>

                    {/* Filtros */}
                    <div className="filtros">
                        <button
                            className={`filtro-botao ${filtroStatus === 'todos' ? 'ativo' : ''}`}
                            onClick={() => setFiltroStatus('todos')}
                        >
                            Todos
                        </button>
                        <button
                            className={`filtro-botao ${filtroStatus === 'ativo' ? 'ativo' : ''}`}
                            onClick={() => setFiltroStatus('ativo')}
                        >
                            Ativos
                        </button>
                        <button
                            className={`filtro-botao ${filtroStatus === 'concluido' ? 'ativo' : ''}`}
                            onClick={() => setFiltroStatus('concluido')}
                        >
                            Concluídos
                        </button>
                        <button
                            className={`filtro-botao ${filtroStatus === 'cancelado' ? 'ativo' : ''}`}
                            onClick={() => setFiltroStatus('cancelado')}
                        >
                            Cancelados
                        </button>
                    </div>

                    {/* Lista de Aluguéis */}
                    <div className="lista-alugueis">
                        {alugueisFiltrados.length === 0 ? (
                            <p className="sem-alugueis">Nenhum aluguel encontrado.</p>
                        ) : (
                            alugueisFiltrados.map(aluguel => (
                                <div key={aluguel.id} className={`cartao-aluguel ${aluguel.status}`}>
                                    <div className="aluguel-header">
                                        <div className="status-aluguel">
                                            <span className={`status-badge ${aluguel.status}`}>
                                                {aluguel.status.charAt(0).toUpperCase() + aluguel.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="data-pagamento">
                                            Pago em: {formatarData(aluguel.dataPagamento)}
                                        </div>
                                    </div>

                                    <div className="aluguel-conteudo">
                                        <img
                                            src={aluguel.carro?.imagem}
                                            alt={aluguel.carro?.nome}
                                            className="imagem-carro"
                                        />

                                        <div className="info-aluguel">
                                            <h3 className="nome-carro">{aluguel.carro?.nome}</h3>
                                            <p className="tipo-carro">{aluguel.carro?.tipo}</p>

                                            <div className="periodo-aluguel">
                                                <div className="data">
                                                    <strong>Retirada:</strong> {formatarData(aluguel.periodo?.retirada)}
                                                </div>
                                                <div className="data">
                                                    <strong>Devolução:</strong> {formatarData(aluguel.periodo?.devolucao)}
                                                </div>
                                            </div>

                                            <div className="valor-aluguel">
                                                <strong>Valor Total:</strong> {formatarMoeda(aluguel.valorTotal)}
                                            </div>
                                        </div>
                                    </div>

                                    {aluguel.status === 'ativo' && (
                                        <div className="aluguel-acoes">
                                            <button
                                                className="botao-cancelar"
                                                onClick={() => cancelarAluguel(aluguel.id)}
                                            >
                                                Cancelar Aluguel
                                            </button>
                                        </div>
                                    )}

                                    {aluguel.status === 'cancelado' && (
                                        <div className="aluguel-acoes">
                                            <button
                                                className="botao-remover-cancelado"
                                                onClick={() => arquivarAluguel(aluguel.id)}
                                            >
                                                Remover dos Cancelados
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export { MeusAlugueis }; 