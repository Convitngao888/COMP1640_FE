import React, { useState } from 'react';
import MCpage from './MarketingCoordinator';
import NotificationPage from './NotificationPage'; // Import the NotificationPage component
import { useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  VideoCameraOutlined,
  BellOutlined, // Import the BellOutlined icon for notification
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';

const { Header, Sider, Content } = Layout;

const SideBarMC = () => {
  const navigate = useNavigate();
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');
  const [collapsed, setCollapsed] = useState(false);

  // Define menu components mapping
  const menuComponents = {
    '1': <MCpage />,
    '2': <NotificationPage />, // Add the NotificationPage component
  };

  // Handle menu item click event
  const handleMenuItemClick = ({ key }) => {
    setSelectedMenuItem(key);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedMenuItem]} // Set selectedKeys to control the selected menu item
          onClick={handleMenuItemClick}
          items={[
            {
              key: '1',
              icon: <VideoCameraOutlined />,
              label: 'MC Page',
            },
            {
              key: '2',
              icon: <BellOutlined />, // Use the BellOutlined icon for notification
              label: 'Notifications', // Label for the notification menu item
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'My Article',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ float: 'right', marginRight: '32px' }}>
            <Button onClick={() => navigate('/homepage')} type="primary">Back To Home Page</Button>
          </div>
          {/* Clear float để đảm bảo không ảnh hưởng từ float */}
          <div style={{ clear: 'both' }}></div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {menuComponents[selectedMenuItem]}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SideBarMC;
