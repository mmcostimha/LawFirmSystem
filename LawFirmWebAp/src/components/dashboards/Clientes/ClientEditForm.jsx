import styles from './ClientEditForm.module.css';
import { useState } from 'react';
//api
import apiRequest from "../../../data/apiRequest"
//contex
import {useUser} from "../../../context/userContext"
//Modal
import Modal from '../../Modal';
//component
import EmailForm from '../CorporateEmail/EmailForm';

export default function ClientEditForm({params, setClients,coporateEmail,setHasEmail, hasEmail, setCoporateEmail}) {

    const [newData, setNewData] = useState(params);
    const [newCorporateEmalView, setNewCorporateEmalView ] = useState(false);
    const {token} = useUser();


    let formatada = null;
    if (params.creationDate) {
        const parsed = new Date(params.creationDate);
        if (!isNaN(parsed)) {
            formatada = new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
            }).format(parsed);
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    async function editClient() {
        try {
            const response = await apiRequest('/api/user', 'PUT', {
                name : newData.name,
                email : newData.email,
                phone : newData.phone,
                role : newData.role,
                username : newData.username,
                password : ""
            }, token);
            
            if (response.status === 200) {
                setClients(prev => {
                    // se params for um array, atualiza o item correspondente
                    if (Array.isArray(prev)) {
                        return prev.map(item => {
                            const isMatch = (response.data.id && item.id === response.data.id) || (item.username === response.data.username);
                            return isMatch ? { ...item, ...response.data } : item;
                        });
                    }
                    // se params for um objeto único, mescla com os novos dados
                    return { ...prev, ...response.data };
                });
                console.log("Editado para: ", response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return <div className={styles.editContainer}>
        <div className={styles.titleContainer}>
            <h2>Editar Cliente </h2>    
        </div>

        <div className={styles.inputContainer}>
            <label htmlFor="name">Nome:</label>
            <input  
                id="name"
                name='name'
                value={newData.name}
                onChange={handleChange}
                type="text"
            />
        </div>
        <div className={styles.inputContainer}>
            <label htmlFor="phone">Número:</label>
            <input
                id='phone'
                name='phone' 
                value={newData.phone} 
                onChange={handleChange}
                type="number"
            />
        </div>
        <div className={styles.inputContainer}>
            <label htmlFor="email">Email Pessoal:</label>
            <input 
                id='email'  
                name='email'
                value={newData.email} 
                onChange={handleChange} 
                type="email"
            />
        </div>
        {console.log(newData)}
        {hasEmail ?
        <div className={styles.inputContainer}>
            <label htmlFor="corporateEmail">Email Corporativo:</label>  
            <p>{coporateEmail.email}</p>

        </div>:
        <>
            <div className={styles.inputContainer}>
                <label htmlFor="corporateEmail">Email Corporativo:</label>  
                <div className={styles.associateEmailContainer}>
                    <button  type="text" onClick={()=>{setNewCorporateEmalView(true),console.log("Abrindo o Emal Form")} }> Associar Email </button>
                </div>
            
            </div>
        </>
        }
        <div className={styles.inputContainer}>
            <label htmlFor="username">Username:</label>
            <p>{params.username}</p>
        </div>
        <div className={styles.inputContainer}>
            <label htmlFor="creationDate">Registado em:</label>
            {
                !formatada ? <p>----</p>:
                <p>{formatada}</p>
            }
        
        </div>
            <div className={styles.butonsContainer}>
            {
                hasEmail &&
                <button className={styles.removeEmailButton} onClick={()=>{setCoporateEmail(""), setHasEmail(false)}}>Remover Email Corporativo</button>
            }
            <button className={styles.saveButton} onClick={editClient}>Salvar Alterações</button>
        </div>

        <Modal isOpen={newCorporateEmalView} onClose={()=>setNewCorporateEmalView(false)}>
            <EmailForm onClose={()=>setNewCorporateEmalView(false)} setCoporateEmail={setCoporateEmail}/>
        </Modal>
    </div>
}
