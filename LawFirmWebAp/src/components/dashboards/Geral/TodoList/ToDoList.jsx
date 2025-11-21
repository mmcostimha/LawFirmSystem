import { useState, useEffect } from "react";
//styles
import styles from "./ToDoList.module.css";
//components
import ListItems from "./ListItem";
//icons
import { FaPlus } from "react-icons/fa";

export default function ToDoList(){

    const [items, setItems] = useState([
        { id: 1 ,tarefa: "Tarefa 1 hvfsd lkljnsdfjlhvvasdlkjn fsdjkhfsdlkjnfsda jhfsadokjfsdlk jhfdoiufdn  iusdk fsdoiyub oihbfsd lkhj", data: "2024-01-15",estado: "pendente"  },
        { id: 2 ,tarefa: "Tarefa 2", data: "2024-01-16", estado: "concluido" },
        { id: 3 ,tarefa: "Tarefa 3", data: "2024-01-17", estado: "ative" },
        { id: 4 ,tarefa: "Tarefa 4", data: "2024-01-18", estado: "concluido" },
        { id: 5 ,tarefa: "Tarefa 5", data: "2024-01-19", estado: "concluido" },
        { id: 6 ,tarefa: "Tarefa 6", data: "2024-01-20", estado: "concluido" },
        { id: 7 ,tarefa: "Tarefa 7", data: "2024-01-21", estado: "concluido" },
        { id: 8 ,tarefa: "Tarefa 8", data: "2024-01-24", estado: "concluido" },
        { id: 9 ,tarefa: "Tarefa 9", data: "2024-01-24", estado: "ative" },
        { id: 10,tarefa: "Tarefa 10", data: "2024-01-24", estado: "ative" }
    ]);
    const agrupado = items.reduce((acc, item) => {
        if (!acc[item.data]) acc[item.data] = [];
        acc[item.data].push(item);
        return acc;
    }, {});

    return <div className={styles.container}>
        <div className={styles.addContentContainer}>

            <input type="text" placeholder="Adicionar nova tarefa..." />
            <button><FaPlus /></button>
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
                    Carregando
                </div>
            }
            
        </div>
    </div>
}