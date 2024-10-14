import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import styles from './styles.module.css';

const IninPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};

  const { title, price, discount, img_url, is_delivery } = product || {};

  // Рассчитываем цену со скидкой
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;

  const [payerData, setPayerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setPayerData({ ...payerData, [name]: value });
  };

  const generateOrderId = () => {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:T]/g, '').split('.')[0];
    const productId = product?.id ?? '0';
    return `${formattedDate}${productId}`;
  };

  const payDataProduct = {
    product,
    payerData,
    orderId: generateOrderId(),
  };

  const handleConfirmPayment = () => {
    navigate('/payment-process', { state: { payDataProduct } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.textBase}>Страница оплаты</h2>
        <Link to="/" className={styles.textRed500}>Вернуться</Link>

        {product && (
          <>
            <div className={styles.productInfo}>
              {img_url ? (
                <img src={img_url} alt={title} className={styles.productImage} />
              ) : (
                <div className={styles.imagePlaceholder}>Изображение недоступно</div>
              )}

              <div className={styles.productDetails}>
                <h3>{title}</h3>
                {/* Если скидка есть, показываем зачеркнутую цену и цену со скидкой */}
                {discount > 0 ? (
                  <p>
                    <span className={styles.originalPrice}>{price.toFixed(2)} ₽</span>
                    <span className={styles.discountedPrice}>{discountedPrice.toFixed(2)} ₽</span>
                  </p>
                ) : (
                  <p className={styles.price}>{price.toFixed(2)} ₽</p>
                )}
                {is_delivery && <p>Требуется доставка</p>}
              </div>
            </div>
          </>
        )}

        <form>
          <h4>Данные плательщика</h4>
          <input
            type="text"
            name="name"
            placeholder="ФИО"
            value={payerData.name}
            onChange={handleInputChange}
            required
            className={styles.inputField}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={payerData.email}
            onChange={handleInputChange}
            required
            className={styles.inputField}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Телефон"
            value={payerData.phone}
            onChange={handleInputChange}
            required
            className={styles.inputField}
          />

          {is_delivery && (
            <input
              type="text"
              name="address"
              placeholder="Адрес доставки"
              value={payerData.address}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          )}

          <button type="button" onClick={handleConfirmPayment} className={styles.payButton}>
            Подтвердить
          </button>
        </form>
      </div>
    </div>
  );
};

export default IninPaymentPage;
