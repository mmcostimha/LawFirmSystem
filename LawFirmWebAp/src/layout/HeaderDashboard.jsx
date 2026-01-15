import { useState, useEffect } from 'react';
import styles from './HeaderDashboard.module.css';
// context
import { useFilter } from '../context/filterContext';
import { useLocation } from 'react-router-dom';

export default function HeaderDashboard({page}) {
  const [currentDateTime, setCurrentDateTime] = useState(getFormattedDateTime());


  function getFormattedDateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const date = now.toLocaleDateString('pt-PT', {
      day: 'numeric',    // 28
      month: 'long',     // outubro
      year: 'numeric'    // 2025
    });

    const day = now.toLocaleDateString('pt-PT', {
      weekday: 'long'   // segunda-feira, terça-feira, etc.
    });
    return {
      date,
      time,
      day
    };
  }


  const { searchTerm,setSearchTerm, clearSearch } = useFilter();

  const placeholder = ()=>{

    switch(page){
      case 'Alarmes':
        return "Nome, telemovel ou email pessoal"
      case 'Clientes':
        return "Nome, telemovel ou email pessoal"
      default:
        return "Barra de perquisa..."
    }
      
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(getFormattedDateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.container}>
      <input type="text" className={styles.barraPesquisa} onChange={(e)=> setSearchTerm(e.target.value)} value={searchTerm} placeholder={placeholder()}/>

      <div className={styles.clockContainer}>
        <div className={styles.timeDisplay}>{currentDateTime.time}</div>
        <div className={styles.dateDisplay}>
          <span className={styles.dayOfWeek}>{currentDateTime.day}</span>
          <span className={styles.divider}>|</span>
          <span className={styles.calendarDate}>{currentDateTime.date}</span>
        </div>
      </div>
    </div>
  );
}
