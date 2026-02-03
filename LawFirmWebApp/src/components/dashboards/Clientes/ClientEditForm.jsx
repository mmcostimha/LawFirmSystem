import styles from './ClientEditForm.module.css';
import { useState } from 'react';
//api
import apiRequest from "../../../data/apiRequest"
//contex
import {useUser} from "../../../context/userContext"
import { validateForm } from '../../../data/formValidation';
//Modal
import Modal from '../../Modal';
//component
import EmailForm from '../CorporateEmail/EmailForm';

export default function ClientEditForm({params, setClients,coporateEmail,setHasEmail, hasEmail, setCoporateEmail,closeForm}) {

    // const { foundPrefix, remaining } = parsePhone(params.phone);
    const [prefixo, setPrefixo] = useState(params.prefix);
    const [phone, setPhone] = useState(params.phone);
    const [newData, setNewData] = useState(params);
    const [newCorporateEmalView, setNewCorporateEmalView ] = useState(false);
    const {token} = useUser();
    const [errors, setErrors] = useState({}); // Estado para guardar erros   

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
        
        setNewData({ ...newData, [name]: value });
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleEmailDelete = async (e) => {
        e.preventDefault();
        
        try {
            const response = await apiRequest('/api/email/'+ newData.username , 'DELETE', null, token);
            
            if (response.status === 200) {
                // setCoporateEmail(response.data);
                // console.log("Email corporativo eliminado: ", response.data);
                setCoporateEmail("")
                setHasEmail(false)
            }
        } catch (error) {
            console.error(error);
        }

    };
    async function editClient() {
        // Se quiseres validar apenas o corpo do número (os 9 a 12 dígitos)

        const clientData = {
            id: newData.id,
            name : newData.name,
            email : newData.email,
            phone : phone,
            prefix: prefixo,
            role : newData.role,
            username : newData.username,
            password : ""
        }
        console.log("editClient", clientData);
        const formErrors = validateForm(clientData); 
        
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        
        try {
            const response = await apiRequest('/api/user', 'PUT', clientData, token);
            
            if (response.status === 200) {
                console.log("Cliente editado com sucesso: ", response.data);
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
                // console.log("Editado para: ", response.data);
                closeForm();
            }
        } catch (error) {
            console.error(error);
        }
    };

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
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            
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
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>
        <div className={styles.inputContainer}>
            <label htmlFor="phone">Número:</label>
            <div className={styles.phoneInputGroup}> 
                <select 
                    value={prefixo} 
                    onChange={(e) => setPrefixo(e.target.value)}
                    className={styles.prefixSelect}
                >
                    <option value="+351">+351 (PT)</option>
                    <option value="+34">+34 (ES)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+1">+1 (USA)</option>
                </select>
                <input
                    id='phone'
                    name='phone'
                    type="text"
                    // .slice(3) remove os primeiros 3 caracteres
                    // .replace(...) adiciona o espaço após o 3º dígito do que sobrou
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={9}
                />
            </div>
            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
        </div>
        {hasEmail ?
        <div className={styles.inputContainer}>
            <label htmlFor="corporateEmail">Email Corporativo:</label>  
            <p>{coporateEmail.email}</p>

        </div>:
        <>
            <div className={styles.inputContainer}>
                <label htmlFor="corporateEmail">Email Corporativo:</label>  
                <div className={styles.associateEmailContainer}>
                    <button  type="text" onClick={()=>{setNewCorporateEmalView(true)} }> Associar Email </button>
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
                <button className={styles.removeEmailButton} onClick={(e)=>{handleEmailDelete(e)}}>Remover Email Corporativo</button>
            }
            <button className={styles.saveButton} onClick={editClient}>Salvar</button>
        </div>

        <Modal isOpen={newCorporateEmalView} onClose={()=>setNewCorporateEmalView(false)}>
            <EmailForm onClose={()=>setNewCorporateEmalView(false)} setCoporateEmail={setCoporateEmail} setHasEmail={setHasEmail} client_id={newData.id}/>
        </Modal>
    </div>
}
