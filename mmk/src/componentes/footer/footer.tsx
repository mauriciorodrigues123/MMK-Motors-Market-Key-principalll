import "./footer.css"
import { Link } from "react-router-dom"

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Seção da Logo e Descrição */}
                <div className="footer-section">
                    <h3 className="footer-logo">MMK Motors</h3>
                    <p className="footer-description">
                        Do código à estrada: seu carro, nossa missão.
                        Qualidade e confiança em cada negócio.
                    </p>
                </div>

                {/* Seção de Links Rápidos */}
                <div className="footer-section">
                    <h4>Links Rápidos</h4>
                    <nav className="footer-links">
                        <Link to="/">Home</Link>
                        <Link to="/carros">Carros</Link>
                        <Link to="/sobre">Sobre</Link>
                        <Link to="/contato">Contato</Link>
                    </nav>
                </div>

                {/* Seção de Contato */}
                <div className="footer-section">
                    <h4>Contato</h4>
                    <div className="contact-info">
                        <p>📞 (11) 99999-9999</p>
                        <p>📧 contato@mmkmotors.com</p>
                        <p>📍 São Paulo, SP</p>
                    </div>
                </div>

                {/* Seção de Redes Sociais */}
                <div className="footer-section">
                    <h4>Redes Sociais</h4>
                    <div className="social-links">
                        <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href="#" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                    </div>
                </div>
            </div>

            {/* Rodapé inferior com direitos autorais */}
            <div className="footer-bottom">
                <p>&copy; 2024 MMK Motors. Todos os direitos reservados.</p>
            </div>
        </footer>
    )
}