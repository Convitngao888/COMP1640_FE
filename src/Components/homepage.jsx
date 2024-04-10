import './homepage.css'
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Layout, Menu, theme, Card, message } from 'antd';
import React, { useState, useEffect,  } from 'react';
import axios from 'axios';
import { DownloadOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Header, Content, Footer } = Layout;

const Homepage = () => {
    const [contributions, setContributions] = useState([]);
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
    const handleAccessMC = () => {
        navigate('/SideBarMC');
    }
    const handleAccessManager = () => {
        navigate('/SideBarMM');
    }

    const handleDownload = async (contributionId) => {
        try {
          const response = await axios.get(`https://localhost:7021/api/Contributions/DownloadSelected/${contributionId}`, {
            responseType: 'blob',
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${contributionId}.zip`);
          document.body.appendChild(link);
          link.click();
        } catch (error) {
          message.error('Failed to download ZIP');
        }
      };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('https://localhost:7021/api/Contributions');
            // Lọc những item có "approval" === true
            const approvedContributions = response.data.filter(contribution => contribution.approval === true);
            setContributions(approvedContributions);
          } catch (error) {
            console.error('Error fetching contributions:', error);
          }
        };
    
        fetchData();
      }, []);
    
      
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
                            <Menu.Item style={{fontSize: 16, fontWeight: 'bold'}} key="admin" onClick={handleAccessMC}>
                                MARKETING COORDINATOR
                            </Menu.Item>
                            <Menu.Item style={{fontSize: 16, fontWeight: 'bold'}} key="admin" onClick={handleAccessManager}>
                                MARKETING MANAGER
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
                             {/* nội dung API */}
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {contributions.map((contribution, index) => (
                                    <Card
                                        key={index}
                                        style={{ width: 300, margin: 10 }}
                                        cover={
                                            <img
                                                alt={`cdsfdsf`}
                                                src={'https://th.bing.com/th/id/OIP.1EjjKwF1EODXnXekeJD8iwHaCq?w=325&h=125&c=7&r=0&o=5&pid=1.7'}
                                            />
                                        }
                                        actions={[
                                            <DownloadOutlined  style={{fontSize: 15,}}
                                                onClick={() => handleDownload(contribution.contributionId)}
                                            />
                                        ]}
                                    >
                                        <Meta
                                            title={contribution.title}
                                            description={`Faculty: ${contribution.facultyName}`}
                                        />
                                    </Card>
                                ))}
                            </div>

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
