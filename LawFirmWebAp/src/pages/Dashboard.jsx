import { useState } from 'react';
import styles from './Dashboard.module.css';
import HeaderDashboard from '../layout/headerDashboard.jsx';
import MenuDashboard from '../components/menu/menuDashboard.jsx';
import Lista from '../components/dashboards/Lista.jsx';

export default function Dashboard() {
  const [page, setPage] = useState('Visão geral');

  const [clients, setClients] = useState("");
  const [alarms, setAlarms] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <MenuDashboard setPage={setPage} />
      </div>

      <div className={styles.mainContent}>
        <HeaderDashboard />

        {page === 'Visão geral' ? (
          <Lista itens={clients} setItens={setClients} />
        ) : page === 'Clientes' ? (
          <div>Conteúdo dos Clientes</div>
        ) : page === 'Alarmes' ? (
          <div>Conteúdo dos Alarmes</div>
        ) : page === 'Perfil' ? (
          <div>Conteúdo do Perfil</div>
        ) : (
          <div>Página não encontrada</div>
        )}
      </div>
    </div>
  );
}
