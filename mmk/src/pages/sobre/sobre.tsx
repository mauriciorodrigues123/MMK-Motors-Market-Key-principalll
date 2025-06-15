import { FaCar, FaHandshake, FaTools, FaUserTie } from 'react-icons/fa';
import "./sobre.css"
import { Header } from '../../componentes/header/header';
import { Footer } from '../../componentes/footer/footer';

export function Sobre() {
    return (
        <div className="sobre-page">
            <Header />
            <div className="sobre-container">
                <div className="banner-sobre" style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1600661653561-629509216228?q=80&w=1920&auto=format&fit=crop')`
                }}>
                    <div className="sobre-header">
                        <h1>Sobre a MMK Motors</h1>
                        <p>Somos uma empresa apaixonada por carros e comprometida em oferecer as melhores soluções automotivas.</p>
                    </div>
                </div>

                <div className="historia-section">
                    <div className="historia-imagem">
                        <img
                            src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=1000&auto=format&fit=crop"
                            alt="História da MMK Motors"
                        />
                    </div>
                    <div className="historia-content">
                        <h2>Nossa História</h2>
                        <p>Fundada com o objetivo de revolucionar o mercado automotivo, a MMK Motors tem se destacado pela excelência em serviços e compromisso com a satisfação do cliente.</p>
                        <p>construímos uma reputação sólida baseada na confiança e no profissionalismo.</p>
                    </div>
                </div>

                <div className="missao-visao">
                    <div className="missao-card">
                        <div className="card-imagem">
                            <img
                                src="https://images.unsplash.com/photo-1552960562-daf630e9278b?q=80&w=1000&auto=format&fit=crop"
                                alt="Nossa Missão"
                            />
                        </div>
                        <h2>Nossa Missão</h2>
                        <p>Proporcionar a melhor experiência automotiva aos nossos clientes, oferecendo produtos e serviços de alta qualidade.</p>
                    </div>

                    <div className="visao-card">
                        <div className="card-imagem">
                            <img
                                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1000&auto=format&fit=crop"
                                alt="Nossa Visão"
                            />
                        </div>
                        <h2>Nossa Visão</h2>
                        <p>Ser reconhecida como a empresa líder no mercado automotivo, inovando constantemente e superando expectativas.</p>
                    </div>
                </div>

                <div className="sobre-valores">
                    <div className="valores-grid">
                        <div className="valor-item">
                            <i><FaCar /></i>
                            <h3>Excelência</h3>
                            <p>Buscamos a perfeição em cada detalhe.</p>
                        </div>

                        <div className="valor-item">
                            <i><FaHandshake /></i>
                            <h3>Confiança</h3>
                            <p>Relacionamentos baseados na transparência.</p>
                        </div>

                        <div className="valor-item">
                            <i><FaTools /></i>
                            <h3>Qualidade</h3>
                            <p>As melhores práticas do mercado.</p>
                        </div>

                        <div className="valor-item">
                            <i><FaUserTie /></i>
                            <h3>Profissionalismo</h3>
                            <p>Equipe capacitada e comprometida.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}