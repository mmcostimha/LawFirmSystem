
import {useState} from "react"

//components
import Modal from "../components/Modal"
import Resgister from "../components/register/RegisterFormComponent";
import LoginFormComponent from "../components/login/loginFormComponent";
//context
import {useUser} from "../context/userContext"

export default function Home() {

  const [isLogin,setIsLogin] = useState(false);
  const [isRegisting,setIsRegisting] = useState(false);

  const { accountType, login, logout, isPageAllowed } = useUser();
  
  return <div>
      
      <h1>Welcome to the Home Page</h1>
      <button onClick={()=>setIsLogin(true)} >Login</button>
      <button onClick={()=>setIsRegisting(true)} >Regist</button>
      
      <Modal isOpen={isLogin} onClose={() => setIsLogin(false)}>
        <LoginFormComponent/>
      </Modal>
      <Modal isOpen={isRegisting} onClose={() => setIsRegisting(false)}>
        <Resgister/>
      </Modal>
      
    </div>
}