import {useEffect, useState} from 'react';
import styles from "./AlarmForm.module.css"
//api
import apiRequest from '../../../data/apiRequest';
//context
import { useUser } from '../../../context/userContext';
//components
import AlarmeFormListElement from './AlarmeFormListElement';
import {validateForm} from "../../../data/formValidation" 

export default function AlarmForm({onClose, setAlarms, alarms}) {
    // const clientId = 1; //temporario
    const [opcaoSelecionada, setOpcaoSelecionada] = useState('@gmail.com');
    const [tipoSelecionado, setTipoSelecionado] = useState('aima');
    const [formData, setFormData] = useState({
        email: '',
        clientName: '',
        provider: '',
        type: 'aima'
    });
    const [options, setOptions] = useState([]);
    const [formErrors, setFormErrors] = useState({});

    const {token} = useUser();

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // console.log("mudando", formData)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const novoEmailCompleto = formData.email + opcaoSelecionada;
        const clientId = filteredOptions[0]?.clientId; 
        setFormData(prev => ({
            ...prev,
            ["email"]: novoEmailCompleto
        }));
        const alarmeJaExiste = alarms.some(alarm => 
            alarm.email === novoEmailCompleto && alarm.type === formData.type
        );

        const validation = validateForm(formData, opcaoSelecionada);
        if (!validation.isValid) {
            setFormErrors(validation.errors);
            return; // Interrompe o envio
        }

        if (alarmeJaExiste) {
            alert('Este alarme já existe!');
            return;
        }else{
            try{
                const response = await apiRequest('/api/supervisor/'+ clientId +"/" + formData.type, 'POST', {}, token);
    
                if (response.status === 200) {
                    // console.log("Alarme criado com sucesso:", response.data);
                    setAlarms(prev=>([...prev,response.data]))
                }
            }
            catch(e){
                console.error("Erro ao criar alarme:", e);
            }
        }
        setFormData({
            email: '',
            clientName: '', 
            provider: '',
            type: 'aima'
        });
        onClose();
    };
    const atualizeFormData = (option) => {
        const [emailCore, dominio] = option.email.split('@');
        const dominioCompleto = `@${dominio}`;
        setFormData({
            ...formData, // Mantém outros campos como 'type'
            email: emailCore,
            clientName: option.clientName,
        });
        setOpcaoSelecionada(dominioCompleto);
    }
    
    const filteredOptions = options.filter((option) => {
        const emailMatches = option.email
            .toLowerCase()
            .includes(formData.email);
        
        const nameMatches = option.clientName
            .includes(formData.clientName);

        // Retorna verdadeiro se o item coincidir com ambos os filtros
        return emailMatches && nameMatches;
    });

    useEffect(() => {
        async function carregarOptions() {
            try {
                const responce = await apiRequest('/api/email/list', 'GET', null, token);
                setOptions(responce.data);
                // console.log('Dados carregados Options:', responce.data);
            } catch (err) {
                console.error('Falha ao carregar dados:', err);
            }
        }
        carregarOptions();

    }, [token]);

    return (
        <div className={styles.container}>
            <div className={styles.containerForm}>
                <div className={styles.titleContainer}>
                    <h2>Novo Alarme</h2>
                </div>

                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <div className={styles.contentInput}>
                        <label>Email:</label>
                        <input 
                            name="email" 
                            value={formData.email} 
                            placeholder="exemplo"
                            onChange={(e) => {
                                handleChange(e);
                                if (formErrors.email) setFormErrors(prev => ({...prev, email: null}));
                            }}
                        />
                        {formErrors.email && <span className={styles.errorText}>{formErrors.email}</span>}

                        <select id="meuSelect"
                            value={opcaoSelecionada}
                            className={styles.providerContainer}
                            onChange={(e) => setOpcaoSelecionada(e.target.value)}
                            >
                            <option value="@gmail.com">@gmail.com</option>
                            <option value="@sapo.pt">@sapo.pt</option>
                        </select>
                    </div>
                    <div className={styles.contentInput}>
                        <label htmlFor="name">Nome:</label>
                        <input
                            type="text"
                            id="clientName"
                            name="clientName"
                            placeholder="Nome Do Cliente"
                            value={formData.clientName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.contentInput}>
                        <label htmlFor="type">Tipo:</label>
                        <select
                            id="meuSelect2"
                            value={tipoSelecionado}
                            className={styles.providerContainer}
                            onChange={(e) => setTipoSelecionado(e.target.value)}
                        >
                            <option value="Aima">AIMA</option>
                            {/* <option value="@sapo.pt">@sapo.pt</option> */}
                        </select>
                        {formErrors.clientName && <span className={styles.errorText}>{formErrors.clientName}</span>}
                    </div>
                    <button type="submit">Confirmar</button>
                </form>
            </div>
            <div className={styles.optionsListContainer}>
                <h2>Clientes Disponíveis</h2>
                <div className={styles.listContainer}>
                    {
                        // Mudamos de 'options' para 'filteredOptions'
                        filteredOptions && filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <AlarmeFormListElement 
                                    key={option.id || option.email} // Não esqueça da key
                                    option={option} 
                                    setOption={() => atualizeFormData(option)} 
                                />
                            ))
                        ) : (
                            <p>Nenhum cliente encontrado com esses critérios.</p>
                        )
                    }
                </div>
            </div>
        </div>
    );
}