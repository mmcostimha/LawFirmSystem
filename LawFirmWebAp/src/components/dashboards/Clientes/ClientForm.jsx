import styles from "./ClientForm.module.css";
import {useState} from 'react';
//modelo
import {userCreatorStructure} from "../../../models/User/userModel"
//api
import apiRequest from "../../../data/apiRequest";
//context
import {useUser} from "../../../context/userContext"

export default function ClientForm({onClose, setClients}) {
    const [formData, setFormData] = useState(userCreatorStructure);
    const [tipoConta, setTipoConta] = useState("client");

    const {token} = useUser();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        try {
            const data = await apiRequest('/auth/register', 'POST', { ...formData, role: tipoConta }, token);

            // Limpa formulário
            setFormData(userCreatorStructure);

            // Atualiza lista
            if (data.role === 'client')
                setClients(prev => [...prev, data]);

            console.log('Usuário criado:', data);

        } catch (error) {
            console.error('Erro ao criar usuário:', error);
        }
        // Fecha modal
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
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputContainer}>
                <label htmlFor="provider">Número:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
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