import React, { useEffect, useState } from 'react';
import { Table, Button, message,  } from 'antd';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

const MMpage = () => {
  const { isAuthorized, } = useAuth();
  const [data, setData] = useState([]);
  

  const columns = [
    {
      title: 'Contribution ID',
      dataIndex: 'contributionId',
      render: (text) => text !== null ? text : '',
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      render: (text) => text !== null ? text : '',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      render: (text) => text !== null ? text : '',
    },
    
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text) => text !== null ? text : '',
    },
    {
      title: 'Approval',
      dataIndex: 'approval',
      render: (text) => {
        return text !== null ? (text  ? 'Approve' : 'Not Approve') : '';
      },
    },
    {
      title: 'Faculty Name',
      dataIndex: 'facultyName',
      render: (text) => text !== null ? text : '',
    },
    {
      title: 'Comments',
      dataIndex: 'commentions',
      render: (text) => (
        <div>
          {text !== null && text.map((comment, index) => (
            <div key={index}>{comment}<br/></div>
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      render: (_, record) => (
        <>
          <Button style={{marginLeft: '8px'}} onClick={() => handleDownload(record.contributionId)}>
            Download
          </Button>
        </>
      ),
    },
  ];

 

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
        const data = response.data.map((item, index) => ({
          ...item,
          key: index.toString(),
        }));
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  

  return (
    <div>
      {isAuthorized(2) ? (
        <>
          <Table dataSource={data} columns={columns} pagination={false}/>
          <Button style= {{marginTop: '15px'}}onClick={() => {message.error('làm gì có mà click')}}>Down ALL</Button>
        </>
      ) : (
        <div>
          <Navigate to="/unAuthorized" />
        </div>
      )}
    </div>
  );
};

export default MMpage;
