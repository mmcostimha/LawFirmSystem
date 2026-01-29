import {useState, useContext} from "react"
//styles
import styles from "./header.module.css"
import logo from "../assets/Images/logo.png"
//camponents
import Modal from "../components/Modal"
import LoginFormComponent from "../components/login/LoginFormComponent";
//context


function Header() {

  const [isLogin,setIsLogin] = useState(false);

  return (
    <nav className={styles.container}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Law Firm logo" className={styles.logo}/>
        <div className={styles.logoTitle}>
          <h1>Wagner Costa</h1>
          <h1>Advocacia</h1>
        </div>
      </div>
      <ul className={styles.navList}>
        {['Home', 'Áreas', 'Testemunhos', 'Contatos'].map((item) => {
          const href = `#${item.toLowerCase().replace(/\s+/g, '-')}`;
          return (
            <li key={item} className={styles.navItem}>
              <a href={href} className={styles.navLink}>{item}</a>
            </li>
          );
        })}

        <li className={styles.navItem}>
          <button onClick={()=>setIsLogin(true)} >Login</button>
        </li>
      </ul>
       <Modal isOpen={isLogin} onClose={() => setIsLogin(false)}>
          <LoginFormComponent setIsLoginFormVisible={setIsLogin}/>
       </Modal>
    </nav>
  )
}

export default Header