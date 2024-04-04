import './homepage.css'
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Layout, Menu, theme } from 'antd';
const { Header, Content, Footer } = Layout;

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
        navigate('/sidebarStudent');
    }
    const handleAccessAdmin = () => {
        navigate('/SideBarMC');
    }



    return (
        accessToken ? (
            <div className='home-container'>
                <Layout style={{minHeight: '100vh'}}>
                    <Header
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                         <div className="demo-logo">
                            
                        </div>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            style={{
                                flex: 1,
                                minWidth: 0,
                            }}
                        >
                            <Menu.Item style={{fontSize: 16, fontWeight: 'bold'}} key="student" onClick={handleAccessStudent}>
                                STUDENT
                            </Menu.Item>
                            <Menu.Item style={{fontSize: 16, fontWeight: 'bold'}} key="admin" onClick={handleAccessAdmin}>
                                MARKETING COORDINATOR
                            </Menu.Item>
                            <Menu.Item style={{marginLeft: 'auto', fontSize: 16, fontWeight: 'bold'}} key="logout" onClick={handleLogout}>
                                LOGOUT
                            </Menu.Item>    
                        </Menu>
                    </Header>
                    <br/>
                    <br/>
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
