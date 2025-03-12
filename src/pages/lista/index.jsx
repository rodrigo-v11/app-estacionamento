import api from "../../services/api";
import { useEffect, useState } from "react";
import '../../styles.css';

function Lista() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            try {
                const token = localStorage.getItem('token');
                const { data: { users } } = await api.get('/users', { headers: { Authorization: `Bearer ${token}` }});
                setUsers(users);
            } catch (err) {
                alert('Erro ao carregar usuários');
            }
        }

        loadUsers();
    }, []);

    return (
        <div>
            <h1>Lista de Users</h1>
            <ul>
                {users >0 && users.map((user) => (
                    <li key={user.id}>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Lista;
