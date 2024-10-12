import React from 'react';
import styles from './styles.module.css';

interface ProductDescriptionModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

const ProductDescriptionModal: React.FC<ProductDescriptionModalProps> = ({ title, description, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalDescription}>{description}</p>
        <button className={styles.closeButton} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default ProductDescriptionModal;
