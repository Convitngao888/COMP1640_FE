import React, { useState, useEffect } from 'react';
import { DatePicker, Button, Form, Table, message, Popconfirm, Modal } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Import plugin
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

dayjs.extend(utc); // Use utc plugin

const Adminpage = () => {
  const { isAuthorized } = useAuth();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7021/api/AcademicYears');
        setData(response.data);
      } catch (error) {
        console.error('API Error:', error);
        // Handle error, show an error message, etc.
      }
    };

    fetchData();
  }, []);

  const onFinish = async () => {
    if (!selectedDates || selectedDates.length === 0) {
      message.error('Please pick date');
      return;
    }

    if (selectedDates.length > 3) {
      message.error('Academic year can only have 3 phases');
      return;
    }

    const formattedDates = selectedDates.map(date => dayjs(date).utc(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));

    try {
      const response = await axios.post('https://localhost:7021/api/AcademicYears', {
        startDays: formattedDates[0],
        endDays: formattedDates[1],
        finalEndDays: formattedDates[2],
      });

      message.success('Create Academic Year Successfully');
      const updatedData = [...data, response.data];
      setData(updatedData);
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data);
      } else {
        console.error('API Error:', error);
        message.error('API TỰ TẮT RỒI THỊNH ƠI');
      }
      // Handle error, show an error message, etc.
    }
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`https://localhost:7021/api/AcademicYears/${editRecord.academicYearsId}`, {
        academicYearsId: editRecord.academicYearsId,
        startDays: dayjs(editRecord.startDays).utc(editRecord.startDays).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        endDays: dayjs(editRecord.endDays).utc(editRecord.endDays).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        finalEndDays: dayjs(editRecord.finalEndDays).utc(editRecord.finalEndDays).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      });
  
      message.success('Edit Academic Year Successfully');
  
      // Update editRecord with response data
      const updatedRecord = {
        ...editRecord,
        startDays: response.data.startDate,
        endDays: response.data.endDate,
        finalEndDays: response.data.finalEndDate,
      };
      
      const updatedData = data.map(item =>
        item.academicYearsId === editRecord.academicYearsId ? updatedRecord : item
      );
      setData(updatedData);
      setIsModalVisible(false);
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data);
      } else {
        console.error('API Error:', error);
        message.error('Đã có lỗi xảy ra khi cập nhật');
      }
      // Handle error, show an error message, etc.
    }
  };

  const handleDelete = async (record) => {
    // Implement logic to delete the academic year
    try {
      await axios.delete(`https://localhost:7021/api/AcademicYears/${record.academicYearsId}`);
      message.success('Delete Academic Year Successfully');
      const updatedData = data.filter(item => item.academicYearsId !== record.academicYearsId);
      setData(updatedData);
    } catch (error) {
      console.error('API Error:', error);
      message.error('Đã có lỗi xảy ra khi xóa');
      // Handle error, show an error message, etc.
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'academicYearsId',
      key: 'academicYearsId',
    },
    {
      title: 'Start Day',
      dataIndex: 'startDays',
      key: 'startDays',
    },
    {
      title: 'End Day',
      dataIndex: 'endDays',
      key: 'endDays',
    },
    {
      title: 'Final End Day',
      dataIndex: 'finalEndDays',
      key: 'finalEndDays',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button style={{ marginRight: 8 }} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure delete this academic year?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const onChange = (dates) => {
    setSelectedDates(dates);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (key, value) => {
    const localTime = value ? dayjs(value).utc(value) : null;
     setEditRecord({
       ...editRecord,
       [key]: localTime,
     });
   };

  return (
    <div>
      {isAuthorized(4) ? (
        <>
          <Form form={form} name="time_related_controls" onFinish={onFinish}>
            <DatePicker placeholder='Select 3 Phases Of Academic Year' multiple onChange={onChange} size="large" />
            <Form.Item>
              <Button style={{ marginTop: 8 }} type="primary" htmlType="submit">
                Create Academic Year
              </Button>
            </Form.Item>
          </Form>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: 50,
            }}
            scroll={{
              y: 240,
            }}
          />
          <Modal
            title="Edit Academic Year"
            visible={isModalVisible}
            onOk={handleUpdate}
            onCancel={handleCancel}
          >
            <Form>
              <Form.Item label="Start Day">
                 <DatePicker
                    value={editRecord && editRecord.startDays ? dayjs(editRecord.startDays).utc(editRecord.startDays) : null}
                    onChange={(date) => handleInputChange('startDays', date)}
                />
              </Form.Item>
              <Form.Item label="End Day">
                <DatePicker
                    value={editRecord && editRecord.endDays ? dayjs(editRecord.endDays).utc(editRecord.endDays) : null}
                    onChange={(date) => handleInputChange('endDays', date)}
                />
              </Form.Item>
              <Form.Item label="Final End Day">
                <DatePicker
                    value={editRecord && editRecord.finalEndDays ? dayjs(editRecord.finalEndDays).utc(editRecord.finalEndDays)  : null}
                    onChange={(date) => handleInputChange('finalEndDays', date)}
                />
              </Form.Item>
            </Form>
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

export default Adminpage;
