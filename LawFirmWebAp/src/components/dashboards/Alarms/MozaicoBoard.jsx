import { useEffect, useState,useRef } from "react";
//icon
import { FaArrowRight,FaArrowLeft} from "react-icons/fa";
import { TbReload } from "react-icons/tb";
//componentes
import MozaicoBoardElement from "./MozaicoBoardElement";
import LoadingComponent from "../../loading/LoadingComponent";
//styles
import styles from "./MozaicoBoard.module.css"

export default function MozaicoBoard({ itens, setItens }) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [numberOfItems,setNumberOfItems] = useState(1); // número de alarmes visíveis por vez
  const [loading, setLoading]  = useState(true);

  const itemRef = useRef(null);
  const containerRef = useRef(null);
  
  const names = ["Alice", "Bruno", "Carla", "Dionísio", "Eduarda", "Fábio", "Gabriela", "Hugo", "Inês", "Jorge", "Kelly", "Leonardo", "Marta", "Nuno", "Olívia", "Paulo", "Quitéria", "Rafael", "Sofia", "Tiago"]
  useEffect(() => {
    const alarmesAleatorios = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      email: `user${Math.floor(Math.random() * 100)}@example.com`,
      tipo: ["urgente", "normal", "baixa"][Math.floor(Math.random() * 3)],
      estado: ["pendente", "em_processo", "resolvido"][Math.floor(Math.random() * 3)],
      name:names[index]
    }));
    setItens(alarmesAleatorios);
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

        const heithdiv = Math.floor(containerHeight / itemHeight);
        const widthdiv = Math.floor(containerWidth / itemWidth);
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



  // cálculo dos índices dos alarmes a mostrar
  const indiceInicial = (paginaAtual - 1) * numberOfItems;

  const indiceFinal = indiceInicial + numberOfItems;

  const alarmesVisiveis = Array.isArray(itens) ? itens.slice(indiceInicial, indiceFinal) : [];

  const totalPaginas = Math.ceil((itens?.length || 0) / numberOfItems);


  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };
  const paginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };
  function deleteAlarmFunction(item){
      //delete an alarm
      setItens((prev) => prev.filter((i) => i.id !== item.id))
      console.log("delete alarm- API relese not emplemented")

  }
  const setAlarm = (item) =>{
    console.log("seting alarm- not emplemented")
  }

  return (
  <div className={styles.container} ref={containerRef}>
    {loading ? (
      <LoadingComponent size={70}/>
    ) : (
      <>
        <div className={styles.itens}>
          {alarmesVisiveis.map((item, index) => (
            <div key={index} ref={index === 0 ? itemRef : null}>
              <MozaicoBoardElement 
                item={item} 
                deleteFunction={deleteAlarmFunction} 
                setItem={setAlarm}
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
