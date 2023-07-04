import React from 'react';
import Navbar from '../../components/navbar/navbar';
import Sidebar from '../../components/sidebar/siderbar';
import { Route, Routes } from 'react-router-dom';
import Main from './main/main';

const Dashboard = () => {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Main />}></Route>
      </Routes>
    </>
  );
};

export default Dashboard;
