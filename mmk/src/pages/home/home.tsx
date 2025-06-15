import './home.css'
import './responsivo.css'
import Mustang from "../../imagem/ChatGPT_Image_14_de_mai._de_2025__18_41_19-removebg-preview.png"
import carro from "../../imagem/imagens-carros/thumbnail.png"
import { Header } from '../../componentes/header/header';
import { Footer } from '../../componentes/footer/footer';
import { Link } from 'react-router-dom';


export function Home() {
    return (
        <div>
            <Header />

            <main className="main">
                <section className="left" >

                    <div className="title">Motors Market Key</div>
                    <div className="subtitle">Bem-vindo</div>

                    <p className="description">Do código à estrada: seu carro, nossa missão.</p>
                    <nav>
                        <a href="#" className="btn">Saiba mais</a>
                    </nav>
                </section>

                <section className="right">
                    <div className="car-container">
                        <img src={Mustang} alt="Mustang Car" className="car-image" />
                    </div>
                </section>

                <section className="mostruario-carro">
                    <div className="mostruario-esquerda">
                        <h1>conheça nossos carros</h1>
                        <p>De carros custo benefícios a veículos de luxo, temos tudo o que você precisa. Deixe-nos ajudar você a encontrar o carro perfeito para as suas necessidades. Temos uma ampla seleção de veículos para escolher, então temos certeza de que você encontrará algo que combine com o seu estilo.</p>
                        <Link to={"carros"} className="mostruario-botao">Venha conhecer mais carros</Link>
                    </div>
                    <div className="mostruario-direita">
                        <img src={carro} alt="Mustang Car" className="mostruario-carro-imagem" />
                    </div>
                </section>

                <section className="section-Sugestoes">
                    <h2>Por que comprar conosco?</h2>
                    <div className="cards">

                        <div className="card">
                            <div className="card-icon">🚗</div>
                            <div className="card-title">Garantia de procedência</div>
                            <div className="card-text">Confiança em cada detalhe.</div>
                        </div>

                        <div className="card">
                            <div className="card-icon">🛠️</div>
                            <div className="card-title">Veículos revisados</div>
                            <div className="card-text">Prontos para rodar com segurança.</div>
                        </div>

                        <div className="card">
                            <div className="card-icon">✨</div>
                            <div className="card-title">Brilho de showroom</div>
                            <div className="card-text">Carros impecáveis por dentro e por fora.</div>
                        </div>

                        <div className="card">
                            <div className="card-icon">🔒</div>
                            <div className="card-title">Proteção e durabilidade</div>
                            <div className="card-text">Cuidados que preservam o valor do seu carro.</div>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}