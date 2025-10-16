
import {useState} from "react"
import axios from "axios";

//styles
import style from "./RegisterForm.module.css"
//models
import { userStructure } from "../../models/User/userModel"

//context
import {useUser} from "../../context/userContext"


export default function Register(){
   const { accountType, login, logout, isPageAllowed } = useUser()

   const [newUser, setNewUser]= useState(userStructure);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const handleSubmit = (event) => {
      event.preventDefault();
      console.log("Submetido")
   }

   const handleRegister = async (e) => {
         e.preventDefault();
        setError("");
        setLoading(true);
        // Chamar API de login
        try {
            const response = await axios.post(import.meta.env.VITE_SERVER_API_URL + '/auth/register', newUser);

            // Supondo que a API retorna { token: "...", role: "admin" }
             response;
            // login(role, token); // atualiza contexto + localStorage
            console.log('✅ Registo bem-sucedido'+response);
        } catch (err) {
            console.error(err);
            setError('Usuário ou senha inválidos');
        }
    }
    

   return <div className={style.container}>
      <h1>Register Page</h1>

      <form onSubmit={(e)=>handleRegister(e)} className={style.formContainer}>
         <input type="text" placeholder={"Nome"} onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))} value={newUser.name} required />
         <input type="text" placeholder={"Telefone"} onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))} value={newUser.phone} required />
         <input type="text" placeholder={"Email"} onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))} value={newUser.email} required />
         {/* mudar par seletor de opcoes */}
         <input type="text" placeholder={"Tipo de conta(admin/Client)"} onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))} value={newUser.role} required /> 
         <input type="text" placeholder={"Username"} onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))} value={newUser.username} required />
         <input type="text" placeholder={"Password"} onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))} value={newUser.password} required />
         
         <button type="submit" >Submeter</button>
      </form>
      <div>
         {newUser.name}
         {newUser.email}
         {newUser.phone}
         {newUser.username}
         {newUser.password}
      </div>
   
   </div>
}