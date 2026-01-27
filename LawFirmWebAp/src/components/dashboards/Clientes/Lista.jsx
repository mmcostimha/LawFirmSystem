import React, { useState, useEffect, useRef } from 'react';
import styles from './Lista.module.css';
import headerstyles from "./ListElement.module.css"
// import axios from "axios";
//components
import ListElement from './ListElement';
import LoadingComponent from '../../loading/LoadingComponent';
//context
import { useUser } from "../../../context/userContext"
import { useFilter } from '../../../context/filterContext.jsx';
//icon
import { FaArrowRight,FaArrowLeft} from "react-icons/fa";
import { TbReload } from "react-icons/tb";
//data
import apiRequest from '../../../data/apiRequest.jsx';

export default function Lista({ itens, setItens, type}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reload, setReload] = useState(false);
  const containerRef = useRef(null);
  const itemRef = useRef(null);
  // accountType,
  // token,
  // allowedPages,
  // login,
  // logout,
  // isPageAllowed,
  const { token, allowedPages } = useUser();
  const { searchTerm } = useFilter();

  useEffect(() => {

    async function carregarDados() {
      try {
        const responce = await apiRequest('/api/user/clients', 'GET', null, token);
        setItens(responce.data);
        // console.log('Dados carregados:', responce.data);
      } catch (err) {
        console.error('Falha ao carregar dados:', err);
      }
    }
    if (!itens || reload) {
      carregarDados();
      setReload(false);
    }
  }, [reload]);

  useEffect(() => {
    function calculateItemsPerPage() {
      
      if (containerRef.current && itemRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const itemHeight = itemRef.current.clientHeight;
        const possible = Math.floor(containerHeight / itemHeight);
        setItemsPerPage(possible > 0 ? possible : 1);
      }
    }
    // calcula no início e no resize
    calculateItemsPerPage();
    window.addEventListener('resize', calculateItemsPerPage);
    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, [itens]);

  if (!itens) return (
    <div className={styles.container} >
      <div className={styles.list} ref={containerRef}>
        <LoadingComponent size={70}/>;
      </div>
    </div>

  )
  const itensFiltred = Array.isArray(itens) ? itens.filter(item =>{
    return(
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.toLowerCase().includes(searchTerm.toLowerCase())

    );
  }) : [];

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleItems = itensFiltred.slice(startIndex, endIndex);
  const hasPrev = currentPage > 0;
  const hasNext = endIndex < itensFiltred.length;

  const columns = ['Nome', 'Email Pessoal', 'Telefone', 'Ações'];
  const getClassForKey = (key) => {
      switch (key) {
        case 'Id':
          return headerstyles.idField;
        case 'Nome':
          return headerstyles.nameField;
        case 'Email Pessoal':
          return headerstyles.emailField;
        case 'Telefone':
          return headerstyles.phoneField;
        case 'Username':
          return headerstyles.usernameField;
        case 'Ações':
          return headerstyles.actionsField;
        default:
          return headerstyles.item;
      }
    };

  return (
    <div className={styles.container} >
      <div className={styles.listHeader}>
        {columns.map((col) => (
          <div key={col} className={ getClassForKey (col)}>
            {col}
          </div>
        ))} 
      </div>
      {
        visibleItems.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Nenhum cliente encontrado!</h3>
            <p>Verifique os filtros ou adicione novos clientes.</p>
          </div>
        ) : null
      }
      <div className={styles.list} ref={containerRef}>
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            ref={index === 0 ? itemRef : null} // mede apenas o primeiro item
            className={styles.listElement}
          >
            <ListElement params={item} setClients={setItens} parChecker={index % 2 === 0} />
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button disabled={!hasPrev} onClick={() => setCurrentPage(p => p - 1)}>
          <FaArrowLeft />
        </button>
        
        <button onClick={() => setReload(true)}>
          <TbReload  /> 
        </button>
        
        <button disabled={!hasNext} onClick={() => setCurrentPage(p => p + 1)}>
          <FaArrowRight />
        </button>
      </div>
      
    </div>
  );
}
