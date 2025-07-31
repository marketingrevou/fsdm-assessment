import React from 'react';
import styles from './QuizResultPopup.module.css';

interface QuizResultPopupProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const QuizResultPopup: React.FC<QuizResultPopupProps> = ({ isVisible, onClose, children }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.popupContent}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default QuizResultPopup;
