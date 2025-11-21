import styles from "./ClientForm.module.css";
import {useState} from 'react';
//modelo
import {userStructure} from "../../../models/User/userModel"

export default function ClientForm() {
    const [formData, setFormData] = useState(userStructure);
    const [tipoConta, setTipoConta] = useState("cliente");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
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
                        value={formData.email}
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
                        id="provider"
                        name="provider"
                        value={formData.provider}
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
                        <option value="client">Cliente</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <button type="submit">Confirmar</button>
            </form>
        </div>
    );
}