import { useState, useEffect, use } from "react";
//styles
import styles from "./ToDoList.module.css";
//components
import ListItems from "./ListItem";
import LoadingComponent from "../../../loading/LoadingComponent";
//icons
import { FaPlus } from "react-icons/fa";
//models
import { taskModel } from "../../../../models/User/taskModel";
//api 
import apiRequest from "../../../../data/apiRequest";
//context
import { useUser } from "../../../../context/userContext";

export default function ToDoList(){

    const [items, setItems] = useState([]);
    const [newTask, setNewTask] = useState(taskModel);
    const [loading , setLoading] = useState(true);
    const [isLoadingNewTask, setIsLoadingNewTask] = useState(false);
    const sortedItems = [...items].sort((a, b) => new Date(b.data) - new Date(a.data));
    const { token, id } = useUser();
    const agrupado = sortedItems.reduce((acc, item) => {
        // Extrai apenas "2026-01-09" da string completa
        const dataApenas = item.creationDate.split('T')[0]; 
        if (!acc[dataApenas]) acc[dataApenas] = [];
        acc[dataApenas].push(item);
        return acc;
    }, {});

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
            clientId: id
        };

        setIsLoadingNewTask(true); // Garante que o loading começa aqui

        try {
            const responce = await apiRequest('/api/task', 'POST', formattedTask, token);
            if (responce.status === 200) {
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
                const link = "/api/task/" + id;
                const responce = await apiRequest(link, 'GET', null, token);
                
                if(responce.status === 200){
                    // console.log('Lista de Task: ',responce.data);
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

        { loading ? <LoadingComponent/>
            :
            <div className={styles.ListContainer}>
                {
                    !!items ?
                    <div className={styles.itemsContainer} >
                        {Object.entries(agrupado).map(([data, tasks], index) => (
                            <ListItems  key={index}  data={data} tasks={tasks} setTasks={setItems} par={index % 2}/>
                        ))}
                    </div>:
                    <div>
                        <LoadingComponent />
                    </div>
                }
            </div>
        }
    </div>
}