import { useEffect, useState } from "react";
import api from "../../services/api"; // Serviço para fazer a requisição
import styles from './Lista.module.css'; // Import css modules stylesheet as styles

function Lista() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUsers() {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/private/users', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                    },
                });
                setUsers(response.data);
            } catch (err) {
                console.error(err);
                alert('Erro ao carregar usuários');
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, []);

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={styles.ListaUsuarios}>
            <h1>Lista de Usuários</h1>
            <ul className={styles.nao}>
                {users.length > 0 ? (
                    users.map(user => (
                        <div>
                            <li key={user.id}>
                                <h2>Nome do Usuário: <span>{user.name}</span></h2>
                                <h2>Email do Usuário: <span>{user.email}</span></h2>
                                
                                
                                <ul>
                                <h3>Carros:</h3>
                                    {user.carros.length > 0 ? (
                                        user.carros.map(carro => (
                                            <li className={styles.listacaros} key={carro.id}>
                                                <p>Modelo do Veículo: <span>{carro.modeloCarro}</span></p>
                                                <p>Placa: <span>{carro.placa}</span></p>
                                            </li>
                                        ))
                                    ) : (
                                        <p className={styles.naoencontrado}>Nenhum carro encontrado.</p>
                                    )}
                                <h3>Reservas:</h3>
                                    {user.reservas.length > 0 ? (
                                        user.reservas.map(reserva => (
                                            <li className={styles.listacaros} key={reserva.id}>
                                                <p>Modelo do Veículo: <span>{ reserva.carro.modeloCarro}</span></p>
                                                <p>Placa do Veículo: <span>{ reserva.carro.placa}</span></p>
                                                <p>Horário: <span>{ new Date( reserva.horario).toLocaleString('pt-BR', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}</span></p>
                                            </li>
                                        ))
                                    ) : (
                                        <p className={styles.naoencontrado}>Nenhuma reserva encontrada.</p>
                                    )}
                                </ul>
                            </li>
                        </div>
                    ))
                ) : (
                    <p className={styles.naoencontrado}>Nenhum usuário encontrado.</p>
                )}
            </ul>
            <a href="/">HOME</a>
        </div>
    );
}

export default Lista;
