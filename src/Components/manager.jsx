import React, { useEffect, useState } from 'react';
import { Table, Button, message, Select } from 'antd';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

const { Option } = Select;

const MMpage = () => {
  const { isAuthorized } = useAuth();
  const [data, setData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

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

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7021/api/Contributions');
        let filteredData = response.data.filter(item => item.approval === true);
  
        // Lọc theo khoa nếu có giá trị được chọn
        if (selectedDepartment !== "all") {
          filteredData = filteredData.filter(item => item.facultyName === selectedDepartment);
        }
  
        const formattedData = filteredData.map((item, index) => ({
          ...item,
          key: index.toString(),
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [selectedDepartment]);

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

  const handleDownloadAll = async () => { 
    try {
      const response = await axios.get(`https://localhost:7021/api/Contributions/DownloadAllSelected`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `all_contributions.zip`); // Đặt tên tệp tin tải xuống
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      message.error('Failed to download ZIP');
    }
  };

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value); // Cập nhật giá trị khi khoa được chọn thay đổi
  };

  return (
    <div>
      {isAuthorized(2) ? (
        <>
          <Select defaultValue="all" style={{ width: 200, marginBottom: '15px' }} onChange={handleDepartmentChange}>
            <Option value="all">All Departments</Option>
            <Option value="Computer Science">Computer Science</Option>
            <Option value="Business Administration">Business Administration</Option>
            <Option value="Graphic Design">Graphic Design</Option>
          </Select>
          <Table dataSource={data} columns={columns} pagination={false} />
          <Button style={{ marginTop: '15px' }} onClick={handleDownloadAll}>Download All</Button>
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
