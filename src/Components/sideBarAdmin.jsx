import React, { useState } from 'react';
import Adminpage from './adminpage';
import Chartpage from './chartpage';
import CreateAccountPage from './createAccountPage';
import { useNavigate, } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BarChartOutlined,
  CalendarOutlined,
  UserAddOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import AllStudentPage from './AllStudentPage';

const { Header, Sider, Content } = Layout;

const SideBarAdmin = () => {
  const navigate = useNavigate();
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');
  const [collapsed, setCollapsed] = useState(false);
  const menuComponents = {
    '1': <Adminpage />,
    '2': <Chartpage />,
    '3': <CreateAccountPage />,
    '4': <AllStudentPage />
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
          onClick={({ key }) => {
            // Xử lý khi người dùng click vào menu item
            setSelectedMenuItem(key);
          }}
          items={[
            {
              key: '1',
              icon: <CalendarOutlined />,
              label: 'Create Academic Year',
            },
            {
              key: '2',
              icon: <BarChartOutlined />,
              label: 'Statistic',
            },
            {
              key: '3',
              icon: <UserAddOutlined />,
              label: 'Create Account',
            },
            {
              key: '4',
              icon: <UserOutlined />,
              label: 'User List',
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
export default SideBarAdmin;