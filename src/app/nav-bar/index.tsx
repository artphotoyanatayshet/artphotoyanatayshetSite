import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css'; // Импортируем стили
import Logo from '../logo';

const NavBar: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.logoContainer}>
        <Logo /> {/* Логотип остается видимым */}
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/" className={styles.link}>Главная</Link>
        </li>
        <li>
          <Link to="/about" className={styles.link}>О нас</Link>
        </li>
        <li>
          <Link to="/contact-us" className={styles.link}>Контакты</Link>
        </li>
        <li>
          <Link to="/offer-agreement" className={styles.link}>Оферта</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
