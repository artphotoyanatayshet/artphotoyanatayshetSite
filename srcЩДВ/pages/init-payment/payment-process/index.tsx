import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './styles.module.css';
import TinkoffPaymentComponent from '../payment-method/t-bank';
import { PaidProduct } from '../types/PaidProduct.types';
import { v4 as uuidv4 } from 'uuid';

const PaymentProcess: React.FC = () => {
  const location = useLocation();
  const { payDataProduct } = location.state || {};

  const { id, title, description, price, discount, img_url, is_delivery } = payDataProduct.product;
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;

    // Получаем текущую дату и время в формате с секундами
    const getCurrentDateWithSeconds = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
    };

    const currentDateWithSeconds = getCurrentDateWithSeconds();


    const orderId = `${id}-${currentDateWithSeconds}` || uuidv4();

  const paidProduct: PaidProduct = {
    id,
    pay_method:"t-bank",
    title,
    description,
    price,
    discount,
    is_delivery,
    amount: price,
    quantity: 1.00,
    fio_customer: payDataProduct?.payerData.name,
    email_customer: payDataProduct?.payerData.email,
    phone_customer: payDataProduct?.payerData.phone,
    address_delivery: payDataProduct?.payerData.address,
    order_id: orderId
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Подтверждение платежа</h2>
      <div className={styles.orderDetails}>
        <div className={styles.productInfo}>
          <img
            src={img_url}
            alt={title}
            className={styles.productImage}
          />
          <div className={styles.productDetails}>
            <h3>Продукт: {title}</h3>
            {discount > 0 ? (
              <p>
                <span className={styles.originalPrice}>{price.toFixed(2)} ₽</span>
                <span className={styles.discountedPrice}>{discountedPrice.toFixed(2)} ₽</span>
              </p>
            ) : (
              <p className={styles.price}>{price.toFixed(2)} ₽</p>
            )}
          </div>
        </div>
        <h4>Данные плательщика:</h4>
        <p>ФИО: {payDataProduct.payerData.name}</p>
        <p>Email: {payDataProduct.payerData.email}</p>
        <p>Телефон: {payDataProduct.payerData.phone}</p>
        {is_delivery && (
          <p>Адрес доставки: {payDataProduct.payerData.address}</p>
        )}
        {/* <button className={styles.button}>Оплатить {discountedPrice.toFixed(2)} ₽</button> */}

        <TinkoffPaymentComponent paidProduct={paidProduct} />
      </div>
    </div>
  );
};

export default PaymentProcess;
