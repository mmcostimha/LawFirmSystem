import {useState} from 'react';
import styles from "./EmailForm.module.css"

export default function EmailForm({onClose, setClients}) {

    const [opcaoSelecionada, setOpcaoSelecionada] = useState('@gmail.com');
    const [formData, setFormData] = useState({
        email: '',
        provider: '',
        type: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        console.log(formData)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData(prev => ({
            ...prev,
            ["email"]: prev.email + opcaoSelecionada
        }));
        console.log(formData);

        //Logica da API

        //limpar o form Data
        setFormData({
            email: '',
            provider: '',
            type: ''
        });
    };

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
                    <label htmlFor="type">Password:</label>
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
                    <button type="submit">Confirmar</button>
                    <button onClick={()=> console.log("testei")}>Teste</button>
                </div>
            </form>
        </div>
    );
}