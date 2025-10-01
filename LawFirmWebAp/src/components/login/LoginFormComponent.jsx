import { useState, useContext } from "react";
import axios from "axios";
// context
import { useUser } from "../../context/userContext.jsx";

export default function LoginFormComponent() {
    
    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useUser();
    
    async function doLogin() {
        
        setError("");
        setLoading(true);

        // Chamar API de login
        try {
            const response = await axios.post(import.meta.env.VITE_SERVER_API_URL + '/auth/login', {
                username: userName,
                password: userPassword,
            });

            // Supondo que a API retorna { token: "...", role: "admin" }
            const { token, role } = response.data;
            login(role, token); // atualiza contexto + localStorage
            console.log('✅ Login bem-sucedido');
        } catch (err) {
            console.error(err);
            setError('Usuário ou senha inválidos');
        }
    }

    return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
        <h1>Login Page</h1> 
        <input type="text" placeholder="Username" value={userName} onChange={e => setUserName(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setUserPassword(e.target.value)} />
        <button onClick={doLogin}>Login</button>
    </div>);
}