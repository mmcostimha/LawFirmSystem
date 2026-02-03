import { useEffect, useState,useRef } from "react";
//icon
import { FaArrowRight,FaArrowLeft,FaRegClock } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
//componentes
import MozaicoBoardElement from "./MozaicoBoardElement";
import LoadingComponent from "../../loading/LoadingComponent";
//styles
import styles from "./MozaicoBoard.module.css"
//api
import apiRequest from "../../../data/apiRequest";
//context
import {useUser} from "../../../context/userContext"
import { useFilter } from "../../../context/filterContext";

export default function MozaicoBoard({ itens, setItens }) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [numberOfItems,setNumberOfItems] = useState(1); // número de alarmes visíveis por vez
  const [loading, setLoading]  = useState(true);

  const itemRef = useRef(null);
  const containerRef = useRef(null);
  const { token } = useUser();    
  const {searchTerm} = useFilter();

  useEffect(() => {
    async function carregarDados() {
      try {
        const responce = await apiRequest('/api/supervisor', 'GET', null, token);
        setItens(responce.data);
        console.log('Dados carregados - Alarmes:', responce.data);
      } catch (err) {
        console.error('Falha ao carregar dados:', err);
      }
    }
    //get data from api
    carregarDados();
    setLoading(false);
  }, [setItens]);
  
  useEffect(() => {
    let debounceTimer = null;

    function calculateItemsPerPage() {
      if (containerRef.current && itemRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight *0.8;
        const itemWidth = itemRef.current.clientWidth;
        const itemHeight = itemRef.current.clientHeight;

        const heithdiv = Math.floor(containerHeight / (itemHeight*1.1));
        const widthdiv = Math.floor(containerWidth / (itemWidth*1.1));
        const possible = heithdiv * widthdiv;
        console.log(containerWidth,containerHeight,itemHeight,itemWidth,widthdiv,heithdiv,possible);
        setNumberOfItems(possible > 0 ? possible : 1);
      }
    }

    function handleResize() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        calculateItemsPerPage();
      }, 200); 
    }

    calculateItemsPerPage();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [itens]);
  useEffect(() => {
    setPaginaAtual(1);
  }, [searchTerm]);

  const itensFiltred = Array.isArray(itens) ? itens.filter(item =>{
    return(
      item.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase()) 

    );
  }) : [];

  // cálculo dos índices dos alarmes a mostrar
  const indiceInicial = (paginaAtual - 1) * numberOfItems;
  const indiceFinal = indiceInicial + numberOfItems;
  const alarmesVisiveis = Array.isArray(itensFiltred) ? itensFiltred.slice(indiceInicial, indiceFinal) : [];
  const totalPaginas = Math.ceil((itensFiltred?.length || 0) / numberOfItems);

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };
  const paginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };
  async function deleteAlarmFunction(item){
      //delete an alarm
      const link = "/api/supervisor/"+item.id;
      // console.log("Deleting alarm:",link)
      try {
        const responce = await apiRequest(link, 'DELETE', null, token);
        if(responce.status === 200){
          // console.log("Alarme deletado com sucesso:", responce.data);
          setItens(prevItens => prevItens.filter(alarm => alarm.id !== item.id));
        }
        // console.log('Dados carregados:', responce.data);
      } catch (err) {
        console.error('Falha ao carregar dados:', err);
      }
  }

  return (
  <div className={styles.container} ref={containerRef}>
    {loading ? (
      <LoadingComponent size={70}/>
    ) : alarmesVisiveis.length === 0 ? (
      <div className={styles.itensEmpty}>
        <div className={styles.emptyState}>
          <h3>Tudo em ordem por aqui!</h3>
          <p>Nenhum alarme foi acionado até ao momento.</p>
          <div className={styles.iconWrapper}>
            <FaRegClock />
          </div>
        </div>
      </div>
    ) : (
      <>
        <div className={styles.itens}>
          {alarmesVisiveis.map((item, index) => (
            <div key={index} ref={index === 0 ? itemRef : null}>
              <MozaicoBoardElement 
                item={item} 
                deleteFunction={deleteAlarmFunction} 
                
              />
            </div>
          ))}
        </div>

        <div className={styles.buttonsContainer}>
          <button onClick={paginaAnterior} disabled={paginaAtual === 1}>
            <FaArrowLeft />
          </button>
          <span style={{ margin: "0 8px" }}>
            {paginaAtual} de {totalPaginas}
          </span>
          <button onClick={proximaPagina} disabled={paginaAtual === totalPaginas}>
            <FaArrowRight />
          </button>
        </div>
      </>
    )}
  </div>
);

}
