import { useEffect, useState,useRef } from "react";
//icon
import { FaArrowRight,FaArrowLeft} from "react-icons/fa";
import { TbReload } from "react-icons/tb";
//componentes
import MozaicoBoardElement from "./MozaicoBoardElement";
//styles
import styles from "./MozaicoBoard.module.css"

export default function MozaicoBoard({ itens, setItens }) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [numberOfItems,setNumberOfItems] = useState(1); // número de alarmes visíveis por vez

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
  }, [setItens]);
  useEffect(() => {
      function calculateItemsPerPage() {
        console.log(containerRef.current);
        console.log(itemRef.current);
        if (containerRef.current && itemRef.current) {
          
          const clientWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;
          const itemWidth = itemRef.current.clientWidth;
          const itemHeight = itemRef.current.clientHeight;
          const possible = Math.floor(containerHeight / (itemHeight))+Math.floor(clientWidth / (itemWidth));
          setNumberOfItems(possible > 0 ? possible+1 : 1);
        }
      }
      
      // calcula no início e no resize
      calculateItemsPerPage();
      window.addEventListener('resize', calculateItemsPerPage);
      return () => window.removeEventListener('resize', calculateItemsPerPage);
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
      <div className={styles.itens}>
        {alarmesVisiveis.map((item,index) => (
          <div 
            key={index}
            ref={index === 0 ? itemRef : null}
          >
            {console.log(index)}
            <MozaicoBoardElement item={item} deleteFunction={deleteAlarmFunction} setItem={setAlarm}/>
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
    </div>
  );
}
