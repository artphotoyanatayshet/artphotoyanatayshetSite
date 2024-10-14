import React, { useState, useEffect } from 'react';
import appConfig from '../../app/app-config.json'
import { useAuth } from '../../app/auth/AuthContext';
const themes = ['theme1', 'theme2', 'theme3', 'theme4', 'theme5'];

const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState(appConfig.defaultTheme); // Получаем тему из localStorage или appConfig.json
  const { isAuthenticated } = useAuth(); // Деструктурируем isAuthenticated из useAuth

  useEffect(() => {
    document.documentElement.classList.remove(...themes); // Удалить все предыдущие темы
    document.documentElement.classList.add(theme); // Добавить текущую тему
    localStorage.setItem('theme', theme); // Сохранить тему в localStorage
  }, [theme]);

  const nextTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (<>
   {isAuthenticated && <button
      onClick={nextTheme}
      className="m-20 p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
    >
      Выбор темы Сайта
    </button> }
    </> );
};

export default ThemeSwitcher;
