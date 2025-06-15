import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCar, FaSignOutAlt } from 'react-icons/fa';
import './IconeUsuario.css';

export const IconeUsuario: React.FC = () => {
    const [menuAberto, setMenuAberto] = useState(false);
    const navigate = useNavigate();
    const usuario = authService.getUsuario();

    // Função para fazer logout
    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    // Função para fechar o menu quando clicar fora
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.icone-usuario-container')) {
            setMenuAberto(false);
        }
    };

    // Adiciona e remove o event listener
    React.useEffect(() => {
        if (menuAberto) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuAberto]);

    if (!usuario) return null;

    return (
        <div className="icone-usuario-container">
            <button
                className="botao-usuario"
                onClick={() => setMenuAberto(!menuAberto)}
                aria-label="Menu do usuário"
            >
                <div className="avatar-usuario">
                    {usuario.nome.charAt(0).toUpperCase()}
                </div>
            </button>

            {menuAberto && (
                <div className="menu-usuario">
                    <div className="info-usuario">
                        <span className="nome-usuario">
                            <FaUser className="icone-menu" />
                            {usuario.nome}
                        </span>
                        <span className="email-usuario">{usuario.email}</span>
                    </div>
                    <button
                        className="botao-menu"
                        onClick={() => {
                            navigate('/meus-alugueis');
                            setMenuAberto(false);
                        }}
                    >
                        <FaCar className="icone-menu" />
                        Meus Aluguéis
                    </button>
                    <button
                        className="botao-logout"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="icone-menu" />
                        Sair
                    </button>
                </div>
            )}
        </div>
    );
}; 