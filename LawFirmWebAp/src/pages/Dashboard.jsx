import { useState } from 'react';
import styles from './Dashboard.module.css';
import HeaderDashboard from '../layout/headerDashboard.jsx';
import MenuDashboard from '../components/menu/menuDashboard.jsx';
import Lista from '../components/dashboards/Clientes/Lista.jsx';
import SubHeader from '../layout/SubHeader.jsx';
import Modal from '../components/Modal.jsx';
import MozaicoBoard from '../components/dashboards/Alarms/MozaicoBoard.jsx';
import AlarmForm from '../components/dashboards/Alarms/AlarmForm.jsx';

export default function Dashboard() {
  const [page, setPage] = useState('Visão geral');

  const [clients, setClients] = useState("");
  const [alarms, setAlarms] = useState([]);
  const [addClient, setAddClient] = useState(false);
  const [addAlarm, setAddAlarm] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <MenuDashboard setPage={setPage} />
      </div>

      <div className={styles.mainContent}>
        <HeaderDashboard />

        {page === 'Visão geral' ? (
          
          <div>Conteúdo Geral</div>
          
        ) : page === 'Clientes' ? (
          <div>
            <SubHeader title={page} buttonFuntion={()=>setAddClient(true)}/>
            <Lista itens={clients} setItens={setClients} />
          </div>
        ) : page === 'Alarmes' ? (
          // <div>Conteúdo dos Alarmes</div>
          <div>
            <SubHeader title={page} buttonFuntion={()=>setAddAlarm(true)}/>
            <MozaicoBoard itens={alarms} setItens={setAlarms} />
          </div>

        ) : page === 'Perfil' ? (
          <div>Conteúdo do Perfil</div>
        ) : (
          <div>Página não encontrada</div>
        )}
      </div>
      <Modal isOpen={addClient} onClose={()=>setAddClient(false)}>
        <>Cliente</>
      </Modal>
      <Modal isOpen={addAlarm} onClose={()=>setAddAlarm(false)}>
        <AlarmForm />
      </Modal>
    </div>
  );
}
