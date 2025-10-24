import { useState, useContext } from "react";
import axios from "axios";
//styles
import style from "./LoginForm.module.css"
// context
import { useUser } from "../../context/userContext.jsx";
//models
import { userLoginStructure } from "../../models/User/userLogin.jsx"
//img
import logo from "../../assets/Images/big_logo.png"

export default function LoginFormComponent() {
    
    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const[userLogin,setUserLogin]= useState(userLoginStructure);

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
      {/* <h1>Login Page</h1> */}

      <div className={style.adviceContainer}>
        <div className={style.iconContainer}>
            <div className={style.logoContainer}>
                <img src={logo} alt="Law Firm logo" className={style.logo}/>
                <div className={style.logoTitle}>
                    <h1>Wagner Costa</h1>
                    <h1>Advocacia</h1>
                </div>
            </div> 
            <div className={style.adviceText}>
                <h1>Seja prudente: </h1>
                <p>• Não partilhe a sua password.</p>
                <p>• Mantenha o seu dispositivo seguro.</p>
                <p>• Em caso de dúvida contacte o seu advogado.</p>
            </div>
            
        </div>

       
      </div>

      <form onSubmit={handleSubmit} className={style.formContainer}>
        <h1>Login</h1>
        <input type="text" placeholder={"username"} onChange={(e) => setUserLogin(prev => ({ ...prev, username: e.target.value }))} value={userLogin.username} required />
        <input type="password" placeholder={"password"} onChange={(e) => setUserLogin(prev => ({ ...prev, password: e.target.value }))} value={userLogin.password} required />
        <a href="">esqueci-me minha password</a>
        <button type="submit" >Submeter</button>
      </form>
   </div>;
}