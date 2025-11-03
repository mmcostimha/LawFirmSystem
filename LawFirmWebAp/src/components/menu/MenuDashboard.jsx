import {use, useEffect} from 'react';

import styles from './menuDashboard.module.css'
//imgs
import logo from "../../assets/Images/logo.png"
//context
import { useUser } from "../../context/userContext";

export default function MenuDashboard({setPage}) {

    const { logout } = useUser();


    useEffect(() => {
        // Any side effects or data fetching can be done here
    }, []);

    const doLogout = () => {
        logout();
        window.location.replace('/'); // Redirect to home or login page after logout
    }
    
    return <div className={styles.container}>
        <div className={styles.logoContainer}>
            <img src={logo} alt="Law Firm logo" className={styles.logo}/>
            <div className={styles.logoTitle}>
                <h1>Wagner Costa</h1>
                <h1>Advocacia</h1>
            </div>
        </div>
        <ul className={styles.navList}>
            {['Visão geral', 'Clientes', 'Alarmes', 'Perfil'].map((item) => {
                return (
                <li key={item} className={styles.navItem}>
                    <a onClick={()=>setPage(item)} className={styles.navLink}>{item}</a>
                </li>
                );
            })}
    
        </ul>

        <div className={styles.navButton}>
                <button onClick={()=>doLogout()} >Logout</button>
        </div>
        
    </div>
}
