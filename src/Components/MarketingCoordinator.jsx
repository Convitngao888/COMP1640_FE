import React, { useEffect, useState } from 'react';
import { Table, Modal, Input, Select, Button, message } from 'antd';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
const { Option } = Select;

const MCpage = () => {
  const { isAuthorized } = useAuth();
  const [data, setData] = useState([]);
  const [editFormData, setEditFormData] = useState({
    id: null,
    title: '',
    approval: true,
    comment: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [defaultApproval, setDefaultApproval] = useState(true);

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
        setDefaultApproval(text);
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
      dataIndex: 'comments',
      render: (text) => text !== null ? text : '',
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      render: (_, record) => (
        <>
          <Button onClick={() => edit(record.key)}>
            Edit
          </Button>
          <Button style={{marginLeft: '8px'}} onClick={() => handleDownload(record.contributionId)}>
            Download
          </Button>
        </>
      ),
    },
  ];

  const edit = (key) => {
    const record = data.find((item) => item.key === key);
    if (!record) {
      console.error('Record not found');
      return;
    }
  
    // Set editFormData to the selected record's values
    setEditFormData({
      id: record.contributionId,
      title: record.title,
      approval: record.approval,
      comment: record.comments ,
    });
    
    // Show the modal
    setIsModalVisible(true);
  };

  const cancel = () => {
    setIsModalVisible(false);
  };

  const save = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const dataToSend = {
        id: editFormData.id,
        approval: editFormData.approval,
        comments: editFormData.comment,
      };
  
      await axios.put(
        `https://localhost:7021/api/Contributions/Review/${dataToSend.id}`,
        dataToSend,
        config
      );
  
      setIsModalVisible(false);
  
      const updatedData = data.map((item) => {
        if (item.contributionId === editFormData.id) {
          return {
            ...item,
            title: editFormData.title,
            approval: editFormData.approval,
            comments: editFormData.comment ,
          };
        }
        return item;
      });
      setData(updatedData);
  
      message.success('Update successful');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleDownload = async (contributionId) => {
    try {
      const response = await axios.get(`https://localhost:7021/api/Contributions/Download/${contributionId}`, {
        responseType: 'blob',
      });
      console.log(response.data);
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
      {isAuthorized(4) ? (
        <>
          <Table dataSource={data} columns={columns} />
          <Modal
            title="Edit Contribution"
            visible={isModalVisible}
            onOk={save}
            onCancel={cancel}
          >
      
            <Select
              defaultValue={defaultApproval ? "approve" : "not-approve"}
              onChange={(value) => handleInputChange('approval', value === 'approve')}
              style={{ width: '100%', marginTop: '10px' }}
            >
              <Option value="approve">Approve</Option>
              <Option value="not-approve">Not Approve</Option>
            </Select>
            <Input
              value={editFormData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Comment"
              style={{ marginTop: '10px' }}
            />
          </Modal>
        
        </>
      ) : (
        <div>
          <Navigate to="/unAuthorized" />
        </div>
      )}
    </div>
  );
};

export default MCpage;
