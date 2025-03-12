import { useRef, useEffect, useState } from "react";
import api from "../../services/api";
import '../../styles.css';

function Carros() {
    const inputNameCarro = useRef();
    const inputPlaca = useRef();
    const inputCor = useRef();
    const [marcaSelecionada, setMarcaSelecionada] = useState(""); // Estado para armazenar a marca escolhida
    const [carros, setCarros] = useState([]);
    const [search, setSearch] = useState(""); // Estado para armazenar a pesquisa da marca

    // 🔹 Lista de marcas de veículos disponíveis
    const marcasDisponiveis = [
        "Chevrolet", "Fiat", "Ford", "Honda", "Hyundai", "Jeep",
        "Nissan", "Peugeot", "Renault", "Toyota", "Volkswagen",
        "BMW", "Mercedes-Benz", "Audi", "Kia", "Mitsubishi"
    ];

    // 🔹 Função para filtrar e ordenar marcas
    const filteredMarcas = marcasDisponiveis.filter(marca => 
        marca.toLowerCase().includes(search.toLowerCase()) // Filtra marcas que incluem o texto digitado
    ).sort((a, b) => {
        if (a.toLowerCase().startsWith(search.toLowerCase())) return -1; // Prioriza as marcas que começam com a busca
        if (b.toLowerCase().startsWith(search.toLowerCase())) return 1;
        return 0;
    });

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!userId) {
                alert("Erro: usuário não autenticado.");
                return;
            }

            await api.post('/private/cadastroCarro', {
                headers: { Authorization: `Bearer ${token}` },
                userId:
                userId,
                nameCarro: inputNameCarro.current.value,
                placa: inputPlaca.current.value,
                cor: inputCor.current.value,
                marca: marcaSelecionada // Pegando a marca escolhida no select
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Cadastro do Carro realizado com sucesso!');
            loadCarros(); // Recarrega a lista após cadastrar

        } catch (err) {
            console.error(err);
            alert('Erro ao cadastrar veículo.');
        }
    }
    // Função para deletar o carro
    async function handleDelete(carroId) {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Erro: usuário não autenticado.");
                return;
            }

            await api.delete(`/private/carros/${carroId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Carro deletado com sucesso!');
            loadCarros(); // Recarrega a lista após deletar

        } catch (err) {
            console.error(err);
            alert('Erro ao deletar veículo.');
        }
    }

    async function loadCarros() {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!userId) {
                alert("Erro: usuário não autenticado.");
                return;
            }

            const { data: { carros } } = await api.get(`/private/user/${userId}/carros`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCarros(carros);
            
            // Caso não haja carros cadastrados, a lista ficará vazia
            if (carros.length === 0) {
                
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao carregar veículos.');
        }
    }

    useEffect(() => {
        loadCarros();
    }, []);
    

    return (
        <div className="containerCarros">
            <h1>Cadastro de Veículo</h1>
            <form onSubmit={handleSubmit}>
                <input ref={inputNameCarro} placeholder="Apelido do Carro" type="text" required />
                <input ref={inputPlaca} placeholder="Placa" type="text" required />
                <input ref={inputCor} placeholder="Cor" type="text" required />

                {/* 🔹 Campo de busca para a marca */}
                <input 
                    type="text" 
                    placeholder="Filtrar a marca..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} // Atualiza o valor da busca
                />

                {/* 🔹 Select para escolher a marca */}
                <select value={marcaSelecionada} onChange={(e) => setMarcaSelecionada(e.target.value)} required>
                    <option value="">Selecione a Marca</option>
                    {filteredMarcas.map((marca, index) => (
                        <option key={index} value={marca}>{marca}</option>
                    ))}
                </select>

                <button type="submit">Cadastrar</button>
            </form>

            <div className="carros">
                <h1>Lista de Veículos</h1>
                    {carros.length === 0 ? (
                        <p>Não há carros cadastrados. Cadastre seu primeiro carro!</p> // Exibe quando não houver carros
                    ) : (
                        <ul>
                            {carros.map((carro) => (
                                <li key={carro.userId}>
                                    <h2>{carro.nameCarro}</h2>
                                    <p>Placa: {carro.placa}</p>
                                    <p>Cor: {carro.cor}</p>
                                    <p>Marca: {carro.marca}</p>
                                    <button onClick={() => handleDelete(carro.id)}>Deletar</button>
                                </li>
                            ))}
                        </ul>
                    )}
            </div>
        </div>
    );
}
export default Carros;
