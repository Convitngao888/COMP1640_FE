import { Table, Modal, Button, message, Input, Upload, } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { UploadOutlined } from '@ant-design/icons';

const MySubmission = () => {
  
  const {  userName, userId } = useAuth();
  const [data, setData] = useState([]);
  const [editFormData, setEditFormData] = useState({
    id: null,
    title: '',
    approval: true,
    comment: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [fileList, setFileList] = useState([]);


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
            Edit
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
      title: record.title,
      files: [],
      image: [],
    });
  
    setIsModalVisible(true);
  };

  const cancel = () => {
    setIsModalVisible(false);
  };

  const save = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editFormData.title);
      formData.append('userId', userId);
      fileList.forEach((file) => {
        formData.append('files', file.originFileObj);
      });
      imageList.forEach((image) => {
        formData.append('images', image.originFileObj);
      });
  
      await axios.put(
        `https://localhost:7021/api/Contributions/Edit/${editFormData.id}`,
        formData,
      );
  
      setIsModalVisible(false);
  
      const updatedData = data.map((item) => {
        if (item.contributionId === editFormData.id) {
          return {
            ...item,
            title: editFormData.title,
          };
        }
        return item;
      });
      setData(updatedData);
  
      message.success('Update successful');
    } catch (error) {
      message.error('invalid input');
    }
  };
  
  const handleFileChange = (info) => {
    setFileList(info.fileList);
  };

  const handleImageChange = (info) => {
    setImageList(info.fileList);
  };
  
  const customRequest = async ({ onSuccess }) => {
    // Giả lập việc upload thành công với URL của file
    
      const fileUrl = 'ALAMAK';
      onSuccess(fileUrl);
    
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
  
      // Kiểm tra dữ liệu trả về từ API
      
        const newCommentions = `${userName} commented: ${newComment}`;
  
        const updatedData = data.map((item) => {
          if (item.contributionId === contributionId) {
            // Thêm comment mới vào danh sách comment cũ
            const updatedItem = {
              
              commentions: [...item.commentions, newCommentions],
            };
            return updatedItem;
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
        const response = await axios.get(`https://localhost:7021/api/Contributions/${userId}`);
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
  },[userId]);

  return (
    <div>
      <Table dataSource={data} columns={columns} pagination={false} />
      <Modal
        title="Edit Contribution"
        open={isModalVisible} 
        onOk={save}
        onCancel={cancel}
      >
        <Input
          value={editFormData.title}
          onChange={(e) => {
            setEditFormData({ ...editFormData, title: e.target.value });
          }}
          placeholder="Title"
          style={{ marginBottom: '15px', width: '100%' }}
        />
        <Upload
          name="files"
          customRequest={customRequest}
          onChange={handleFileChange}
          fileList={fileList}
          multiple  
          accept=".doc"
          style={{  width: '100%' }}
        >
          <Button icon={<UploadOutlined />}>Upload Files</Button>
        </Upload>
        <Upload
          name="images"
          customRequest={customRequest}
          onChange={handleImageChange}
          fileList={imageList}
          accept=".jpg,.png,.jpeg"
          multiple
          style={{  width: '100%' }}
        >
          <Button style={{ marginTop: '20px'}} icon={<UploadOutlined />}>Upload Images</Button>
        </Upload>
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

    </div>
  );
  
  
}

export default MySubmission;
