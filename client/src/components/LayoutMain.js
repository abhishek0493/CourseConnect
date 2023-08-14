import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const LayoutMain = ({ isLoggedIn }) => {
  const handleLogout = (boo) => {
    console.log(boo);
  };
  return (
    <>
      <main>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Outlet />
      </main>
    </>
  );
};

export default LayoutMain;
