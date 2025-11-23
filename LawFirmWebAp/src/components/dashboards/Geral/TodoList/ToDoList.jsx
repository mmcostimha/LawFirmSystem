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

export default function ToDoList(){

    const [items, setItems] = useState([]);
    const [newTask, setNewTask] = useState(taskModel);
    const sortedItems = [...items].sort((a, b) => new Date(b.data) - new Date(a.data));
    const agrupado = sortedItems.reduce((acc, item) => {
        if (!acc[item.data]) acc[item.data] = [];
        acc[item.data].push(item);
        return acc;
    }, {});

    async function addTask(tarefa){
        //Adicionar tarefa na lista
        tarefa.data = new Date().toISOString().split('T')[0]; //Data atual

        //API call to save task get id
        tarefa.id = items.length + 1; //Simular id

        //Update lista
        setItems([...items, tarefa]);
        setNewTask(taskModel);
    }

    useEffect(() => {
        // Simular carregamento de dados
        //Camada a API aqui
        const fakeAPICall =[
            { id: 1 ,tarefa: "Tarefa 1 hvfsd lkljnsdfjlhvvasdlkjn fsdjkhfsdlkjnfsda jhfsadokjfsdlk jhfdoiufdn  iusdk fsdoiyub oihbfsd lkhj", data: "2024-01-15",estado: "concluido"  },
            { id: 2 ,tarefa: "Tarefa 2", data: "2024-01-16", estado: "concluido" },
            { id: 3 ,tarefa: "Tarefa 3", data: "2024-01-17", estado: "ative" },
            { id: 4 ,tarefa: "Tarefa 4", data: "2024-01-18", estado: "concluido" },
            { id: 5 ,tarefa: "Tarefa 5", data: "2024-01-19", estado: "concluido" },
            { id: 6 ,tarefa: "Tarefa 6", data: "2024-01-20", estado: "concluido" },
            { id: 7 ,tarefa: "Tarefa 7", data: "2024-01-21", estado: "concluido" },
            { id: 8 ,tarefa: "Tarefa 8", data: "2024-01-24", estado: "concluido" },
            { id: 9 ,tarefa: "Tarefa 9", data: "2024-01-24", estado: "ative" },
            { id: 10,tarefa: "Tarefa 10", data: "2024-01-24", estado: "ative" }
        ]
        setTimeout(() => {
            setItems(fakeAPICall);
            console.log("Dados carregados");
        }, 1000);
    }, []);

    function handleEnter(e) {
        if (e.key === "Enter") {
        // aqui colocas a ação desejada
            if (!newTask.tarefa.trim()) return;
            addTask(newTask);
        }
    }

    return <div className={styles.container}>
        <div className={styles.addContentContainer}>
            <input type="text" placeholder="Adicionar nova tarefa..." value={newTask.tarefa} onKeyDown={handleEnter} onChange={e => setNewTask(prev => ({ ...prev, tarefa: e.target.value}))}/>
            <button onClick={()=>{
                if (!newTask.tarefa.trim()) return;
                addTask(newTask)}
            }
             disabled={!newTask.tarefa.trim()}
             style={{ opacity: !newTask.tarefa.trim() ? 0.8 : 1 }}
            ><FaPlus /></button>
        </div>
        <div className={styles.ListContainer}>
            {
                !!items ?
                <div className={styles.itemsContainer} >
                    {Object.entries(agrupado).map(([data, tarefas], index) => (
                        <ListItems  key={index}  data={data} tarefas={tarefas} setTarefa={setItems} par={index % 2}/>
                    ))}
                </div>:
                
                <div>
                    <LoadingComponent />
                </div>
            }
            
        </div>
    </div>
}