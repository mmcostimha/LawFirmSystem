import React from 'react';
import styles from './ListElement.module.css';
//modal
import Modal from '../Modal';

export default function ListElement({ params, parChecker}) {


  const [editing, setEditing] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const handleEdit = () => {
    console.log("Editando item com id:", params.id);
    setEditing(false);
  };
  const handleDelete = () => {
    console.log("Deletando item com id:", params.id);
    setDeleting(false);
  };

  if (!params || typeof params !== 'object') {
    console.warn('ListElement recebeu params inválido:', params);
    return null;
  }
  const sensitiveKeys = ['password', 'role'];
  // Filtra apenas os pares seguros
  const safeEntries = Object.entries(params).filter(
    ([key]) => !sensitiveKeys.includes(key)
  );
  const getClassForKey = (key) => {
    switch (key) {
      case 'id':
        return styles.idField;
      case 'name':
        return styles.nameField;
      case 'email':
        return styles.emailField;
      case 'phone':
        return styles.phoneField;
      case 'username':
        return styles.usernameField;
      default:
        return styles.item;
    }
  };


  return (
    <div className={parChecker ? styles.containerPar:styles.containerImpar}>
      {safeEntries.map(([key, value]) => (
        <div key={key} className={getClassForKey(key)}>
          {typeof value === 'object' ? JSON.stringify(value) : value?.toString()}
          
        </div>
      ))}
      <div className={styles.actionsField}>
        <button className={styles.actionButtonEditar} onClick={()=>setEditing(true)}>Editar</button>
        <button className={styles.actionButtonExcluir}onClick={()=>setDeleting(true)} >Excluir</button>
      </div>

      <Modal isOpen={editing} onClose={handleEdit} >
        <div>Conteúdo do Modal para o item {params.id}</div>
      </Modal>
      <Modal isOpen={deleting} onClose={()=>setDeleting(false)} >
        <div className={styles.deleteContainer}>
          <h2>Tem certeza quer excluir o cliente: </h2>
          <h2>{params.name} </h2>
          <h2>Todos os dados relativos a este cliente serão apagados permanentemente</h2>
          <button className={styles.confirmDeleteButton} onClick={handleDelete}>Confirmar Exclusão</button>
        </div>
      </Modal>
    </div>
  );
}
