import { useState } from "react"
//styles
import styles from "./EmailAtiveElement.module.css"
//icons
import { FaArrowRightLong } from "react-icons/fa6";
//modals
import Modal from "../../../Modal"

export default function EmailAtiveElement({triggedEmail,removeAlert}) {
    const [modalOpen, setModalOpen] = useState(false);

    const handleResolveAlert = () => {
        // lógica para marcar o alerta como resolvido
        console.log(`Alerta do e-mail ${triggedEmail.email} marcado como resolvido.`);
        setModalOpen(false);
        // Aqui você pode adicionar lógica adicional, como atualizar o estado ou fazer uma chamada à API

        // Retirar o alerta da lista ou marcar como resolvido
        removeAlert(triggedEmail.id);
    }   

    return (
        <>
            <div className={styles.container} onClick={() => setModalOpen(!modalOpen)}>
                <div className={styles.tipeContainer}>
                    {triggedEmail.type}
                </div>
                <div className={styles.arrowContainer}>
                    <FaArrowRightLong />
                </div>
                <div className={styles.emailContainer}>
                    {triggedEmail.email.split('@')[0]}
                </div>
                
            </div>
            <Modal isOpen={modalOpen} onClose={()=> setModalOpen(false)}>
                <div className={styles.modalContent}>
                    <div className={styles.modalTitleContainer}>
                        <h2>Detalhes do Evento </h2>
                    </div>
                    <div className={styles.modalContentInput}>
                        <p><strong>Cliente:</strong> {triggedEmail.client }</p>
                        <p><strong>E-mail:</strong> {triggedEmail.email}</p>
                        <div className={styles.modalDates}>
                            <p><strong>Criado em:</strong>  {triggedEmail.dataTrigger}</p>
                            <p><strong>Acionado em:</strong> {triggedEmail.dataCriation}</p>
                        </div>
                        <p><strong>Tipo:</strong> {triggedEmail.type}</p>
                        <button onClick={handleResolveAlert}>Resolvido</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}