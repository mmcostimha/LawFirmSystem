import { useState } from "react";
//styles
import styles from "./ListItems.module.css"
//icons
import { FaTrash, FaRegEdit} from "react-icons/fa";
import { MdOutlineCheckBox,MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
//api
import apiRequest from "../../../../data/apiRequest";
//context
import { useUser } from "../../../../context/userContext";


export default function ListItem({tasks, setTasks,data}){
    
    const { token, id } = useUser();

    async function alterarEstado(task) {  
        // console.log('Alterando estado da task:', task);
        //faça a chamada para o backend aqui para atualizar o estado da tarefa ⚠️⚠️⚠️
        const link = '/api/task';
        try {
            const responce = await apiRequest(link, 'PUT', task, token);

            if (responce.status == 200) {
                console.log('Estado da task alterado com sucesso:', responce.data);
                setTasks(prev =>
                    prev.map(t =>
                        t.id === task.id
                            ? { ...t, state: t.state= responce.data.state }
                            : t
                    )
                );
            }
        }
        catch (err) {
            console.error('Falha ao alterar estado da task:', err);
            return;
        }
    }
    async function deleteTask(task) {
        //faça a chamada para o backend aqui para atualizar o estado da tarefa 
        const link = '/api/task';
        // console.log('Deletando task:', task);
        try {
            const responce = await apiRequest(link, 'DELETE', task, token);
            if (responce.status == 200) {
                // console.log('Task deletada com sucesso:', responce.data);
                setTasks(prev =>
                    prev.filter(t => t.id !== task.id)
                );
            }
        }
        catch (err) {
            console.error('Falha ao deletar task:', err);
            return;
        }   
       
    }
        

    return <div className={styles.container} >
        <h2>{data}</h2>
        
        {tasks.map((task) => ( 
            <div
                key={task.id}
                className={styles.taskContainer}
            >
                <div className={styles.taskOwnerContainer}>
                    {task.taskOwner}
                </div>
                <div className={styles.textContainer} style={
                    {
                        textDecoration: (task.state === true) ? "line-through" : "none",
                        color: (task.state === true) ? "gray" : "black"
                    }
                }>
                    {task.task}
                </div>
                {
                    task.clientId == id && <div className={styles.actionsContainer} >
                    <div className={styles.editIcon} onClick={()=>alterarEstado(task) }>
                         {
                            task.state === true ? <MdOutlineCheckBox /> : <MdOutlineCheckBoxOutlineBlank />
                         }

                    </div>
                    <div className={styles.editIcon} onClick={()=>deleteTask(task) }>

                        <FaTrash /> 
                            
                    </div>
                   
                </div>
                }
                
            </div>
        ))}
    </div>
}