import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const LayoutMain = ({ isLoggedIn }) => {
  return (
    <>
      <main>
        <Header isLoggedIn={isLoggedIn} />
        <Outlet />
      </main>
    </>
  );
};

export default LayoutMain;
