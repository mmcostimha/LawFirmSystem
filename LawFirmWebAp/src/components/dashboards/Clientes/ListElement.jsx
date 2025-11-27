import React, { use, useEffect } from 'react';
import styles from './ListElement.module.css';
//modal
import Modal from '../../Modal';
// api
import apiRequest from '../../../data/apiRequest.jsx';
//context
import { useUser } from "../../../context/userContext"

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
  const data = new Date(params.creationDate);
  const formatada = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(data);

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
        <div className={styles.editContainer}>
          <div className={styles.titleContainer}>
            <h2>Editar Cliente </h2> 
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="name">Nome:</label>
            <input value={params.name} type="text" />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="phone">Número:</label>
            <input value={params.phone} type="text" />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="email">Email Pessoal:</label>
            <input value={params.email} type="text" />
          </div>
          {hasEmail ?
            <div className={styles.inputContainer}>
              <label htmlFor="corporateEmail">Email Corporativo:</label>  
              <input value={coporateEmail.email} type="text" />
              
            </div>:
            <>
              <div className={styles.inputContainer}>
                <label htmlFor="corporateEmail">Email Corporativo:</label>  
                <div className={styles.associateEmailContainer}>
                  <button  type="text" onClick={()=> setHasEmail(true)}> Associar Email </button>
                </div>
                
              </div>
            </>
          }
          <div className={styles.inputContainer}>
            <label htmlFor="username">Username:</label>
            <p>{params.username}</p>
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="creationDate">Registado em:</label>
            <p>{formatada}</p>
          </div>
          <div className={styles.butonsContainer}>
            {
              hasEmail &&
              <button className={styles.removeEmailButton} onClick={()=>{setCoporateEmail(""), setHasEmail(false)}}>Remover Email Corporativo</button>
            }
            <button className={styles.saveButton} onClick={handleEdit}>Salvar Alterações</button>
          </div>
        </div>
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
