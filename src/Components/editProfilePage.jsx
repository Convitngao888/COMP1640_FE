import { Form, Input, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const EditProfilePage = () => {
  const [form] = Form.useForm();
  const { userId } = useAuth();
  const [image, setImage] = useState([]);

  
  const handleImageChange = (info) => {
    setImage(info.fileList); // fileList is an array of file objects
  };
  
  const customRequest = async ({ file, onSuccess }) => {
    // Giả lập việc upload thành công với URL của file
    
      const fileUrl = 'ALAMAK';
      onSuccess(fileUrl);
    
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7021/api/Users/ViewUserDetail/${userId}`);
        console.log(response.data);
        // Set initial form values
        form.setFieldsValue({
          email: response.data.email,
          userName: response.data.username,
          password: response.data.password,
          confirm: response.data.password,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();    
  });

  const handleEditImage = async () => {
    try {
      const formData = new FormData();
      formData.append("avatar", image[0].originFileObj);
  
      await axios.put(`https://localhost:7021/api/Users/UploadImages/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      message.success('Image updated successfully!');
    } catch (error) {
      console.error('Error editing image:', error);
      message.error('Please Input Image');
    }
  };


  const onFinish = async (values) => {
    try {
      const { userName, password, email } = values;
      await axios.put(`https://localhost:7021/api/Users/EditProfile/${userId}`, {
        userName,
        password,
        email
      });
      message.success('Username changed successfully!');
    } catch (error) {
      console.error('Error changing username:', error);
      message.error(error.response.data);
    }
  };

  return (
    <div style={{ marginLeft: 370 }}>
      <Form
        {...layout}
        form={form}
        name="register"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError
      >
        <h1 style={{ textAlign: 'center', marginBottom: 20 }}>User Info And Edit Form</h1>

        <Form.Item
            name="email"
            label="E-mail"
            rules={[
                {
                type: 'email',
                message: 'The input is not valid E-mail!',
                },
                {
                required: true,
                message: 'Please input your E-mail!',
                },
            ]}
            >
            <Input />
        </Form.Item>
        <Form.Item
            name="userName"
            label="Username"
            rules={[
                {
                  required: true,
                  message: 'Please input your Username!',
                  whitespace: true,
                },
            ]}
            >
            <Input />
        </Form.Item>
        <Form.Item
            name="password"
            label="Password"
            rules={[
                {
                required: true,
                message: 'Please input your password!',
                },
            ]}
            hasFeedback
            >
            <Input.Password />
        </Form.Item>
        <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
                {
                required: true,
                message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                    }
                    return Promise.reject(new Error('The password that you entered do not match!'));
                },
                }),
            ]}
            >
            <Input.Password />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 8,
          }}
        >
          <Button type="primary" htmlType="submit">
            Edit
          </Button>
        </Form.Item>
        <Form.Item
          name="avatar"
          label="Avatar"
          rules={[
              {
                whitespace: true,
              },
          ]}
          >
            <Upload
              name="images"
              customRequest={customRequest}
              onChange={handleImageChange}
              fileList={image}
              accept=".jpg,.png,.jpeg"
              style={{ marginBottom: '15px', width: '100%' }}
              maxCount={1}
            >
              <Button style={{ marginTop: '20px' }} icon={<UploadOutlined />}>
                Upload Images
              </Button>
            </Upload>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 8,
          }}
        >
          <Button type="primary" onClick={handleEditImage}>
            Edit Image
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProfilePage;
