import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const LayoutMain = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default LayoutMain;
