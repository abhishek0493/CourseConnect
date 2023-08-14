import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const LayoutMain = ({ isLoggedIn, triggerAuthUpdate }) => {
  return (
    <>
      <main>
        <Header isLoggedIn={isLoggedIn} onLogout={triggerAuthUpdate} />
        <Outlet />
      </main>
    </>
  );
};

export default LayoutMain;
