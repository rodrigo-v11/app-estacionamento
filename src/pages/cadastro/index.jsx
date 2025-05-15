import { useRef } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import styles from './cadastro.module.css'; // Import css modules stylesheet as styles


function Cadastro (){
    const navigate = useNavigate();

    const inputName = useRef();
    const inputEmail = useRef();
    const inputPassword = useRef();

    async function handleSubmit(event){
        event.preventDefault();
        try {
        await api.post('/cadastro', {
            name: inputName.current.value,
            email: inputEmail.current.value,
            password: inputPassword.current.value
        });
        alert('Cadastro realizado com sucesso!');
        navigate('/Login');
        } catch (err) {
            alert('Erro ao cadastrar');
        }
    }

return (
    <div className={styles.containerCadastro}>
        <h1>Cadastro</h1>
        <form onSubmit={handleSubmit}>
            <input ref={inputName} placeholder="Nome" type="text" required />
            <input ref={inputEmail} placeholder="Email" type="email" required />
            <input ref={inputPassword} type="password" placeholder="Senha" required />
            <button type="submit">Cadastrar</button>
        </form>
        <a href="/Login">Já tem cadastro? Faça login</a>
    </div>
);

}

export default Cadastro;