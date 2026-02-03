import {useState} from 'react';
import styles from "./EmailForm.module.css"
//api
import apiRequest from '../../../data/apiRequest';
//context
import { useUser } from '../../../context/userContext';

export default function EmailForm({onClose, setCoporateEmail,setHasEmail, client_id}) {

    const [opcaoSelecionada, setOpcaoSelecionada] = useState('@gmail.com');
    const [tested, setTested] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        provider: '',
        password: ''
    });

    const {token} = useUser();
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Se o campo for o email, transformamos tudo em minúsculas
        const finalValue = name === "email" ? value.toLowerCase() : value;

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 1. Calcular o novo email final uma única vez
        const novoEmailCompleto = formData.email + opcaoSelecionada;
        
        // 3. Atualizar o estado (formData) com o valor final CORRETO
        // Esta atualização ainda é assíncrona, mas garantirá que o estado
        // esteja pronto para a próxima renderização.
        setFormData(prev => ({
            ...prev,
            ["email"]: novoEmailCompleto // Usa o valor calculado
        }));

        // Logica da API
        try {
            const response = await apiRequest('/api/email', 'POST', {
                client_id: client_id,
                email : novoEmailCompleto, // Usa o valor calculado
                password : formData.password
            }, token);
            
            if (response.status === 200) {
                setHasEmail(true)
                setCoporateEmail(response.data);
                // console.log("Email registado : ", response.data);
            }
        } catch (error) {
            console.error(error);
        }

        //limpar o form Data
        setFormData({
            email: '',
            provider: '',
            password:'',
            type: ''
        });
        onClose();

    };

    const handleTest = async (e) => {
        e.preventDefault();
    
        try{
            const response = await apiRequest('/api/supervisor/teste', 'POST', {
                email: formData.email + opcaoSelecionada,
                password: formData.password,
                id: ""
            }, token);

            if (response.status === 200) {
                console.log("Teste realizado com sucesso: ", response.data);
                setTested(true);
            }else {
                console.log("Teste falhou: ", response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h2>Associar Email Corporativo</h2>
            </div>

            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.contentInput}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <select
                        id="meuSelect"
                        value={opcaoSelecionada}
                        className={styles.providerContainer}
                        onChange={(e) => setOpcaoSelecionada(e.target.value)}
                    >
                        <option value="@gmail.com">@gmail.com</option>
                        <option value="@sapo.pt">@sapo.pt</option>
                    </select>
                </div>
                <div className={styles.contentInput}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.buttonContainer}>    
                    {
                        tested ? <button type="submit">Confirmar</button>   :
                        <button onClick={handleTest}>Teste</button>
                    }

                </div>
            </form>
        </div>
    );
}