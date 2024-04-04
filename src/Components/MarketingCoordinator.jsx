import React, { useEffect, useState } from 'react';
import { Table, Modal, Input, Select, Button } from 'antd';
import axios from 'axios';

const { Option } = Select;

const Adminpage = () => {
  const [data, setData] = useState([]);
  const [editFormData, setEditFormData] = useState({
    id: null,
    title: '',
    approval: true,
    comment: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      title: 'Submission Date',
      dataIndex: 'submissionDate',
      render: (text) => text !== null ? text : '',
    },
    {
      title: 'Closure Date',
      dataIndex: 'closureDate',
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
      render: (text) => text !== null ? (text ==='true'  ? 'Approve' : 'Not Approve') : '',
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
        title: 'Edit',
        dataIndex: 'operation',
        render: (_, record) => (
            <Button onClick={() => edit(record.key)}>
            Edit
            </Button>
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
      approval: record.approval,
      comment: record.comments && record.comments.length > 0 ? record.comments[0] : '',
    });
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
            'Access-Control-Allow-Origin': '*', // Hoặc cấu hình chính xác cho origin của bạn
          },
        };
        console.log('Data to be sent:', {
            id: editFormData.id,
            approval: editFormData.approval.toString(),
            comments: editFormData.comment,
          });
      // Gọi API PUT và cập nhật dữ liệu
      await axios.put(
        `https://localhost:7021/api/Contributions/Review/${editFormData.id}`,
        {
          id: editFormData.id,
          approval: editFormData.approval.toString(),
          comments: editFormData.comment,
        },
        config  // Truyền cấu hình vào yêu cầu
      );

      // Sau khi gửi thành công, đóng modal
      setIsModalVisible(false);

      // Optional: Cập nhật dữ liệu trong state sau khi gọi API thành công
      const updatedData = data.map((item) => {
        if (item.key === editFormData.key) {
          return {
            ...item,
            title: editFormData.title,
            approval: editFormData.approval,
            comments: [editFormData.comment],
          };
        }
        return item;
      });
      setData(updatedData);

      // Hiển thị thông báo hoặc thực hiện các hành động khác sau khi gửi thành công
      console.log('Update successful');
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
    <>
      <Table dataSource={data} columns={columns} />
      <Modal
        title="Edit Contribution"
        visible={isModalVisible}
        onOk={save}
        onCancel={cancel}
      >
        <Input
          value={editFormData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Title"
        />
        <Select
          
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
  );
};

export default Adminpage;
