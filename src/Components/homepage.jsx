import './homepage.css'
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Layout, Menu, theme } from 'antd';
const { Header, Content, Footer } = Layout;
const items = new Array(15).fill(null).map((_, index) => ({
    key: index + 1,
    label: `nav ${index + 1}`,
  }));

const Homepage = () => {
    const navigate = useNavigate();
    const { accessToken, logout } = useAuth();
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
    const handleLogout = () => {
        logout();
        navigate('/');
    }
    const handleAccessStudent = () => {
        navigate('/sidebar');
    }
    const handleAccessAdmin = () => {
        navigate('/adminpage');
    }
    
    return (
        accessToken ? (
            
            <div className='home-container'>
                <Layout>
                    <Header
                        style={{
                        display: 'flex',
                        alignItems: 'center',
                        }}
                    >
                        <div className="demo-logo" />
                        <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        items={items}
                        style={{
                            flex: 1,
                            minWidth: 0,
                        }}
                        />
                    </Header>
                    <Content
                        style={{
                        padding: '0 48px',
                        }}
                    >
                        <div
                        style={{
                            background: colorBgContainer,
                            minHeight: 280,
                            padding: 24,
                            borderRadius: borderRadiusLG,
                        }}
                        >
                        <button onClick={handleLogout}>Log out</button> 
                        <button onClick={handleAccessStudent}>student</button>
                        <button onClick={handleAccessAdmin}>admin</button>
                        </div>
                    </Content>
                    
                    <Footer
                        style={{
                        textAlign: 'center',
                        }}
                    >
                        Alamak ©{new Date().getFullYear()} Created by Th0nk
                    </Footer>
                </Layout>
            </div>
        ) : (
            <Navigate to="/" />
        )
    );
}

export default Homepage;
