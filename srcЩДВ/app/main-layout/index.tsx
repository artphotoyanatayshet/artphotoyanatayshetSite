import React from 'react';
import { Outlet } from 'react-router-dom';
// import NavBar from '../nav-bar';
import BurgerMenu from '../burger-menu';
import NavBar from '../nav-bar';
import Footer from '../../components/footer';

const MainLayout: React.FC = () => {
  return (
    <div>
      <NavBar />
      <BurgerMenu />
      <main className="p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

