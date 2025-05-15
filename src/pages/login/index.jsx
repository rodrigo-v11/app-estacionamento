import { useRef } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import styles from './Login.module.css'; // Import css modules stylesheet as styles

function Login() {
    const inputEmail = useRef();
    const inputPassword = useRef();
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const { data: { token, Userid } } = await api.post('/login', {
                email: inputEmail.current.value,
                password: inputPassword.current.value
            });

            // Armazenar token e userId no localStorage
            localStorage.setItem('token', token);    
            localStorage.setItem('userId', Userid);

            // Redirecionar para a página de carros após login bem-sucedido
            navigate('/Carros');
        } catch (err) {
            console.error(err);
            alert('Email ou senha inválidos!');
        }
    }

        return (
            <div className={styles.Login}>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input ref={inputEmail} placeholder="Email:" type="email" required />
                    <input ref={inputPassword} type="password" placeholder="Senha:" required />
                    <button type="submit">Entrar</button>
                </form>
                <a href="/Cadastro">Não tem cadastro?  Crie sua conta!</a>
            </div>
        );
}

export default Login;
