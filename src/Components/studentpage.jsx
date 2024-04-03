import React, { useState } from 'react';
import { Input, Button, message, Upload, } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from './AuthContext';
import GoBackButton from './goBackBtn';
const Studentpage = () => {
  const { isAuthorized } = useAuth();

  const [title, setTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [facultyName, setFacultyName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFacultyNameChange = (e) => {
    setFacultyName(e.target.value);
  };

  const handleFileChange = (info) => {
    setFileList(info.fileList);
  };

  const handleImageChange = (info) => {
    setImageList(info.fileList);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append('files', file.originFileObj);
      });
      imageList.forEach((image) => {
        formData.append('images', image.originFileObj);
      });
      formData.append('userId', 111); // Thay đổi thành ID người dùng thực tế
      formData.append('title', title);
      formData.append('facultyName', facultyName);

      const response = await fetch('https://localhost:7021/api/Contributions/AddArticles', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        message.success('Article added successfully!');
        setTitle('');
        setFileList([]);
        setImageList([]);
        setFacultyName('');
      } else {
        message.error('Invalid input, Please try again');
      }
    } catch (error) {
      console.error('Error adding article:', error);
      message.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const customRequest = async ({ file, onSuccess }) => {
    // Giả lập việc upload thành công với URL của file
    
      const fileUrl = 'ALAMAK';
      onSuccess(fileUrl);
    
  };

  return (
    <div>
      {isAuthorized(1) ? (
        <>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            
            minHeight: '100vh',
            padding: '20px'
          }}>
            <h1>SUBMIT FORM</h1>
            <div style={{ width: '100%', maxWidth: '700px' }}>
              <Input
                placeholder="Title"
                value={title}
                onChange={handleTitleChange}
                style={{ marginBottom: '15px', width: '100%' }}
              />
              <Input
                placeholder="Faculty Name"
                value={facultyName}
                onChange={handleFacultyNameChange}
                style={{ marginBottom: '15px', width: '100%' }}
              />
              <Upload
                name="files"
                customRequest={customRequest}
                onChange={handleFileChange}
                fileList={fileList}
                multiple  
                accept=".doc"
                style={{ marginBottom: '15px', width: '100%' }}
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
                style={{ marginBottom: '15px', width: '100%' }}
              >
                <Button style={{ marginTop: '20px'}} icon={<UploadOutlined />}>Upload Images</Button>
              </Upload>
              <div style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSubmit} loading={loading}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <h1>YOU HAVE NO PERMISSION TO ACCESS THIS PAGE</h1>
          <GoBackButton />
        </div>
      )}
    </div>
  );
};

export default Studentpage;
