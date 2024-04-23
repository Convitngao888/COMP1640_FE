import React, { useState } from 'react';
import MCpage from './MarketingCoordinator';
import NotificationPage from './notifiPage';
import { useNavigate, } from 'react-router-dom';
import { useAuth } from './AuthContext';
import ChartPageMC from './chartPageMC';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  InboxOutlined,
  BarChartOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';

const { Header, Sider, Content } = Layout;

const SideBarMC = () => {
  const {userName } = useAuth();

  const navigate = useNavigate();
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');
  const [collapsed, setCollapsed] = useState(false);
  const menuComponents = {
    '1': <MCpage />,
    '2':<NotificationPage/>,
    '3':<ChartPageMC/>
  };
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{minHeight: '100vh'}}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            onClick={({ key }) => {
              // Xử lý khi người dùng click vào menu item
              setSelectedMenuItem(key);
            }}
            items={[
              {
                key: '1',
                icon: <InboxOutlined />,
                label: 'MC Page',
              },
              {
                key: '2',
                icon: <NotificationOutlined />,
                label: 'Notification',
              },
              {
                key: '3',
                icon: <BarChartOutlined />,
                label: 'Statistic',
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
          <h2 style={{marginLeft: 24}}>Welcome Back {userName}</h2>
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