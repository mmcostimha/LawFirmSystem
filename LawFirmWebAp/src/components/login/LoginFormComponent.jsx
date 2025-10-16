import { useState, useContext } from "react";
import axios from "axios";
//styles
import style from "./LoginForm.module.css"
// context
import { useUser } from "../../context/userContext.jsx";
//models
import { userLoginStructure } from "../../models/User/userLogin.jsx"

export default function LoginFormComponent() {
    
    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const[userLogin,setUserLogin]= useState(userLoginStructure)

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useUser();
    
    async function doLogin() {
        setError("");
        setLoading(true);
        // Chamar API de login
        try {
            const response = await axios.post(import.meta.env.VITE_SERVER_API_URL + '/auth/login', {
                username: userLogin.username,
                password: userLogin.password,
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

    const handleSubmit = () =>{
        console.log("Fazendo o login")
    }

    return <div className={style.container}>
      <h1>Login Page</h1>

      <form onSubmit={handleSubmit} className={style.formContainer}>
         <input type="text" placeholder={userLogin.username} onChange={(e) => setuserLogin(prev => ({ ...prev, username: e.target.value }))} value={userLogin.username} required />
         <input type="password" placeholder={userLogin.password} onChange={(e) => setuserLogin(prev => ({ ...prev, password: e.target.value }))} value={userLogin.password} required />
         
         <button type="submit" >Submeter</button>
      </form>
      <div>
         {userLogin.username}
         {userLogin.password}
      </div>
   
   </div>;
}