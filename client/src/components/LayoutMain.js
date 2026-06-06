import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const LayoutMain = ({ isLoggedIn, triggerAuthUpdate }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header isLoggedIn={isLoggedIn} onLogout={triggerAuthUpdate} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutMain;
