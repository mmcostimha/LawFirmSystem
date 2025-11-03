import React, { useState, useEffect, useRef } from 'react';
import styles from './Lista.module.css';
import axios from "axios";
//components
import ListElement from './ListElement';
//context
import { useUser } from "../../context/userContext"

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

  useEffect(() => {

    async function fetchData() {
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER_API_URL + '/api/user/clients',
          {}, // request body
          {
            headers: {
              'Authorization': `Bearer${token}` // Include token in headers
            }
          }
        );
        
        if (response.data) {
          setItens(response.data);
          console.log('Dados carregados:', response.data);
        }
      } catch (err) {
        console.error(err);
      }
    }

    // simula carregamento inicial ou recarregamento
    if (!itens || reload) {

      fetchData();
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

  // if (!itens) return <div>Carregando...{token}</div>;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleItems = itens.slice(startIndex, endIndex);

  const hasPrev = currentPage > 0;
  const hasNext = endIndex < itens.length;

  return (
    <div className={styles.container} >

      {
        !itens
          ? <div>Carregando...  {token}</div>:
          <div className={styles.list} ref={containerRef}>
            {visibleItems.map((item, index) => (
              <div
                key={index}
                ref={index === 0 ? itemRef : null} // mede apenas o primeiro item
                className={styles.listElement}
              >
                <ListElement params={item} />
              </div>
            ))}
          </div>
        }
      
        
      <div className={styles.controls}>
        <button onClick={() => setReload(true)}>Recarregar</button>
        <button disabled={!hasPrev} onClick={() => setCurrentPage(p => p - 1)}>Anterior</button>
        <button disabled={!hasNext} onClick={() => setCurrentPage(p => p + 1)}>Próximos</button>
      </div>
    </div>
  );
}
