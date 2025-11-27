import {useState} from 'react';
import styles from "./AlarmForm.module.css"

export default function AlarmForm({onClose, setAlarms}) {

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
                <h2>Novo Alarme</h2>
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
                    <label htmlFor="type">Tipo:</label>
                    <select
                        id="meuSelect2"
                        value={opcaoSelecionada}
                        className={styles.providerContainer}
                        onChange={(e) => setOpcaoSelecionada(e.target.value)}
                    >
                        <option value="Aima">AIMA</option>
                        {/* <option value="@sapo.pt">@sapo.pt</option> */}
                    </select>
                </div>
                <button type="submit">Confirmar</button>
            </form>
        </div>
    );
}