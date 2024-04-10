import React, { useEffect, useState } from 'react';
import { Table, Modal, Select, Button, message, Input } from 'antd';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
const { Option } = Select;

const MCpage = () => {
  const { isAuthorized, userName } = useAuth();
  const [data, setData] = useState([]);
  const [editFormData, setEditFormData] = useState({
    id: null,
    title: '',
    approval: true,
    comment: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [approvalValue, setApprovalValue] = useState('Select Approval');
  const [newComment, setNewComment] = useState('');
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);

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
          <Button onClick={() => edit(record.key)}>
            Approve
          </Button>
          <Button style={{marginLeft: '8px'}} onClick={() => handleDownload(record.contributionId)}>
            Download
          </Button>
          <Button
            style={{ marginLeft: '8px' }}
            onClick={() => {
              setEditFormData({
                id: record.contributionId,
                approval: record.approval,
              });
              setIsCommentModalVisible(true);
            }}
          >
            Comment
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
  
    setEditFormData({
      id: record.contributionId,
      approval: record.approval,
    });

    setApprovalValue(record.approval ? 'approve' : 'not-approve');

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
        approval: editFormData.approval,
      };
  
      await axios.put(
        `https://localhost:7021/api/Contributions/Review/${editFormData.id}`,
        dataToSend,
        config
      );
  
      setIsModalVisible(false);
  
      const updatedData = data.map((item) => {
        if (item.contributionId === editFormData.id) {
          return {
            ...item,
            approval: editFormData.approval,
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

 const handleComment = async (contributionId) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const commentData = {
      commentions: newComment,
      userName: userName,
    };

    await axios.put(
      `https://localhost:7021/api/Contributions/Comment/${contributionId}`,
      commentData,
      config
    );

    const newCommentions = `${userName} commented: ${newComment}`;

    const updatedData = data.map((item) => {
      if (item.contributionId === contributionId) {
        let comments = item.commentions || []; // Xác định mảng comments, nếu item.commentions không tồn tại (null hoặc undefined), sử dụng mảng rỗng []
        comments = [...comments, newCommentions]; // Thêm comment mới vào mảng comments
        // Create a new object with the updated comments array
        return {
          ...item,
          commentions: comments,
        };
      }
      return item;
    });

    // Cập nhật lại state `data` sau khi cập nhật dữ liệu thành công
    setData(updatedData);

    message.success('Comment successful');
  } catch (error) {
    console.error('Error commenting:', error);
    message.error('Failed to add comment');
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
      {isAuthorized(3) ? (
        <>
          <Table dataSource={data} columns={columns} pagination={false}/>
          <Modal
            title="Approval"
            open={isModalVisible} 
            onOk={save}
            onCancel={cancel}
          >
            <Select
              value={approvalValue}
              onChange={(value) => {
                setApprovalValue(value);
                handleInputChange('approval', value === 'approve');
              }}
              style={{ width: '100%', marginTop: '10px' }}
            >
              <Option value="approve">Approve</Option>
              <Option value="not-approve">Not Approve</Option>
            </Select>
          </Modal>

          <Modal
            title="Add Comment"
            open={isCommentModalVisible}
            onOk={() => {
              handleComment(editFormData.id);
              setIsCommentModalVisible(false);
            }}
            onCancel={() => setIsCommentModalVisible(false)}
          >
            <Input
              placeholder="Enter your comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
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
