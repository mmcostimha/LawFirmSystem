import React, { use, useEffect } from 'react';
import styles from './ListElement.module.css';
//modal
import Modal from '../../Modal';
// api
import apiRequest from '../../../data/apiRequest.jsx';
//context
import { useUser } from "../../../context/userContext"
// component
import ClientEditForm from './ClientEditForm.jsx';

export default function ListElement({ params, parChecker,setClients}) {


  const [editing, setEditing] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [coporateEmail, setCoporateEmail] = React.useState("");
  const [hasEmail, setHasEmail] = React.useState(false);

  const { token } = useUser();

  

  async function carregarEmail(id){
     try {
        const responce = await apiRequest('/api/email/id/'+ id, 'GET', null, token);
        
        setCoporateEmail(responce.data);
        setHasEmail(!!responce.data);
        console.log('Email carregado:', responce.data);
      } catch (err) {
        console.error('Falha ao carregar dados:', err);
      }
  }

  const handleEdit = () => {
    console.log("Editando item com id:", params.id);
    setEditing(false);
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRequest(`/api/user/${params.id}`, 'DELETE', null, token);
      if (response.status === 200) {
        // Atualize a lista de clientes ou faça outras ações necessárias após a exclusão
        setClients(prev => prev.filter(client => client.id !== params.id));
        // Feche o modal de exclusão
        setDeleting(false);
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
    
  };

  if (!params || typeof params !== 'object') {
    console.warn('ListElement recebeu params inválido:', params);
    return null;
  }
  const sensitiveKeys = ['password', 'role',"creationDate","username", "id"];
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
        <button className={styles.actionButtonEditar} onClick={()=>{setEditing(true), carregarEmail(params.id)}}>Editar</button>
        <button className={styles.actionButtonExcluir}onClick={()=>setDeleting(true)} >Excluir</button>
      </div>

      <Modal isOpen={editing} onClose={handleEdit} >
        <ClientEditForm params={params} setClients={setClients} setCoporateEmail={setCoporateEmail} coporateEmail={coporateEmail} setHasEmail={setHasEmail} hasEmail={hasEmail} />
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
