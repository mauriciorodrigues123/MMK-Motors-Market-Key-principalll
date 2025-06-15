import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../componentes/header/header';
import { Footer } from '../../componentes/footer/footer';
import './pagamento.css';

// Interface para os dados do pagamento simplificada
interface DadosLocacaoSimplificados {
    carro: {
        nome: string;
        tipo: string;
        imagem: string;
    };
    periodo: string;
    valorTotal: number;
}

export function Pagamento() {
    const navigate = useNavigate();
    const location = useLocation();
    const dadosLocacao = location.state?.dadosLocacao as DadosLocacaoSimplificados;
    const [metodoPagamento, setMetodoPagamento] = useState<'pix' | 'cartao' | null>(null);
    const [numeroCartao, setNumeroCartao] = useState<string>('');
    const [mesExpiracao, setMesExpiracao] = useState<string>('');
    const [anoExpiracao, setAnoExpiracao] = useState<string>('');
    const [codigoSeguranca, setCodigoSeguranca] = useState<string>('');
    const [mostrarChavePix, setMostrarChavePix] = useState(false);
    const [nomeCartao, setNomeCartao] = useState<string>('');

    // Função para finalizar o pagamento (simulada)
    const finalizarPagamento = (e: React.FormEvent) => {
        e.preventDefault();

        // Lógica de pagamento simplificada: apenas simula o sucesso
        if (metodoPagamento === 'pix') {
            setMostrarChavePix(true);
            console.log('Chave Pix revelada.');
        } else if (metodoPagamento === 'cartao') {
            console.log('Simulando pagamento com Cartão:');
            console.log('Número do Cartão:', numeroCartao);
            console.log('Nome no Cartão:', nomeCartao);
            console.log('Mês de Expiração:', mesExpiracao);
            console.log('Ano de Expiração:', anoExpiracao);
            console.log('Código de Segurança:', codigoSeguranca);

            navigate('/meus-alugueis');
        }
    };

    // Função para navegar após copiar a chave Pix
    const navegarAposPix = () => {
        navigate('/meus-alugueis');
    };

    // Redireciona se não houver dados de locação
    if (!dadosLocacao) {
        navigate('/carros');
        return null;
    }

    // Função para formatar valores monetários
    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const handleNumeroCartaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
        setNumeroCartao(value);
    };

    return (
        <div className="pagina-pagamento">
            <Header />

            <div className="container-principal">
                <div className="container-pagamento">
                    <h1 className="titulo">Pagamento</h1>

                    <div className="resumo-pagamento">
                        <h2>Resumo da Locação</h2>
                        <div className="detalhes-resumo">
                            <p><strong>Carro:</strong> {dadosLocacao?.carro?.nome}</p>
                            <p><strong>Período:</strong> {dadosLocacao?.periodo}</p>
                            <p><strong>Valor Total:</strong> {formatarMoeda(dadosLocacao?.valorTotal || 0)}</p>
                        </div>
                    </div>

                    <div className="metodos-pagamento">
                        <h2>Escolha o Método de Pagamento</h2>
                        <div className="opcoes-metodo">
                            <button
                                className={`botao-metodo ${metodoPagamento === 'pix' ? 'ativo' : ''}`}
                                onClick={() => {
                                    setMetodoPagamento('pix');
                                    setMostrarChavePix(false);
                                }}
                            >
                                Pix
                            </button>
                            <button
                                className={`botao-metodo ${metodoPagamento === 'cartao' ? 'ativo' : ''}`}
                                onClick={() => {
                                    setMetodoPagamento('cartao');
                                    setMostrarChavePix(false);
                                }}
                            >
                                Cartão de Crédito
                            </button>
                        </div>
                    </div>

                    {metodoPagamento === 'pix' && (
                        <div className="secao-pagamento pix-secao">
                            <h2>Pagamento por Pix</h2>
                            {mostrarChavePix ? (
                                <>
                                    <p className="chave-pix">Chave Pix (CPF/CNPJ): **123.456.789-00**</p>
                                    <p className="instrucao-pix">Copie a chave acima e use no seu aplicativo bancário.</p>
                                    <button type="button" className="botao-confirmar" onClick={navegarAposPix}>
                                        Concluir Pagamento
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="instrucao-pix">Clique no botão abaixo para revelar a chave Pix.</p>
                                    <button type="button" className="botao-confirmar" onClick={finalizarPagamento}>
                                        Revelar Chave Pix
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {metodoPagamento === 'cartao' && (
                        <div className="secao-pagamento cartao-secao">
                            <div className="card-header">
                                <div className="card-number-display">
                                    {numeroCartao.replace(/(\d{4})(?=\d)/g, '$1 ') || '0000 0000 0000 0000'}
                                </div>
                                <div className="card-details-row">
                                    <span className="card-name-display">
                                        {nomeCartao || 'Nome no Cartão'}
                                    </span>
                                    <span className="card-expiry-display">
                                        {(mesExpiracao || 'MM') + '/' + (anoExpiracao.slice(-2) || 'YY')}
                                    </span>
                                </div>
                            </div>
                            <div className="card-body">
                                <h2>Pagamento com Cartão de Crédito</h2>
                                <div className="campo-formulario">
                                    <label htmlFor="numero-cartao">Número do Cartão</label>
                                    <input
                                        type="text"
                                        id="numero-cartao"
                                        maxLength={16}
                                        value={numeroCartao}
                                        onChange={handleNumeroCartaoChange}
                                        placeholder="0000 0000 0000 0000"
                                        required
                                    />
                                </div>
                                <div className="campo-formulario">
                                    <label htmlFor="nome-cartao">Nome no Cartão</label>
                                    <input
                                        type="text"
                                        id="nome-cartao"
                                        value={nomeCartao}
                                        onChange={(e) => setNomeCartao(e.target.value.toUpperCase())}
                                        placeholder="NOME COMPLETO"
                                        required
                                    />
                                </div>
                                <div className="campo-grupo-inline">
                                    <div className="campo-formulario">
                                        <label htmlFor="mes-expiracao">Mês</label>
                                        <input
                                            type="text"
                                            id="mes-expiracao"
                                            maxLength={2}
                                            value={mesExpiracao}
                                            onChange={(e) => setMesExpiracao(e.target.value.replace(/\D/g, ''))}
                                            placeholder="MM"
                                            required
                                        />
                                    </div>
                                    <div className="campo-formulario">
                                        <label htmlFor="ano-expiracao">Ano</label>
                                        <input
                                            type="text"
                                            id="ano-expiracao"
                                            maxLength={4}
                                            value={anoExpiracao}
                                            onChange={(e) => setAnoExpiracao(e.target.value.replace(/\D/g, ''))}
                                            placeholder="AAAA"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="campo-formulario">
                                    <label htmlFor="codigo-seguranca">Código de Segurança</label>
                                    <input
                                        type="text"
                                        id="codigo-seguranca"
                                        maxLength={3}
                                        value={codigoSeguranca}
                                        onChange={(e) => setCodigoSeguranca(e.target.value.replace(/\D/g, ''))}
                                        placeholder="CVC"
                                        required
                                    />
                                </div>
                                <div className="botoes-cartao">
                                    <button type="button" className="botao-cancelar" onClick={() => setMetodoPagamento(null)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="botao-pagar" onClick={finalizarPagamento}>
                                        Pagar Agora
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {!metodoPagamento && (
                        <div className="confirmacao-pagamento">
                            <h2>Aguardando Seleção</h2>
                            <p>Por favor, selecione um método de pagamento para continuar.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
} 