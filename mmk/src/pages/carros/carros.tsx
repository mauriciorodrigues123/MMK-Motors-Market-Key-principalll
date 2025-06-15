import { useState, useEffect } from "react"
import "./carros.css"
import { Header } from "../../componentes/header/header";
import { Footer } from "../../componentes/footer/footer";
import { useNavigate, useLocation } from "react-router-dom";
import { authService, API_URL } from "../../services/authService";
import { FaSearch, FaGasPump, FaDoorOpen, FaCogs, FaUsers, FaTachometerAlt, FaCarAlt } from 'react-icons/fa';

// Interface para definição do objeto Carro
interface Carro {
    id: number;
    nome: string;
    tipo: string;
    precoTotal: number;
    imagem: string;
    especificacoes: {
        cambio: string;
        lugares: string;
        motor: string;
        combustivel: string;
        portas: string;
        consumoKmPorLitro: string;
    };
    kmPorMes?: number;
    multaPorKm?: number;
}

// Interface para definição do objeto Locação
interface Locacao {
    retirada: {
        data: string;
        local: string;
    };
    devolucao: {
        data: string;
        local: string;
    };
    kmEstimado: number;
}

// Função para formatar valores monetários em reais
const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};

// Função para formatar quilometragem
const formatarKm = (km: number) => {
    return new Intl.NumberFormat('pt-BR').format(km);
};

// Função para formatar data
const formatarData = (data: string) => {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
};

