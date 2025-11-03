
import {useState} from "react"

//components
import Modal from "../components/Modal"
import Resgister from "../components/register/RegisterFormComponent";
import Header from "../layout/header";
//context
import {useUser} from "../context/userContext"

export default function Home() {

  
  const [isRegisting,setIsRegisting] = useState(false);

  const { accountType, login, logout, isPageAllowed } = useUser();
  
  return <div>
    <Header/>
    <div>
      <h1>O teu direito!</h1>
      <h1>Nossa Obrigação!</h1>
    </div>
    {/* <button >Regist</button>
    <button onClick={()=>setIsRegisting(true)} >Regist</button> */}
    
    <Modal isOpen={isRegisting} onClose={() => setIsRegisting(false)}>
      <Resgister S/>
    </Modal>
    
  </div>
}