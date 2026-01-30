import { useState } from "react"
//styles
import styles from "./EmailAtiveElement.module.css"
//icons
import { FaArrowRightLong } from "react-icons/fa6";
//modals
import Modal from "../../../Modal"
//api
import apiRequest from "../../../../data/apiRequest";
//context
import { useUser } from "../../../../context/userContext";
//components
import LoadingComponent from "../../../loading/LoadingComponent";

export default function EmailAtiveElement({triggedEmail,removeAlert}) {
    const [modalOpen, setModalOpen] = useState(false);


    const{ token } = useUser();

    return (
        <>
            <div className={styles.container} onClick={() => setModalOpen(!modalOpen)}>
                <div className={styles.tipeContainer}>
                    {triggedEmail.type.charAt(0).toUpperCase() + triggedEmail.type.slice(1)}
                </div>
                {/* <div className={styles.arrowContainer}>
                    <FaArrowRightLong  />
                </div> */}
                <div className={styles.emailContainer}>
                    {triggedEmail.email}
                </div>
                
            </div>
            <Modal isOpen={modalOpen} onClose={()=> setModalOpen(false)}>
                <div className={styles.modalContent}>
                    <div className={styles.modalTitleContainer}>
                        <h2>Detalhes do Evento </h2>
                    </div>
                    <div className={styles.modalContentInput}>
                        <p><strong>Cliente:</strong> {triggedEmail.clientName }</p>
                        <p><strong>E-mail:</strong> {triggedEmail.email}</p>
                        {/* <div className={styles.modalDates}> */}
                            <p><strong>Criado:</strong>  {triggedEmail.creationData.split('T')[0]}</p>
                            {/* <p><strong>Acionado:</strong> {triggedEmail.dataCriation}</p> */}
                        {/* </div> */}
                        <p><strong>Tipo:</strong> {triggedEmail.type}</p>
                        <button onClick={() => setModalOpen(false)}>Voltar</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}