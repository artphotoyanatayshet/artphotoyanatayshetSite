import React from 'react';
import styles from './styles.module.css';
import { onConfirmDeleteProductAndImageGitRepo } from './deleteProduct';

interface DeleteConfirmationModalProps {
  title: string;
  idProductJson: number;

  pathImage: string;
  pathProductJson: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ title, idProductJson, pathImage, pathProductJson, onCancel, onConfirm }) => {
  const handleDelete = async () => {
    try {
      await onConfirmDeleteProductAndImageGitRepo(idProductJson, pathImage, pathProductJson);
      console.log(`Продукт "${title}" удален успешно!`);
      onConfirm()
      // Здесь вы можете добавить логику для обновления состояния приложения после удаления
    } catch (error) {
      console.error(error);
      // Здесь вы можете обработать ошибку, например, показать уведомление пользователю
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Удалить продукт</h2>
        <p>Вы уверены, что хотите удалить продукт "{title}"?</p>
        <button onClick={handleDelete} className={styles.confirmButton}>Удалить</button>
        <button onClick={onCancel} className={styles.cancelButton}>Отмена</button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
