import {} from "react"
import { Tooltip } from 'react-tooltip';
//styles
import styles from "./MozaicoBoardElement.module.css"
//icon 
import { LuTrash } from "react-icons/lu";
import { GiPlainCircle } from "react-icons/gi";


export default function MozaicoBoardElement({item ,deleteFunction}){

    function handletStateIconColor(){
        // console.log("Alarm recebido",item)
        if(item.state === "false" || item.state === false){
            return "green"
        }else{
            return "yellow"
        }       
    }
    let formatada = null;
    if (item.activationData) {
        const parsed = new Date(item.activationData);
        if (!isNaN(parsed)) {
            formatada = new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "numeric",
            year: "numeric",
            }).format(parsed);
        }
    }
    const formatarNome = (nome) => {
        const nomes = nome.trim().split(/\s+/); // Divide por espaços (lidando com espaços duplos)
        return nomes.slice(0, 2).join(' ');      // Pega do índice 0 ao 2 e junta com espaço
    };

    return <div className={styles.container}>

        <div className={styles.header}>
            <h2>{formatarNome(item.clientName)}</h2>
            <GiPlainCircle 
                className={styles.icon} 
                size={25} 
                color={handletStateIconColor()}
                data-tooltip-id="meu-botao-dica" 
                data-tooltip-content={`Estado: ${!item.state ? "ON" : "Acionado"}`}
                data-tooltip-place="top"
            />
        </div>

        <div className={styles.contentContainer}>

            {/* <p><strong>ID:</strong> {item.id}</p>   */}
            <p><strong>Email:</strong> {item.email}</p>
            <p><strong>Tipo:</strong> {item.type}</p>  
            {/* {
                !(item.state === "false" || item.state === false) &&
                <p><strong>Recebido:</strong> {item.activationData}</p>
            } */}
            
        </div>
        <div className={styles.footer}>
            <LuTrash className={styles.icon} onClick={() =>deleteFunction(item)} size={25} color='black'/>
        </div>
        <Tooltip id="meu-botao-dica" />
    </div>
}