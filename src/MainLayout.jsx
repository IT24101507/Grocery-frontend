import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Import your new Header
import Footer from './Footer'; // Import your new Footer

const MainLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;