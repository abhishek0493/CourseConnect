import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const { Header, Content, Sider } = Layout;

const SideBar = () => {
  const [categories, setCategories] = useState([]);
  const fetchCategories = () => {
    axios
      .get('http://localhost:8000/api/v1/categories')
      .then((response) => {
        console.log(response.data.data);
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchCategories();
    // console.log(categories.data);
  }, []);

  const items1 = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav${key}`,
  }));

  const items2 = categories.map((category, index) => {
    const key = String(index + 1);
    return {
      key,
      icon: React.createElement(UserOutlined),
      label: category.name,
      children: new Array(5).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  });

  const SidebarLayout = () => (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
        />
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{
              height: '100vh',
              borderRight: 0,
            }}
            items={items2}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );

  return <SidebarLayout />;
};

export default SideBar;
