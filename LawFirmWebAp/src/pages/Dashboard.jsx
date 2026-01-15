import { useState, useRef, useEffect} from 'react';
import styles from './Dashboard.module.css';
//components
import HeaderDashboard from '../layout/HeaderDashboard.jsx';
import MenuDashboard from '../components/menu/MenuDashboard.jsx';
import Lista from '../components/dashboards/Clientes/Lista.jsx';
import SubHeader from '../layout/SubHeader.jsx';
import Modal from '../components/Modal.jsx';
import MozaicoBoard from '../components/dashboards/Alarms/MozaicoBoard.jsx';
import AlarmForm from '../components/dashboards/Alarms/AlarmForm.jsx';
import ClientForm from '../components/dashboards/Clientes/ClientForm.jsx';
import ToDoList from '../components/dashboards/Geral/TodoList/ToDoList.jsx';
import EmailAtiveList from '../components/dashboards/Geral/EmailList/EmailAtiveList.jsx'; 
import AccountInfo from '../components/dashboards/Account/AccountInfo.jsx';
//context
import { useFilter } from '../context/filterContext.jsx';

export default function Dashboard() {
  const [page, setPage] = useState('Visão geral');
  const [clients, setClients] = useState("");
  const [alarms, setAlarms] = useState([]);
  const [addClient, setAddClient] = useState(false);
  const [addAlarm, setAddAlarm] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const {clearSearch} = useFilter();

  useEffect(() => {
    clearSearch();
  }, [page]);

  return (
    <div className={styles.container} >
      <div className={styles.sidebar}>
        <MenuDashboard setPage={setPage} />
      </div>

      <div className={styles.mainContent}>
        <HeaderDashboard page={page}/>

        {page === 'Visão geral' ? (
          
          <div className={styles.dashboardContainer}> 
            <ToDoList />
            <EmailAtiveList />
          </div>
          
        ) : page === 'Clientes' ? (
          <div>
            <SubHeader title={page} buttonFuntion={()=>setAddClient(true)}/>
            <Lista itens={clients} setItens={setClients} />
          </div>
        ) : page === 'Alarmes' ? (
          <div>
            <SubHeader title={page} buttonFuntion={()=>setAddAlarm(true)}/>
            <MozaicoBoard itens={alarms} setItens={setAlarms} />
          </div>

        ) : page === 'Perfil' ? (
          <div><AccountInfo user={userInfo} setUserInfo={setUserInfo} /></div>
        ) : (
          <div>Página não encontrada</div>
        )}
      </div>
      <Modal isOpen={addClient} onClose={()=>setAddClient(false)}>
        <ClientForm onClose={()=>setAddClient(false)} setClients={setClients}/>
      </Modal>
      <Modal isOpen={addAlarm} onClose={()=>setAddAlarm(false)}>
        <AlarmForm onClose={()=>setAddAlarm(false)} setAlarms={setAlarms} alarms={alarms}/>
      </Modal>
    </div>
  );
}
