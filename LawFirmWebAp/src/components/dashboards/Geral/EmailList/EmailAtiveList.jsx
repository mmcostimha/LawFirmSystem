import styles from "./EmailAtiveList.module.css"
import { useState, useEffect, use } from "react"
//components
import EmailAtiveElement from "./EmailAtiveElement"
import LoadingComponent from "../../../loading/LoadingComponent"
//models
import { emailTrigger } from "../../../../models/Email/emailTrigger"
//contexts
import {useUser} from "../../../../context/userContext"
//api
import apiRequest from "../../../../data/apiRequest"
//icons
import { FaRegClock } from "react-icons/fa";

export default  function EmailAtiveList(){

    const [emails, setEmails] = useState([]);
    const { token } = useUser();
    const [loading, setLoading] = useState(true);

    const removeAlert = (id) => {
        setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
    }
    
    useEffect(() => {
        // Simulate fetching data from an API
        const loadData = async () => {
            const link = '/api/supervisor/actioned';
            try{
                const response = await apiRequest(link, 'GET', null, token);
                if(response.status === 200){
                    if(response.data.length > 0){
                        // console.log("Emails acionados carregados com sucesso:", response.data);
                        setEmails(response.data);
                    }else{
                        // console.log("Nenhum email acionado encontrado.");
                        setEmails([]);
                    }
                    setLoading(false)

                }
            }
            catch(error){
                console.error("Erro ao buscar emails acionados:", error);
            }
        }
        
        loadData();
    }, []);

    return <div className={styles.container}>
        <div className={styles.titleContainer}>
            <h3>Emails Acionados</h3>
        </div>
        {
            loading ? <LoadingComponent/> 
            :
            <div className={styles.itemsContainer}>
                {emails.length !== 0 ?emails.map((email) => (
                    <EmailAtiveElement key={email.id} triggedEmail={email} removeAlert={removeAlert}/>
                ))
                : <div className={styles.emptyState}>
                    <h3>Tudo em ordem por aqui</h3>
                    <p>Nenhum alarme foi acionado até ao momento.</p>
                    <div className={styles.iconWrapper}>
                        <FaRegClock /> {/* Ícone de sino riscado */}
                    </div>
                    </div>}
                </div>
        }
        </div>
}