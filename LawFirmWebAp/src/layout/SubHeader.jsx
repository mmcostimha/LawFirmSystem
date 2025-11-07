
import React from 'react'
import styles from './SubHeader.module.css'
import Modal from '../components/Modal';

export default function SubHeader({title, buttonFuntion} ) {

    const getTypeFromTitle = (title) => {
        switch (title) {
            case 'Clientes':
                return 'Cliente';
            case 'Alarmes':
                return 'Alarme';    
            default:
                return '';
        }    
    }

    return (
        <div className={styles.contrainer}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.rightSide}>
                {/* Espaço para futuros botões ou filtros */}
                <button onClick={buttonFuntion}> + Adicionar {getTypeFromTitle(title)} </button>
            </div>
            
        </div>
    )
}