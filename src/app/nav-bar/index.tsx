import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css'; // Импортируем стили
import Logo from '../logo';
import appConfig from '../../app/app-config.json';
import { getThemeClasses } from '../../components/theme-switcher/themeUtils';

const NavBar: React.FC = () => {
  const theme = appConfig.defaultTheme;

  // Проверяем, что тема задана
  if (!theme) return null;

  // Получаем классы для навигации и текста
  const { navBgColor, textColor } = getThemeClasses(theme);

  return (
    <nav className={`rounded-2xl border-solid border-2 border-indigo-600	 ${navBgColor} ${styles.nav}`}>
      <Link to={"/"}>   <div className={styles.logoContainer}>

        <Logo />

      </div>  
      </Link>
      <ul className={`${textColor} ${styles.navLinks}`}>
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
