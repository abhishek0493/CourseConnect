import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import './LayoutMain.css';

const LayoutMain = ({ isLoggedIn, triggerAuthUpdate }) => {
  return (
    <div className="layout-main-container">
      <Header isLoggedIn={isLoggedIn} onLogout={triggerAuthUpdate} />
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutMain;
