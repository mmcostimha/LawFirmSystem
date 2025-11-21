import { useState } from "react";
//styles
import styles from "./ListItems.module.css"
//icons
import { FaTrash, FaRegEdit} from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import { FaCheckDouble } from "react-icons/fa6";

export default function ListItem({tarefas, setTarefa,data}){
    
    function alterarEstado(task) {
        setTarefa(prev =>
            prev.map(t =>
                t.id === task.id
                    ? { ...t, estado: t.estado === "concluido" ? "ative" : "concluido" }
                    : t
            )
        );
        //faça a chamada para o backend aqui para atualizar o estado da tarefa
    }
        

    return <div className={styles.container} >
        <h2>{data}</h2>
        
        {tarefas.map((task) => ( 
            <div
                key={task.id}
                className={styles.taskContainer}
            >
                <div className={styles.textContainer} style={
                    {
                        textDecoration: !(task.estado === "concluido") ? "line-through" : "none",
                        color: !(task.estado === "concluido") ? "gray" : "black"
                    }
                }>
                    {task.tarefa}
                </div>
                <div className={styles.actionsContainer} >
                    <div className={styles.editIcon} onClick={()=>alterarEstado(task) }>
                         {
                            task.estado === "concluido" ?<FiCheck /> : <FaCheckDouble />

                         }
                         
                    </div>
                   
                </div>
            </div>
        ))}
    </div>
}