// Função principal do componente Carros
export function Carros() {
    // Estados para controle do modal e dados da locação
    const navigate = useNavigate();
    const location = useLocation();
    const [modalAberto, setModalAberto] = useState(false);
    const [carroSelecionado, setCarroSelecionado] = useState<Carro | null>(null);
    const [carros, setCarros] = useState<Carro[]>([]);
    const [etapaAtual, setEtapaAtual] = useState(1);
    const [kmEstimado, setKmEstimado] = useState(1000);
    const [debugValue, setDebugValue] = useState('');
    const [locacao, setLocacao] = useState<Locacao>({
        retirada: {
            data: '',
            local: ''
        },
        devolucao: {
            data: '',
            local: ''
        },
        kmEstimado: 1000
    });
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Carros estáticos (já existentes) - REMOVIDOS
    // const carrosEstaticos: Carro[] = [];

    // Efeito para carregar os carros do db.json
    useEffect(() => {
        const fetchCarros = async () => {
            try {
                const response = await fetch(`${API_URL}/carros`);
                if (!response.ok) {
                    throw new Error('Erro ao carregar carros');
                }
                const data: Carro[] = await response.json();
                // Adiciona kmPorMes e multaPorKm se não existirem (para compatibilidade)
                const carrosComPadroes = data.map(carro => ({
                    ...carro,
                    kmPorMes: carro.kmPorMes || 2000,
                    multaPorKm: carro.multaPorKm || 2.50
                }));
                setCarros(carrosComPadroes);
            } catch (error) {
                console.error('Erro ao carregar carros:', error);
                alert('Erro ao carregar carros.');
            }
        };

        fetchCarros();
    }, []);

    // Efeito para restaurar dados da locação após login
    useEffect(() => {
        const state = location.state as { locacaoData?: { carro: Carro; locacao: Locacao } };
        if (state?.locacaoData) {
            setCarroSelecionado(state.locacaoData.carro);
            setLocacao(state.locacaoData.locacao);
            setModalAberto(true);
            // Limpa o state para evitar loop
            navigate(location.pathname, { replace: true });
        }
    }, [location.state]);

    // Função para atualizar a quilometragem
    const handleKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setDebugValue(`Valor Novo: ${value}`);
        setKmEstimado(value);
        setLocacao(prev => ({
            ...prev,
            kmEstimado: value
        }));
    };

    const abrirModal = (carro: Carro) => {
        setCarroSelecionado(carro);
        setModalAberto(true);
        setEtapaAtual(1);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setCarroSelecionado(null);
        setEtapaAtual(1);
    };

    const avancarEtapa = () => {
        if (etapaAtual < 3) {
            setEtapaAtual(etapaAtual + 1);
        }
    };

    const voltarEtapa = () => {
        if (etapaAtual > 1) {
            setEtapaAtual(etapaAtual - 1);
        }
    };

    // Função para atualizar os dados da locação
    const atualizarLocacao = (campo: string, subcampo: string | null, valor: any) => {
        if (subcampo) {
            setLocacao(prev => {
                const novoEstado = { ...prev };
                if (campo in novoEstado) {
                    const campoAtual = novoEstado[campo as keyof typeof prev];
                    if (typeof campoAtual === 'object' && campoAtual !== null) {
                        (novoEstado[campo as keyof typeof prev] as any)[subcampo] = valor;
                    }
                }
                return novoEstado;
            });
        } else {
            setLocacao(prev => {
                const novoEstado = { ...prev };
                novoEstado[campo as keyof typeof prev] = valor;
                return novoEstado;
            });
        }
    };

    // Função para calcular o valor total da locação
    const calcularValorTotal = () => {
        if (!carroSelecionado) return 0;

        // Calcula a diferença em dias entre as datas
        const dataRetirada = new Date(locacao.retirada.data);
        const dataDevolucao = new Date(locacao.devolucao.data);
        const diferencaDias = Math.ceil((dataDevolucao.getTime() - dataRetirada.getTime()) / (1000 * 60 * 60 * 24));

        // Calcula o valor base para o período
        const valorBase = carroSelecionado.precoTotal * (diferencaDias / 30);

        // Calcula o valor adicional se houver quilometragem excedente
        let valorAdicional = 0;
        if (locacao.kmEstimado > carroSelecionado.kmPorMes!) {
            const kmExcedente = locacao.kmEstimado - carroSelecionado.kmPorMes!;
            valorAdicional = kmExcedente * carroSelecionado.multaPorKm!;
        }

        return valorBase + valorAdicional;
    };

    const finalizarLocacao = async () => {
        if (!authService.isAutenticado()) {
            navigate('/login', {
                state: {
                    redirectTo: '/carros',
                    locacaoData: {
                        carro: carroSelecionado,
                        locacao: locacao
                    }
                }
            });
            return;
        }

        if (!carroSelecionado || !locacao.retirada.data || !locacao.devolucao.data || !locacao.retirada.local || !locacao.devolucao.local) {
            alert('Por favor, preencha todos os detalhes da locação.');
            return;
        }

        const novoAluguel = {
            // id será gerado automaticamente pelo JSON Server
            userId: authService.getUsuario()?.id, // Associa o aluguel ao usuário logado
            carro: {
                id: carroSelecionado.id,
                nome: carroSelecionado.nome,
                tipo: carroSelecionado.tipo,
                imagem: carroSelecionado.imagem,
            },
            periodo: {
                retirada: locacao.retirada.data,
                devolucao: locacao.devolucao.data,
            },
            valorTotal: calcularValorTotal(),
            status: 'ativo',
            dataPagamento: new Date().toISOString(),
        };

        try {
            const response = await fetch(`${API_URL}/alugueis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}` // Envia o token de autenticação
                },
                body: JSON.stringify(novoAluguel),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || 'Erro ao finalizar locação');
            }

            // Redireciona para a página de pagamento com os dados da locação
            navigate('/pagamento', {
                state: {
                    dadosLocacao: {
                        carro: carroSelecionado,
                        periodo: `${formatarData(locacao.retirada.data)} - ${formatarData(locacao.devolucao.data)}`,
                        valorTotal: calcularValorTotal()
                    }
                }
            });
            setModalAberto(false); // Fecha o modal após a locação bem-sucedida
            setCarroSelecionado(null); // Limpa o carro selecionado
            setEtapaAtual(1); // Reinicia as etapas
            setLocacao({ // Reinicia os dados da locação
                retirada: { data: '', local: '' },
                devolucao: { data: '', local: '' },
                kmEstimado: 1000,
            });

        } catch (error) {
            console.error('Erro ao finalizar locação:', error);
            alert(`Erro ao finalizar locação: ${(error as Error).message}`);
        }
    };

    const renderizarEtapa = () => {
        switch (etapaAtual) {
            case 1:
                return (
                    <div className="etapa-conteudo">
                        <h3>Detalhes da Locação</h3>
                        <div className="grupo-campos">
                            {/* Local e Data de Retirada */}
                            <div className="campo-grupo">
                                <h4>Retirada</h4>
                                <div className="campo">
                                    <label>Local</label>
                                    {/* Campo de seleção única para local de retirada */}
                                    <select
                                        value={locacao.retirada.local}
                                        onChange={(e) => atualizarLocacao('retirada', 'local', e.target.value)}
                                    >
                                        <option value="">Selecione o local</option>
                                        <option value="Loja MMK">Loja MMK</option>
                                    </select>
                                </div>
                                <div className="campo">
                                    <label>Data</label>
                                    <input
                                        type="date"
                                        value={locacao.retirada.data}
                                        onChange={(e) => atualizarLocacao('retirada', 'data', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            {/* Local e Data de Devolução */}
                            <div className="campo-grupo">
                                <h4>Devolução</h4>
                                <div className="campo">
                                    <label>Local</label>
                                    {/* Campo de seleção única para local de devolução */}
                                    <select
                                        value={locacao.devolucao.local}
                                        onChange={(e) => atualizarLocacao('devolucao', 'local', e.target.value)}
                                    >
                                        <option value="">Selecione o local</option>
                                        <option value="Loja MMK">Loja MMK</option>
                                    </select>
                                </div>
                                <div className="campo">
                                    <label>Data</label>
                                    <input
                                        type="date"
                                        value={locacao.devolucao.data}
                                        onChange={(e) => atualizarLocacao('devolucao', 'data', e.target.value)}
                                        min={locacao.retirada.data || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            {/* Quilometragem Estimada */}
                            <div className="campo-grupo">
                                <h4>Quilometragem</h4>
                                <div className="campo">
                                    <label>Quilometragem Estimada: {formatarKm(kmEstimado)} km</label>
                                    <input
                                        type="range"
                                        min={1000}
                                        max={3500}
                                        step={100}
                                        value={kmEstimado}
                                        onChange={handleKmChange}
                                    />
                                    {debugValue && <p style={{ color: 'red' }}>{debugValue}</p>}
                                </div>
                                <div className="info-km">
                                    <p>Limite de KM permitido: {formatarKm(carroSelecionado?.kmPorMes || 0)} km</p>
                                    <p>Valor por KM excedente: {formatarMoeda(carroSelecionado?.multaPorKm || 0)}</p>
                                    {kmEstimado > (carroSelecionado?.kmPorMes || 0) && (
                                        <p className="aviso-km">
                                            Atenção: A quilometragem estimada excede o limite.
                                            Será cobrado {formatarMoeda(carroSelecionado?.multaPorKm || 0)} por km excedente.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Especificações Detalhadas no Modal */}
                            {carroSelecionado && (
                                <div className="campo-grupo detalhes-especificacoes-modal">
                                    <h4>Especificações Detalhadas</h4>
                                    <ul>
                                        <li><strong>Câmbio:</strong> {carroSelecionado.especificacoes.cambio}</li>
                                        <li><strong>Lugares:</strong> {carroSelecionado.especificacoes.lugares}</li>
                                        <li><strong>Motor:</strong> {carroSelecionado.especificacoes.motor}</li>
                                        <li><strong>Combustível:</strong> {carroSelecionado.especificacoes.combustivel}</li>
                                        <li><strong>Portas:</strong> {carroSelecionado.especificacoes.portas}</li>
                                        <li><strong>KM por Litro:</strong> {carroSelecionado.especificacoes.consumoKmPorLitro}</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="etapa-conteudo">
                        <h3>Resumo da Locação</h3>
                        <div className="resumo-locacao">
                            <div className="resumo-carro">
                                <img src={carroSelecionado?.imagem} alt={carroSelecionado?.nome} />
                                <div className="info-resumo">
                                    <h4>Data: {formatarData(locacao.retirada.data)}</h4>
                                    <p>{carroSelecionado?.tipo}</p>
                                </div>
                            </div>

                            <div className="resumo-periodo">
                                <h4>Período</h4>
                                <div className="periodo-info">
                                    <div>
                                        <strong>Retirada</strong>
                                        <p>Data: {formatarData(locacao.retirada.data)}</p>
                                        <p>Local: {locacao.retirada.local}</p>
                                    </div>
                                    <div>
                                        <strong>Devolução</strong>
                                        <p>Data: {formatarData(locacao.devolucao.data)}</p>
                                        <p>Local: {locacao.devolucao.local}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="resumo-km">
                                <h4>Detalhes da Quilometragem</h4>
                                <ul>
                                    <li>
                                        <span>Quilometragem estimada:</span>
                                        <strong>{formatarKm(locacao.kmEstimado)} km</strong>
                                    </li>
                                    <li>
                                        <span>Limite de quilometragem:</span>
                                        <strong>{formatarKm(carroSelecionado?.kmPorMes || 0)} km</strong>
                                    </li>
                                    <li>
                                        <span>Valor por km excedente:</span>
                                        <strong>{formatarMoeda(carroSelecionado?.multaPorKm || 0)}</strong>
                                    </li>
                                </ul>
                            </div>

                            <div className="resumo-valor">
                                <h4>Valor Total</h4>
                                <span className="valor-total">{formatarMoeda(calcularValorTotal())}</span>
                                <span className="valor-mensal">
                                    {formatarMoeda(carroSelecionado?.precoTotal || 0)} por mês
                                </span>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Filtra os carros com base no termo de busca
    const carrosFiltrados = carros.filter(carro =>
        carro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        carro.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pagina-modelos">
            <Header />

            <div className="container-principal">
                <div className="container-modelos">
                    <h1 className="titulo">Selecione um Veículo</h1>

                    <div className="carros-header">
                        <div className="search-bar">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar carro por nome ou tipo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>

                    <div className="lista-carros">
                        {carrosFiltrados.length === 0 ? (
                            <p className="no-results">Nenhum carro encontrado com o termo "{searchTerm}".</p>
                        ) : (
                            carrosFiltrados.map(carro => (
                                <div key={carro.id} className="cartao-carro" onClick={() => abrirModal(carro)}>
                                    <div className="carro-flex">
                                        <img src={carro.imagem} alt={carro.nome} className="imagem-carro" />
                                        <div className="info-carro">
                                            <div className="info-principal">
                                                <h3 className="nome-carro">{carro.nome}</h3>
                                                <p className="tipo-carro">{carro.tipo}</p>
                                            </div>
                                            <div className="especificacoes">
                                                <p className="especificacao-item"><FaCogs className="icone" /><span className="especificacao-texto">Câmbio: {carro.especificacoes.cambio}</span></p>
                                                <p className="especificacao-item"><FaUsers className="icone" /><span className="especificacao-texto">Lugares: {carro.especificacoes.lugares}</span></p>
                                                <p className="especificacao-item"><FaCarAlt className="icone" /><span className="especificacao-texto">Motor: {carro.especificacoes.motor}</span></p>
                                                <p className="especificacao-item"><FaGasPump className="icone" /><span className="especificacao-texto">Combustível: {carro.especificacoes.combustivel}</span></p>
                                                <p className="especificacao-item"><FaDoorOpen className="icone" /><span className="especificacao-texto">Portas: {carro.especificacoes.portas}</span></p>
                                                <p className="especificacao-item"><FaTachometerAlt className="icone" /><span className="especificacao-texto">KM por Litro: {carro.especificacoes.consumoKmPorLitro}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="preco-selecionar">
                                        <div className="precos">
                                            <span className="preco-total">{formatarMoeda(carro.precoTotal)}</span>
                                            <span className="texto-total">por mês</span>
                                        </div>
                                        <button className="botao-selecionar" onClick={(e) => {
                                            e.stopPropagation(); // Evita que o clique no botão abra o modal duas vezes
                                            abrirModal(carro);
                                        }}>
                                            Selecionar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {modalAberto && carroSelecionado && (
                <div className="modal-overlay">
                    <div className="modal-conteudo">
                        <button className="botao-fechar" onClick={fecharModal}>×</button>

                        <div className="modal-header">
                            <div className="etapas-progresso">
                                <div className={`etapa ${etapaAtual >= 1 ? 'ativa' : ''}`}>1. Detalhes</div>
                                <div className={`etapa ${etapaAtual >= 2 ? 'ativa' : ''}`}>2. Resumo</div>
                            </div>
                        </div>

                        <div className="modal-body">
                            {renderizarEtapa()}
                        </div>

                        <div className="modal-footer">
                            {etapaAtual > 1 && (
                                <button className="botao-voltar" onClick={voltarEtapa}>
                                    Voltar
                                </button>
                            )}
                            {etapaAtual < 3 ? (
                                <button className="botao-avancar" onClick={avancarEtapa}>
                                    Continuar
                                </button>
                            ) : (
                                <button className="botao-finalizar" onClick={finalizarLocacao}>
                                    Finalizar Locação
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}