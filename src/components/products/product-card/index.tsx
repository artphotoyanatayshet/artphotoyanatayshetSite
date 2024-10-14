import React from 'react';
import styles from './styles.module.css';
import { Link } from 'react-router-dom';
import { TbLampOff, TbTruckDelivery } from 'react-icons/tb';
import { useAuth } from '../../../app/auth/AuthContext';
import { getThemeClasses } from '../../theme-switcher/themeUtils';
import appConfig from '../../../app/app-config.json';


interface ProductCardProps {
  product: {
    title: string;
    description: string;
    price: number;
    discount: number;
    img_url: string;
    is_active: boolean;
    is_delivery: boolean;
    id?: number;
  };
  onMoreDetails: () => void;
  onEdit: () => void; // Кнопка редактирования
  onDelete: () => void; // Добавьте эту строку для кнопки удаления
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onMoreDetails, onEdit, onDelete }) => {
  const { title, price, discount, img_url, is_active, is_delivery } = product;
  const discountedPrice = price - (price * discount) / 100;

  const { isAuthenticated } = useAuth();
  const theme = appConfig.defaultTheme;

  if (!theme) return null;
  const {  bgCard } = getThemeClasses(theme);

console.log(img_url)

  return (
    <div className={` ${bgCard} ${styles.productCard}`}>
      {img_url && (
        <img
          src={img_url}
          alt={title}
          className={styles.productImage}
        />
      )}
      <div className={styles.productDetails}>
        <h2 className={styles.productTitle}>{title}</h2>
        {!is_active && <TbLampOff size={48} color='red'/>}
        <div className={styles.priceContainer}>
          {discount > 0 ? (
            <>
              <span className={styles.originalPrice}>{price.toFixed(2)} ₽</span>
              <span className={styles.discountedPrice}>{discountedPrice.toFixed(2)} ₽</span>
            </>
          ) : (
            <span className={styles.productPrice}>{price.toFixed(2)} ₽</span>
          )}
        </div>
        <div className="flex items-center justify-center rounded bg-gray-700 dark:bg-black text-black dark:text-white">
          {is_delivery && <TbTruckDelivery size={24} />}
        </div>

        <button className={styles.moreButton} onClick={onMoreDetails}>
          Подробнее
        </button>
        <Link to="/init-payment" state={{ product }}>
          <button className={styles.payButton} >
            Оплатить
          </button>
        </Link>


       {isAuthenticated && <><button className={styles.editButton} onClick={onEdit}>
          Редактировать
        </button>
        <button className={styles.deleteButton} onClick={onDelete}>
          Удалить
        </button>
        </> }
      </div>
    </div>
  );
};

export default ProductCard;
