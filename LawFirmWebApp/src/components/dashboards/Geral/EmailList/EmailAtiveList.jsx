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
import loading_gif from "../../../../assets/Images/loading.svg"

export default  function EmailAtiveList(){

    const [emails, setEmails] = useState([]);
    const { token } = useUser();
    const [loading, setLoading] = useState(true);
    const [chekingEmails, setChekingEmails] = useState(false);

    const removeAlert = (id) => {
        setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
    }

    
    useEffect(() => {
        // Simulate fetching data from an API
        const loadData = async () => {
            const link = '/api/supervisor/actioned';
            if(!token){
                return;
            }
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
    }, [token, chekingEmails]);

    const handleCheckEmails = async (e) => {
        e.preventDefault();
        setChekingEmails(true);
        const link = "/api/supervisor/check";
        try {
            const response =apiRequest(link, 'POST', {}, token);
            // Aqui você pode atualizar o estado ou fazer algo com a resposta
        } catch (error) {
            console.error("Error checking emails:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simula um atraso de 2 segundos
        setChekingEmails(false);
        
    };

    

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
                : 
                <div className={styles.emptyState}>
                    <h3>Tudo em ordem por aqui!</h3>
                    <p>Nenhum alarme foi acionado até ao momento.</p>
                    <div className={styles.iconWrapper}>
                        <FaRegClock /> {/* Ícone de sino riscado */}
                    </div>
                </div>}
                
            </div>
                
        }
            <button className={styles.checkEmailsButton} onClick={handleCheckEmails} disabled={chekingEmails}>
                {chekingEmails ? <img src={loading_gif} alt="Loading gift"/> : "Verificar"}
            </button>
        </div>
}