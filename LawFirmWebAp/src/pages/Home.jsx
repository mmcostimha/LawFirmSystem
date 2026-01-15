
import {useState} from "react"

//components
import Modal from "../components/Modal"
import Resgister from "../components/register/RegisterFormComponent";
import Header from "../layout/header";
import LoginFormComponent from "../components/login/LoginFormComponent"
import Recovery from "../components/Recovery/Recovery";
//context
import {useUser} from "../context/userContext"
//styles
import styles from "./Home.module.css"

export default function Home() {

  
  // const [isRegisting,setIsRegisting] = useState(false);
  // const [isLogin,setIsLogin] = useState(false);
  const [PassRecovery,setPassRecovery] = useState(false);
  const { accountType, login, logout, isPageAllowed } = useUser();
  
  return <div className={styles.container}>

    {!PassRecovery ? <LoginFormComponent setPassRecoveryFormVisible={setPassRecovery}/>:
                  <Recovery setPassRecoveryFormVisible={setPassRecovery}/>
    }


    
    {/* <Header/>
    <div>
      <h1>O teu direito!</h1>
      <h1>Nossa Obrigação!</h1>
    </div> 
     <button >Regist</button>
    <button onClick={()=>setIsRegisting(true)} >Regist</button>
    <Modal isOpen={isRegisting} onClose={() => setIsRegisting(false)}>
      <Resgister />
    </Modal> */}
    
  </div>
}