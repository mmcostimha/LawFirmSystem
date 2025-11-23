import styles from "./EmailAtiveList.module.css"
import { useState, useEffect, use } from "react"
//components
import EmailAtiveElement from "./EmailAtiveElement"
//models
import { emailTrigger } from "../../../../models/Email/emailTrigger"

export default  function EmailAtiveList(){

    const triggedEmails = [
        { id: 1, type: "Aima", email: "exemplolonguissimo@gmail.com", client: "Cliente Exemplo 01" },
        { id: 2, type: "Aviso", email: "cliente2@exemplo.com", client: "Cliente Exemplo 02" },
        { id: 3, type: "Lembrete", email: "cliente3@exemplo.com", client: "Cliente Exemplo 03" }
    ];

    const [emails, setEmails] = useState([]);

    const removeAlert = (id) => {
        setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
    }
    
    useEffect(() => {
        // Simulate fetching data from an API
        
        // In a real application, you would fetch data here and update state
        setEmails(triggedEmails);
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