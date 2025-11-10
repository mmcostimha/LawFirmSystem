import { useEffect, useState } from "react";
//icon

//componentes
import MozaicoBoardElement from "./MozaicoBoardElement";
//styles
import styles from "./MozaicoBoard.module.css"

export default function MozaicoBoard({ itens, setItens }) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const alarmesPorPagina = 8; // número de alarmes visíveis por vez

  useEffect(() => {
    const alarmesAleatorios = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      email: `user${Math.floor(Math.random() * 100)}@example.com`,
      tipo: ["urgente", "normal", "baixa"][Math.floor(Math.random() * 3)],
      estado: ["pendente", "em_processo", "resolvido"][Math.floor(Math.random() * 3)],
      
    }));
    setItens(alarmesAleatorios);
  }, [setItens]);

  // cálculo dos índices dos alarmes a mostrar
  const indiceInicial = (paginaAtual - 1) * alarmesPorPagina;
  const indiceFinal = indiceInicial + alarmesPorPagina;
  const alarmesVisiveis = Array.isArray(itens) ? itens.slice(indiceInicial, indiceFinal) : [];

  const totalPaginas = Math.ceil((itens?.length || 0) / alarmesPorPagina);

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };
  const paginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.itens}>
        {alarmesVisiveis.map((item) => (
          <div key={item.id}>
            <MozaicoBoardElement item={item}/>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "12px" }}>
        <button onClick={paginaAnterior} disabled={paginaAtual === 1}>
          Anterior
        </button>
        <span style={{ margin: "0 8px" }}>
          Página {paginaAtual} de {totalPaginas}
        </span>
        <button onClick={proximaPagina} disabled={paginaAtual === totalPaginas}>
          Próxima
        </button>
      </div>
    </div>
  );
}
