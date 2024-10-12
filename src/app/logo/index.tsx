// Logo.tsx
import React from 'react';
import logo from '/logo.svg'; // Убедитесь, что путь к логотипу правильный
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <div className="h-12 items-center"> {/* Обернули в div */}
    <Link to={"/"}>
      <img
        src={logo}
        alt="Логотип"
        className="h-full w-auto" // Устанавливаем высоту в 100% родителя
      />
      </Link>
    </div>
  );
};

export default Logo;
