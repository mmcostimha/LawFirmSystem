import { useState, useEffect, use } from "react";
//styles
import styles from "./ToDoList.module.css";
//components
import ListItems from "./ListItem";
import LoadingComponent from "../../../loading/LoadingComponent";
//icons
import { FaPlus } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
//models
import { taskModel } from "../../../../models/User/taskModel";
//api 
import apiRequest from "../../../../data/apiRequest";
//context
import { useUser } from "../../../../context/userContext";
import { useFilter } from "../../../../context/filterContext.jsx";

export default function ToDoList(){

    const [items, setItems] = useState([]);
    const [newTask, setNewTask] = useState(taskModel);
    const [loading , setLoading] = useState(true);
    const [isLoadingNewTask, setIsLoadingNewTask] = useState(false);
    const sortedItems = [...items].sort((a, b) => new Date(b.data) - new Date(a.data));
    const { token, id } = useUser();
    const { searchTerm } = useFilter();
    const agrupado = sortedItems.reduce((acc, item) => {
        // Extrai apenas "2026-01-09" da string completa
        const dataApenas = item.creationDate.split('T')[0]; 
        if (!acc[dataApenas]) acc[dataApenas] = [];
        acc[dataApenas].push(item);
        return acc;
    }, {});
    console.log("Agrupado: ", agrupado);

    const formatTaskText = (text) => {
        if (!text) return "";
        let formatted = text.trim();
        
        // Pôr a primeira letra em maiúscula
        formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
        
        // Adicionar ponto final se não existir nenhum sinal de pontuação no fim
        if (!/[.!?]$/.test(formatted)) {
            formatted += ".";
        }
        
        return formatted;
    };

    async function addTask(task) {
        // 1. Formatar o texto da task antes de enviar
        const formattedTask = {
            ...task,
            task: formatTaskText(task.task), // Aplica a formatação aqui
            creationDate: new Date().toISOString(),
            clientId: id,
        };

        setIsLoadingNewTask(true); // Garante que o loading começa aqui

        try {
            const responce = await apiRequest('/api/task', 'POST', formattedTask, token);
            if (responce.status === 200) {
                // console.log('Task adicionada com sucesso:', responce.data);
                setItems(prev => [...prev, responce.data]);
                setNewTask(taskModel); // Limpa o input apenas após o sucesso
            }
        } catch (err) {
            console.error('Falha ao adicionar task:', err);
        } finally {
            setIsLoadingNewTask(false);
        }
    }
    
    useEffect(() => {
        //Camada a API aqui
        const loadData = async () => {
            if (!token || !id) return;
            //chamada API aqui
            try {
                // const link = "/api/task/" + id;
                const link = "/api/task";
                const responce = await apiRequest(link, 'GET', null, token);
                
                if(responce.status === 200){
                    console.log('Lista de Task: ',responce.data);
                    setItems(responce.data);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Falha ao carregar dados:', err);
            }
        }
        loadData();
    }, [token, id]);

    function handleEnter(e) {
        if (e.key === "Enter" && !isLoadingNewTask) {
            setIsLoadingNewTask(true);
            if (!newTask.task.trim()) return;
            addTask(newTask);
        }
    }
    const itensFiltred = Object.entries(agrupado).reduce((acc, [data, tarefas]) => {
    
        // Filtramos o array de tarefas para esta data específica
        const filtradas = tarefas.filter(item => {
            const termo = searchTerm.toLowerCase();
            
            // Ajustei para 'task', que é o que aparece no seu console log
            return (
                item.task?.toLowerCase().includes(termo) ||
                item.taskOwner?.toLowerCase().includes(termo)
                // Adicione item.name ou item.phone se eles existirem dentro do objeto da tarefa
            );
        });

        // Só adicionamos a data ao resultado se houver alguma tarefa que passou no filtro
        if (filtradas.length > 0) {
            acc[data] = filtradas;
        }

        return acc;
    }, {});

    return <div className={styles.container}>
        <div className={styles.addContentContainer}>
            <input type="text" placeholder="Adicionar nova tarefa..." value={newTask.task} onKeyDown={handleEnter} onChange={e => setNewTask(prev => ({ ...prev, task: e.target.value}))}/>
            <button onClick={()=>{
                if (!newTask.task.trim()) return;
                addTask(newTask)}
            }
             disabled={!newTask.task.trim()}
             style={{ opacity: !newTask.task.trim() ? 0.8 : 1 }}
            ><FaPlus /></button>
        </div>

        {loading ? (
            <LoadingComponent />
        ) : items.length === 0 ? (
            <div className={styles.ListContainer}>
                <div className={styles.emptyState}>
                    <h3>Tudo em ordem por aqui!</h3>
                    <p>Nenhuma tarefa pendente.</p>
                    <div className={styles.iconWrapper}>
                        <FaRegClock />
                    </div>
                </div>
            </div>
        ) : (
            <div className={styles.ListContainer}>
                <div className={styles.itemsContainer}>
                    {Object.entries(itensFiltred).map(([data, tasks], index) => (
                        <ListItems 
                            key={index} 
                            data={data} 
                            tasks={tasks} 
                            setTasks={setItems} 
                            par={index % 2} 
                        />
                    ))}
                </div>
            </div>
        )}
    </div>
}