import React, { useEffect, useState } from 'react';
import { List, Card } from 'antd';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { userId } = useAuth();

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://localhost:7021/api/Users/${userId}/notifications`); // Using userId from the response
                setNotifications(response.data.notifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setError('Failed to fetch notifications');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '24px' }}>
            <h1>Notifications</h1>
            <List
                dataSource={notifications}
                renderItem={(notification, index) => (
                    <List.Item>
                        <Card title={`Notification ${index + 1}`} style={{ width: '100%' }}>
                            <p>{notification}</p>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default NotificationPage;
