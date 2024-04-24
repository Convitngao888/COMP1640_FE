import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './ChatBox.css';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { userName, facultyName } = useAuth();

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://localhost:7021/api/ChatBoxes/${facultyName}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages(); // Include the fetchMessages function inside the useEffect

        // No dependency array to remove the warning
    }, [facultyName]);

    const sendMessage = async () => {
        if (!newMessage.trim()) {
            return; // Don't send empty messages
        }

        try {
            const messageData = {
                facultyName: facultyName,
                userName: userName,
                contents: newMessage
            };

            const response = await axios.post('https://localhost:7021/api/ChatBoxes/AddMessage', messageData);
            const newMessageData = response.data;
            setMessages([...messages, newMessageData]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div class="msger">
            <header class="msger-header">
                <div class="msger-header-title">
                    <i class="fas fa-comment-alt"></i>Chat Box
                </div>
                <div class="msger-header-options">
                    <span><i class="fas fa-cog"></i></span>
                </div>
            </header>

            <main className="msger-chat">
                {messages.map((message, index) => (
                    <div className="msg" key={index}>
                        <div className="msg-bubble">
                            <div className="msg-info">
                                <div className="msg-info-avatar">
                                    <img src={message.avatarPath} alt="User Avatar" className="avatar-img" />
                                </div>
                                <div>
                                    <div className="msg-info-name">{message.userName}</div>
                                    <div className="msg-info-time">{message.chatTime}</div>
                                </div>
                            </div>
                            <div className="msg-text">{message.content}</div>
                        </div>
                    </div>
                ))}
            </main>




            <form class="msger-inputarea" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                <input type="text" class="msger-input" placeholder="Enter your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <button type="submit" class="msger-send-btn">Send</button>
            </form>
        </div>
    );
};

export default ChatBox;
