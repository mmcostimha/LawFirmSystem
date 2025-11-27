import {} from "react"
//styles
import styles from "./MozaicoBoardElement.module.css"
//icon 
import { ImCross } from "react-icons/im";


export default function MozaicoBoardElement({item, setItem ,deleteFunction}){

    return <div className={styles.container}>

        <div className={styles.header}>
            <h2>{item.clientName}</h2>
            <ImCross className={styles.icon} onClick={() =>deleteFunction(item)} size={25} color="red"/>
        </div>

        <div className={styles.contentContainer}>

            {/* <p><strong>ID:</strong> {item.id}</p>   */}
            <p><strong>Email:</strong> {item.email}</p>
            <p><strong>Tipo:</strong> {item.type}</p> 
            <p><strong>Estado:</strong> {!item.state ? "ON" : "Acionado"}</p>      
            
        </div>

    </div>
}