import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header'; 
import Footer from './Footer';

const MainLayout = () => {
  const location = useLocation();
  const isAdminDashboard = location.pathname === '/admin/dashboard';

  return (
    <div>
      {!isAdminDashboard && <Header />}
      <main>
        <Outlet />
      </main>
      {!isAdminDashboard && <Footer />}
    </div>
  );
};

export default MainLayout;