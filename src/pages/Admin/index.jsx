import { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './Admin.module.css'; // Import css modules stylesheet as styles

function AdminVagas() {
    const [vagasCarro, setVagasCarro] = useState(0);
    const [vagasMoto, setVagasMoto] = useState(0);
    const [novoCarro, setNovoCarro] = useState('');
    const [novoMoto, setNovoMoto] = useState('');
    const [message, setMessage] = useState('');
    const [reservas, setReservas] = useState([]);
    const [error, setError] = useState(null); // Estado para erros

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Token de autenticação não encontrado. Faça login novamente.");
                    return;
                }
                
                const response = await api.get('/private/reservas', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setReservas(response.data);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        setError('Erro de autenticação. Verifique o seu login ou token.');
                    } else {
                        setError(`Erro: ${error.response.status} - ${error.response.data.message || 'Erro ao carregar as reservas.'}`);
                    }
                } else if (error.request) {
                    setError('Erro de rede: não foi possível conectar ao servidor.');
                } else {
                    setError('Erro desconhecido: ' + error.message);
                }
                console.error("Erro ao carregar as reservas", error);
            }
        };
        fetchReservas();
    }, []);

    useEffect(() => {
        const fetchVagas = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                
                const response = await api.get('/private/vagasDisponiveis', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setVagasCarro(response.data.vagasDisponiveisCarro);
                setVagasMoto(response.data.vagasDisponiveisMoto);
            } catch (error) {
                console.error("Erro ao carregar vagas", error);
            }
        };
        fetchVagas();
    }, []);

    const handleUpdateVagas = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Erro: Token não encontrado. Faça login novamente.');
                return;
            }
            
            if (novoCarro) {
                await api.put('/private/atualizarVagas', {
                    tipoVeiculo: 'carro',
                    quantidade: novoCarro,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            if (novoMoto) {
                await api.put('/private/atualizarVagas', {
                    tipoVeiculo: 'moto',
                    quantidade: novoMoto,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            
            setMessage('Vagas atualizadas com sucesso!');
            
            const response = await api.get('/private/vagasDisponiveis', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVagasCarro(response.data.vagasDisponiveisCarro);
            setVagasMoto(response.data.vagasDisponiveisMoto);
        } catch (error) {
            console.error('Erro ao atualizar vagas', error);
            setMessage('Erro ao atualizar as vagas.');
        }
    };

    return (
        <div className={styles.container}>
            <h1>Admin - Alterar Vagas</h1>
            <p>Vagas disponíveis para Carros: <span>{vagasCarro}</span></p>
            <p>Vagas disponíveis para Motos: <span>{vagasMoto}</span></p>

            <div>
                <h2>Alterar Vagas</h2>
                <div>
                    <label>
                        Carros:
                        <input
                            type="number"
                            value={novoCarro}
                            onChange={(e) => setNovoCarro(e.target.value)}
                            placeholder="Novo número de vagas para carros"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Motos:
                        <input
                            type="number"
                            value={novoMoto}
                            onChange={(e) => setNovoMoto(e.target.value)}
                            placeholder="Novo número de vagas para motos"
                        />
                    </label>
                </div>

                <button onClick={handleUpdateVagas}>Atualizar Vagas</button>
                {message && <p>{message}</p>}
            </div>
            
            <div className={styles.container2}>
                <h1>Reservas do Estacionamento</h1>
                {error && <p className={styles.error}>{error}</p>}
                {reservas.length === 0 && !error ? (
                    <p>Sem reservas para exibir.</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nome do Cliente</th>
                                <th>Cor do Carro</th>
                                <th>Tipo do Veículo</th>
                                <th>Horário da Reserva</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map((reserva) => (
                                <tr key={reserva.id}>
                                    <td>{reserva.user.name}</td>
                                    <td>{reserva.carro.cor}</td>
                                    <td>{reserva.carro.tipo}</td>
                                    <td>{new Date(reserva.horario).toLocaleString('pt-BR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
            </div>
            <a href="/">HOME</a>
        </div>
    );
}

export default AdminVagas;
