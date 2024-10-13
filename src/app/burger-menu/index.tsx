import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { LiaTelegram } from 'react-icons/lia';
import { IoIosLogIn, IoLogoWhatsapp } from 'react-icons/io';
import { TfiEmail } from 'react-icons/tfi';
import { Link } from 'react-router-dom';
import textBurgerMenu from './burger-menu.json';

const BurgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mouseInsideMenu, setMouseInsideMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const closeMenuAfterDelay = setTimeout(() => {
      if (!mouseInsideMenu) {
        setIsOpen(false);
      }
    }, 5000);

    return () => clearTimeout(closeMenuAfterDelay);
  }, [isOpen, mouseInsideMenu]);

  const handleMouseEnter = () => setMouseInsideMenu(true);
  const handleMouseLeave = () => setMouseInsideMenu(false);

  return (
    <div>
      {/* Кнопка бургера */}
      <button
        onClick={toggleMenu}
        className="fixed z-50 top-4 right-4 p-3 text-gray-200 hover:text-gray-300 focus:outline-none"
      >
        {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
      </button>

      {/* Меню */}
      {isOpen && (
        <div
          ref={menuRef}
          className="overflow-y-auto fixed top-0 right-0 w-64 bg-gray-500 shadow-lg rounded-lg z-40 h-full p-4"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex flex-col items-center mt-4 space-y-4 ">
            <h2 className="mt-10 text-lg font-bold">{textBurgerMenu.BurgerMenu.main_burger.title}</h2>
            <p className="text-sm">{textBurgerMenu.BurgerMenu.main_burger_subtitle.title}</p>

            {/* Навигационные ссылки */}
            <div className="flex flex-col items-center space-y-2 w-full 	">
              {Object.entries(textBurgerMenu.BurgerMenu).map(([key, value]: any) => (
                typeof value === 'object' && value.is_active && value.link && (
                  <Link 
                    key={key} 
                    to={value.link} 
                    className="bg-blue-200 w-full text-center text-gray-900 py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-blue-500 hover:text-white"
                  >
                    {value.title}
                  </Link>
                )
              ))}
            </div>

            {/* Социальные ссылки */}
            <div className="flex flex-col items-center space-y-4 mt-4 w-full">
              <a
                href={`tel:${textBurgerMenu.BurgerMenu.phone.title}`}
                className="w-full text-center text-[#00FF00] transition-colors duration-300 hover:text-[#FF00FF] bg-gray-900 rounded-lg p-2 flex justify-center items-center space-x-2"
              >
                <FiPhone size={24} />
                <span>{textBurgerMenu.BurgerMenu.phone.title}</span>
              </a>
              <a
                href={`https://t.me/${textBurgerMenu.BurgerMenu.telegram_number.title}`}
                className="w-full text-center text-[#00FF00] transition-colors duration-300 hover:text-[#FF00FF] bg-gray-900 rounded-lg p-2 flex justify-center items-center space-x-2"
              >
                <LiaTelegram size={24} />
                <span>Telegram</span>
              </a>
              <a
                href={`https://wa.me/${textBurgerMenu.BurgerMenu.whatsapp_number.title}`}
                className="w-full text-center text-[#00FF00] transition-colors duration-300 hover:text-[#FF00FF] bg-gray-900 rounded-lg p-2 flex justify-center items-center space-x-2"
              >
                <IoLogoWhatsapp size={24} />
                <span>WhatsApp</span>
              </a>
              {textBurgerMenu.BurgerMenu.email && (
                <a
                  href={`mailto:${textBurgerMenu.BurgerMenu.email.title}`}
                  className="w-full text-center text-[#00FF00] transition-colors duration-300 hover:text-[#FF00FF] bg-gray-900 rounded-lg p-2 flex justify-center items-center space-x-2"
                >
                  <TfiEmail size={24} />
                  <span>Email</span>
                </a>
              )}
              <Link 
                to="/login" 
                className="w-full text-center text-gray-900 py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-blue-500 hover:text-white flex justify-center items-center space-x-2"
              >
                <IoIosLogIn size={24} />
                <span>{textBurgerMenu.BurgerMenu.login.title}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;