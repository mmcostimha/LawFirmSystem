import styles from "./EmailAtiveList.module.css"
import { useState, useEffect, use } from "react"
//components
import EmailAtiveElement from "./EmailAtiveElement"
//models
import { emailTrigger } from "../../../../models/Email/emailTrigger"
//contexts
import {useUser} from "../../../../context/userContext"
//api
import apiRequest from "../../../../data/apiRequest"

export default  function EmailAtiveList(){


    const [emails, setEmails] = useState([]);
    const { token } = useUser();

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
        <div className={styles.itemsContainer}>
            {emails.length !== 0 ?emails.map((email) => (
                <EmailAtiveElement key={email.id} triggedEmail={email} removeAlert={removeAlert}/>
            ))
            : <p>Nenhum email acionado</p>}
        </div>
    </div>
}