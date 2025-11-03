import { useState, useEffect } from 'react';
import styles from './HeaderDashboard.module.css';

export default function HeaderDashboard() {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(getFormattedDateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.container}>
      <input type="text" className={styles.barraPesquisa} />
      <div className={styles.horaAtual}>
        <span >{currentDateTime.time}</span>
        <span >{currentDateTime.day}</span>
        <span >{currentDateTime.date}</span>
      </div>
    </div>
  );
}
