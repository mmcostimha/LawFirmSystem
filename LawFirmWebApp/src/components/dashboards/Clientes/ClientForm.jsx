import styles from "./ClientForm.module.css";
import {useState} from 'react';
//modelo
import {userCreatorStructure} from "../../../models/User/userModel"
//api
import apiRequest from "../../../data/apiRequest";
import { validateForm } from "../../../data/formValidation";
//context
import {useUser} from "../../../context/userContext"

export default function ClientForm({onClose, setClients}) {
    const [formData, setFormData] = useState(userCreatorStructure);
    const [prefixo, setPrefixo] = useState('+351'); // Padrão Portugal
    const [tipoConta, setTipoConta] = useState("client");
    const [errors, setErrors] = useState({}); // Estado para guardar erros
    const {token} = useUser();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpa o erro do campo enquanto o utilizador escreve
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Se quiseres validar apenas o corpo do número (os 9 a 12 dígitos)
        const formErrors = validateForm(formData);    
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const response = await apiRequest('/auth/register', 'POST', { ...formData, role: tipoConta.toLowerCase() , prefix: prefixo }, token);
            setFormData(userCreatorStructure);
            if (!!response && tipoConta === 'client') {
                const newClient = {
                    id: response.data.id,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    prefix: prefixo,
                    role: tipoConta,
                    creationDate: response.data.creationDate
                };
                console.log('Usuário criado com sucesso:', newClient);
                
                setClients(prev => [...prev, newClient]);
            }

        } catch (error) {
            console.error('Erro ao criar usuário:', error);
        }
        onClose();
    };

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h2>Novo Usuário</h2>
            </div>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.inputContainer}>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}  placeholder="Márcio Costa" required/>
                    {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="exemplo@gmail.com" required/>
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
                            type="text"
                            id="phone"
                            name="phone"
                            placeholder="912345678"
                            value={formData.phone}
                            onChange={handleChange}
                            className={errors.phone ? styles.inputError : ''}
                            maxLength={9}
                            required
                        />
                    </div>
                    {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="type">Tipo:</label>
                    <select
                        id="meuSelect"
                        value={tipoConta}
                        className={styles.providerContainer}
                        onChange={(e) => setTipoConta(e.target.value)}
                    >
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Confirmar</button>
            </form>
        </div>
    );
}