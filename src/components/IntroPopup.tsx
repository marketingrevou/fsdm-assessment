import React from 'react';
import styles from './IntroPopup.module.css';

interface IntroPopupProps {
  onClose: () => void;
}

const IntroPopup: React.FC<IntroPopupProps> = ({ onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <p className={styles.icon}>📨</p>
        <h2 className={styles.title}>Pesan baru dari klien!</h2>
        <p className={styles.description}>
          Kamu jadi Digital Marketer untuk Kafe Kopi & Bunga Melati. Balas pesan dari klien dengan respon terbaik menurutmu 😉!
        </p>
        <button onClick={onClose} className={styles.button}>
          Mulai
        </button>
      </div>
    </div>
  );
};

export default IntroPopup;
