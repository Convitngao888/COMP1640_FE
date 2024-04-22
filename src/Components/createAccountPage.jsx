import { Form, Input, Button, message, Select, } from 'antd';
import axios from 'axios';
import React, { useState, useEffect  } from 'react';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const { Option } = Select;

const CreateAccountPage = () => {
  const [form] = Form.useForm();
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const handleFaculty = (value) => {
    // Update form state with selected faculty value if needed
    console.log("Selected faculty:", value);
  };
  
  const handleRole = (value) => {
    // Update form state with selected role value if needed
    console.log("Selected role:", value);
  };
  useEffect(() => {
    const fetchFaculties = async () => {
            try {
                const response = await fetch('https://localhost:7021/api/Faculties');
                if (!response.ok) {
                    throw new Error('Failed to fetch faculties');
                }
                const data = await response.json();
                setFacultyOptions(data);
            } catch (error) {
                console.error('Error fetching faculties:', error);
            }
        };

        fetchFaculties();
    }, []);

    useEffect(() => {
        const fetchRoles = async () => {
          try {
            const response = await axios.get('https://localhost:7021/api/Roles');
            setRoleOptions(response.data);
          } catch (error) {
            console.error('Error fetching roles:', error);
          }
        };
    
        fetchRoles();
    }, []);


  const onFinish = async (values) => {
    try {
      const { userName, password, email, facultyName, roleId } = values;
      await axios.post(`https://localhost:7021/api/Users/AddManagerAndCoordinator`, {
        userName,
        password,
        email,
        facultyName,
        roleId
      });
      message.success('Create successfully!');
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
            <Input  placeholder="Input Email"/>
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
            <Input  placeholder="Input User Name"/>
        </Form.Item>
        <Form.Item
        name="facultyName"
        label="Facultyname"
        rules={[
            {
            required: true,
            message: 'Please choose faculty name!',
            },
        ]}
        >
        <Select
            placeholder="Select Faculty"
            style={{ marginBottom: '15px', width: '100%' }}
            onChange={handleFaculty} // Trigger validation on selection
        >
            {facultyOptions.map(option => (
            <Option key={option.facultyId} value={option.facultyName}>
                {option.facultyName}
            </Option>
            ))}
        </Select>
        </Form.Item>
        <Form.Item
        name="roleId"
        label="Role"
        rules={[
            {
            required: true,
            message: 'Please choose a role!',
            },
        ]}
        >
        <Select
            placeholder="Select role"
            style={{ marginBottom: '15px', width: '100%' }}
            onChange={handleRole} // Trigger validation on selection
        >
            {roleOptions.map((option) => (
            <Option key={option.roleId} value={option.roleId}>
                {option.roleName}
            </Option>
            ))}
        </Select>
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
            <Input.Password  placeholder="Input User Password"/>
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
            <Input.Password placeholder="Confirm Password"/>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 8,
          }}
        >
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateAccountPage;
