import React from 'react';
import { useNavigate } from 'react-router-dom'; // Use o useNavigate no lugar do useHistory
import styles from './LandingPage.module.css';

function LandingPage() {
    const navigate = useNavigate(); // Use navigate no lugar de history

    const handleLogin = () => {
        navigate('/login'); // Redireciona para a página de login
    };

    const handleReservas = () => {
        navigate('/Adm'); // Redireciona para a página de reservas
    };
    const handleLista = () => {
        navigate('/Lista'); // Redireciona para a página de reservas
    };

    const handleMeusCarros = () => {
        navigate('/carros'); // Redireciona para a página de "Meus Carros"
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Bem-vindo</h1>
            <p className={styles.subtitle}>Ao Seu app, aqui quem manda e você</p>

            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleLogin}>Entrar</button>
                <button className={styles.button} onClick={handleReservas}>Adm</button>
                <button className={styles.button} onClick={handleLista}>Lista de Users</button>
                <button className={styles.button} onClick={handleMeusCarros}>Meus Carros</button>
            </div>
        </div>
    );
}

export default LandingPage;
