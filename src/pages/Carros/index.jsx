import { useRef, useEffect, useState } from "react";
import api from "../../services/api";
import styles from './Carros.module.css'; // Import css modules stylesheet as styles




function Carros() {
    
    const inputmodeloCarro = useRef();
    const inputPlaca = useRef();
    const inputCor = useRef();
    const [marcaSelecionada, setMarcaSelecionada] = useState(""); // Estado para armazenar a marca escolhida
    const [tipoSelecionado, setTipoSelecionado] = useState(""); // Estado para armazenar o tipo de veículo
    const [carros, setCarros] = useState([]);
    const [searchMarca, setSearchMarca] = useState(""); // Estado para armazenar a pesquisa da marca
    const [horarioSelecionado, setHorarioSelecionado] = useState(""); // Estado para armazenar o horário selecionado

    // 🔹 Lista de marcas de veículos disponíveis
    const marcasDisponiveis = [
        "Chevrolet", "Fiat", "Ford", "Honda", "Hyundai", "Jeep",
        "Nissan", "Peugeot", "Renault", "Toyota", "Volkswagen",
        "BMW", "Mercedes-Benz", "Audi", "Kia", "Mitsubishi",
        "Chrysler", "Land Rover", "Subaru", "Porsche", "Mazda",
        "Ferrari", "Lamborghini", "Bugatti", "Aston Martin", "Jaguar",
        "Tesla", "Volvo", "Citroën", "Mini", "Alfa Romeo", "Bentley",
        "Rolls-Royce", "Maserati", "McLaren", "Ford", "Lincoln",
        "Acura", "Infiniti", "Lexus", "Dodge", "Buick", "Cadillac",
        "Honda", "Yamaha", "Suzuki", "Kawasaki", "Harley-Davidson", 
        "Ducati", "BMW Motorrad", "Triumph", "KTM", "Royal Enfield", 
        "Moto Guzzi", "Indian Motorcycles", "Aprilia", "Bajaj", "Vespa", 
        "Piaggio", "SYM", "Husqvarna", "Zero Motorcycles", "Benelli",
        "Moto Morini", "MV Agusta", "CFMOTO"
    ];

    // 🔹 Lista de tipos de veículos disponíveis
    const tiposDeVeiculos = ["Carro", "Moto", "Caminhonete", "Van", "SUV", "Crossover", "Pickup"];

    // 🔹 Função para filtrar e ordenar marcas
    const filteredMarcas = marcasDisponiveis.filter(marca => 
        marca.toLowerCase().includes(searchMarca.toLowerCase())
    ).sort((a, b) => {
        if (a.toLowerCase().startsWith(searchMarca.toLowerCase())) return -1;
        if (b.toLowerCase().startsWith(searchMarca.toLowerCase())) return 1;
        return 0;
    });

   // Função para verificar se há vagas disponíveis no estacionamento
   async function checkVagasDisponiveis(tipoVeiculo) {
    console.log("Tipo de Veículo:", tipoVeiculo); // Verifique se está recebendo o valor correto

    try {
        const token = localStorage.getItem('token');
        const { data } = await api.get('/private/vagasDisponiveis', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (tipoVeiculo && ["carro", "suv", "caminhonete", "van", "crossover", "pickup"].includes(tipoVeiculo.toLowerCase())) {
            return data.vagasDisponiveisCarro > 0;
        } else if (tipoVeiculo && tipoVeiculo.toLowerCase() === 'moto') {
            return data.vagasDisponiveisMoto > 0;
        } else {
            return false;
        }        
    } catch (err) {
        console.error(err);
        alert('Erro ao verificar vagas.');
        return false;
    }
}



// Função para marcar o horário do carro
async function handleMarcarHorario(carroId, tipoVeiculo) {
    const temVaga = await checkVagasDisponiveis(tipoVeiculo);
        
    if (!temVaga) {
        alert("Não há vagas disponíveis no estacionamento.");
        return;
    }

    if (!horarioSelecionado) {
        alert("Por favor, selecione um horário.");
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert("Erro: usuário não autenticado.");
            return;
        }

        await api.post('/private/marcarHorario', {
            userId: userId,
            carroId: carroId,
            horario: horarioSelecionado // Horário selecionado para a reserva
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert('Horário marcado com sucesso!');
        loadCarros(); // Recarrega a lista após marcar o horário

    } catch (err) {
        console.error(err);
        alert('Erro ao marcar horário.');
    }
}


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
                userId: userId,
                modeloCarro: inputmodeloCarro.current.value,
                placa: inputPlaca.current.value,
                cor: inputCor.current.value,
                tipo: tipoSelecionado,
                marca: marcaSelecionada
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
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

            console.log(token)
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

        } catch (err) {
            console.error(err);
            alert('Erro ao carregar veículos.');
        }
    }

    useEffect(() => {
        loadCarros();
    }, []);

    

    return (
        <div className={styles.containerCarros}>
            
            <form onSubmit={handleSubmit}>
            <h1>Cadastro de Veículo</h1>
                <input ref={inputmodeloCarro} placeholder="Modelo do Carro" type="text" required />
                <input ref={inputPlaca} placeholder="Placa" type="text" required />
                <input ref={inputCor} placeholder="Cor" type="text" required />

                {/* 🔹 Select para escolher o tipo de veículo */}
                <select value={tipoSelecionado} onChange={(e) => setTipoSelecionado(e.target.value)} required>
                    <option value="">Selecione o Tipo</option>
                    {tiposDeVeiculos.map((tipo, index) => (
                        <option key={index} value={tipo}>{tipo}</option>
                    ))}
                </select>

                {/* 🔹 Campo de busca para a marca */}
                <input 
                    type="text" 
                    placeholder="Filtrar a marca..." 
                    value={searchMarca} 
                    onChange={(e) => setSearchMarca(e.target.value)} // Atualiza o valor da busca
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

            <div className={styles.Listacarros} >
                <h1>Lista de Veículos</h1>
                {carros.length === 0 ? (
                    <p> Não há carros cadastrados. Cadastre seu primeiro carro! </p>
                ) : (
                    <ul className={styles.marcarHorario}>
                       {carros.map((carro) => (
                                <li key={carro.id}>
                                    <div>
                                        <h2>{carro.modeloCarro}</h2>
                                        <p>Placa: <span>{carro.placa}</span></p>
                                        <p>Cor: <span>{carro.cor}</span></p>
                                        <p>Marca: <span>{carro.marca}</span></p>
                                        <p>Tipo: <span>{carro.tipo}</span></p>
                                    </div>
                                
                                    {/* Botão para marcar o horário */}
                                    <input
                                        type="datetime-local"
                                        value={horarioSelecionado}
                                        onChange={(e) => setHorarioSelecionado(e.target.value)} 
                                        required
                                    />
                                    <button onClick={() => handleMarcarHorario(carro.id, carro.tipo)}>Marcar Horário</button>

                                    <button onClick={() => handleDelete(carro.id)}>Deletar Veiculo</button>
                                </li>
                        ))}
                    </ul>
                )}
            </div>
            <a href="/">HOME</a>
        </div>
    );
}

export default Carros;
