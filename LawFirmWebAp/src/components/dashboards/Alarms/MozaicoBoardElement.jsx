import {} from "react"
//styles
import styles from "./MozaicoBoardElement.module.css"
//icon 
import { ImCross } from "react-icons/im";


export default function MozaicoBoardElement({item}){

    return <div className={styles.container}>

        <div className={styles.header}>
            <h2></h2>
            <ImCross className={styles.icon} size={25} color="red"/>
        </div>
        <strong>ID:</strong> {item.id} | <strong>Email:</strong> {item.email} |{" "}
        <strong>Tipo:</strong> {item.tipo} | <strong>Estado:</strong> {item.estado}
        
    </div>
}