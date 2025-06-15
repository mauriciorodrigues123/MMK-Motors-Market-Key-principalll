import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Header } from '../../componentes/header/header';
import { Footer } from '../../componentes/footer/footer';
import './AdicionarCarro.css';
import { API_URL } from '../../services/authService'; // Importar API_URL
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

// Interface para o tipo de carro
interface Carro {
    id?: number; // Tornar id opcional
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
}

export function AdicionarCarro() {
    // Estados para gerenciar os dados do formulário
    const navigate = useNavigate(); // Inicializar useNavigate
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('');
    const [precoTotal, setPrecoTotal] = useState('');
    const [imagemPreview, setImagemPreview] = useState<string | null>(null);
    const [cambio, setCambio] = useState('');
    const [lugares, setLugares] = useState('');
    const [motor, setMotor] = useState('');
    const [combustivel, setCombustivel] = useState('');
    const [portas, setPortas] = useState('');
    const [consumoKmPorLitro, setConsumoKmPorLitro] = useState('');
    const [carros, setCarros] = useState<Carro[]>([]);

    // Carrega os carros do db.json quando a página é montada
    useEffect(() => {
        const fetchCarros = async () => {
            try {
                const response = await fetch(`${API_URL}/carros`);
                if (!response.ok) {
                    throw new Error('Erro ao carregar carros');
                }
                const data = await response.json();
                setCarros(data);
            } catch (error) {
                console.error('Erro ao carregar carros:', error);
                alert('Erro ao carregar carros.');
            }
        };

        fetchCarros();
    }, []);

    // Função para lidar com o upload de imagem usando drag and drop
    const onDrop = useCallback((arquivosAceitos: File[]) => {
        if (arquivosAceitos.length > 0) {
            const arquivo = arquivosAceitos[0];
            const leitor = new FileReader();

            leitor.onload = () => {
                setImagemPreview(leitor.result as string);
            };

            leitor.readAsDataURL(arquivo);
        }
    }, []);

    // Configuração do dropzone para upload de imagens
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        maxFiles: 1
    });

    // Função para excluir um carro
    const excluirCarro = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este carro?')) {
            try {
                const response = await fetch(`${API_URL}/carros/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Erro ao excluir carro');
                }

                const carrosAtualizados = carros.filter(carro => carro.id !== id);
                setCarros(carrosAtualizados);
                alert('Carro excluído com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir carro:', error);
                alert('Erro ao excluir carro.');
            }
        }
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !tipo || !precoTotal || !imagemPreview || !cambio || !lugares || !motor || !combustivel || !portas || !consumoKmPorLitro) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        const novoCarro: Carro = {
            nome,
            tipo,
            precoTotal: parseFloat(precoTotal),
            imagem: imagemPreview,
            especificacoes: {
                cambio,
                lugares,
                motor,
                combustivel,
                portas,
                consumoKmPorLitro
            }
        };

        try {
            const response = await fetch(`${API_URL}/carros`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoCarro),
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar carro');
            }

            const carroAdicionado = await response.json();
            setCarros([...carros, carroAdicionado]);

            setNome('');
            setTipo('');
            setPrecoTotal('');
            setImagemPreview(null);
            setCambio('');
            setLugares('');
            setMotor('');
            setCombustivel('');
            setPortas('');
            setConsumoKmPorLitro('');

            navigate('/carros'); // Redireciona para a página de carros
        } catch (error) {
            console.error('Erro ao adicionar carro:', error);
            alert('Erro ao adicionar carro.');
        }
    };

    return (
        <div className="pagina-adicionar-carro">
            <Header />

            <div className="conteudo-principal">
                <h1 className="titulo">Adicionar Novo Carro</h1>

                <form onSubmit={handleSubmit} className="formulario-carro">
                    {/* Área de upload de imagem */}
                    <div {...getRootProps()} className={`area-upload ${isDragActive ? 'ativo' : ''}`}>
                        <input {...getInputProps()} />
                        {imagemPreview ? (
                            <img src={imagemPreview} alt="Preview" className="imagem-preview" />
                        ) : (
                            <p>{isDragActive ? 'Solte a imagem aqui' : 'Arraste e solte uma imagem aqui, ou clique para selecionar'}</p>
                        )}
                    </div>

                    {/* Informações básicas do carro */}
                    <div className="grupo-campos">
                        <div className="campo-formulario">
                            <label htmlFor="nome">Nome do Carro</label>
                            <input
                                type="text"
                                id="nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Ex: MMK 208 1.6 AT (2025)"
                                required
                            />
                        </div>

                        <div className="campo-formulario">
                            <label htmlFor="tipo">Tipo do Carro</label>
                            <input
                                type="text"
                                id="tipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                placeholder="Ex: SUV Compacto"
                                required
                            />
                        </div>

                        <div className="campo-formulario">
                            <label htmlFor="preco">Preço Total</label>
                            <input
                                type="number"
                                id="preco"
                                value={precoTotal}
                                onChange={(e) => setPrecoTotal(e.target.value)}
                                placeholder="Ex: 1100.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    {/* Especificações do carro */}
                    <div className="grupo-campos">
                        <h2>Especificações</h2>

                        <div className="campo-formulario">
                            <label htmlFor="cambio">Câmbio</label>
                            <input
                                type="text"
                                id="cambio"
                                value={cambio}
                                onChange={(e) => setCambio(e.target.value)}
                                placeholder="Ex: Automático"
                                required
                            />
                        </div>

                        <div className="campo-formulario">
                            <label htmlFor="lugares">Lugares</label>
                            <input
                                type="text"
                                id="lugares"
                                value={lugares}
                                onChange={(e) => setLugares(e.target.value)}
                                placeholder="Ex: 5 pessoas"
                                required
                            />
                        </div>

                        <div className="campo-formulario">
                            <label htmlFor="motor">Motor</label>
                            <input
                                type="text"
                                id="motor"
                                value={motor}
                                onChange={(e) => setMotor(e.target.value)}
                                placeholder="Ex: Motor: 1.6L 16V Flex"
                                required
                            />
                        </div>

                        <div className="campo-formulario">
                            <label htmlFor="combustivel">Combustível</label>
                            <input
                                type="text"
                                id="combustivel"
                                value={combustivel}
                                onChange={(e) => setCombustivel(e.target.value)}
                                placeholder="Ex: Gasolina/Álcool"
                                required
                            />
                        </div>

                        <div className="campo-formulario">
                            <label htmlFor="portas">Portas</label>
                            <input
                                type="text"
                                id="portas"
                                value={portas}
                                onChange={(e) => setPortas(e.target.value)}
                                placeholder="Ex: 4 portas"
                                required
                            />
                        </div>

                        <div className="campo-formulario">
                            <label htmlFor="consumoKmPorLitro">KM por Litro</label>
                            <input
                                type="text"
                                id="consumoKmPorLitro"
                                value={consumoKmPorLitro}
                                onChange={(e) => setConsumoKmPorLitro(e.target.value)}
                                placeholder="Ex: 12 km/l"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="botao-adicionar">
                        Adicionar Carro
                    </button>
                </form>

                {/* Lista de carros cadastrados */}
                <section className="secao-carros-cadastrados">
                    <h2>Carros Cadastrados</h2>
                    <div className="lista-carros-cadastrados">
                        {carros.map((carro) => (
                            <div key={carro.id} className="cartao-carro-cadastrado">
                                <img src={carro.imagem} alt={carro.nome} className="miniatura-carro" />
                                <div className="info-carro-cadastrado">
                                    <h3>{carro.nome}</h3>
                                    <p>{carro.tipo}</p>
                                    <p>R$ {carro.precoTotal.toFixed(2)}</p>
                                    <p>Câmbio: {carro.especificacoes.cambio}</p>
                                    <p>Lugares: {carro.especificacoes.lugares}</p>
                                    <p>Motor: {carro.especificacoes.motor}</p>
                                    <p>Combustível: {carro.especificacoes.combustivel}</p>
                                    <p>Portas: {carro.especificacoes.portas}</p>
                                    <p>KM por Litro: {carro.especificacoes.consumoKmPorLitro}</p>
                                </div>
                                <button
                                    onClick={() => excluirCarro(carro.id!)}
                                    className="botao-excluir"
                                    title="Excluir carro"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                        {carros.length === 0 && (
                            <p className="mensagem-sem-carros">Nenhum carro cadastrado ainda.</p>
                        )}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
} 