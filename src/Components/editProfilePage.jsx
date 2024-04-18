import { Form, Input, Button, message } from 'antd';
import React, { useEffect } from 'react';
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
  }, );

  const onFinish = async (values) => {
    try {
      const { userName, password, email } = values;
      await axios.put(`https://localhost:7021/api/Users/ChangeUsername/${userId}`, {
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
      </Form>
    </div>
  );
};

export default EditProfilePage;
