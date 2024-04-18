import React, { useState, useEffect } from 'react';
import { Input, Button, message, Upload, Select   } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

const { Option } = Select;

const Studentpage = () => {
  const { isAuthorized, userId, facultyName } = useAuth();

  const [title, setTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [academicYearsOptions, setAcademicYearsOptions] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await fetch('https://localhost:7021/api/AcademicYears');
        if (!response.ok) {
          throw new Error('Failed to fetch academic years');
        }
        const data = await response.json();
        setAcademicYearsOptions(data);
      } catch (error) {
        console.error('Error fetching academic years:', error);
      }
    };

    fetchAcademicYears();
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFileChange = (info) => {
    setFileList(info.fileList);
  };

  const handleImageChange = (info) => {
    setImageList(info.fileList);
  };

  const handleAcademicYearChange = (value) => {
    setSelectedAcademicYear(value);
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
      formData.append('userId', userId);
      formData.append('title', title);
      formData.append('facultyName', facultyName);
      formData.append('academic', selectedAcademicYear);

      const response = await fetch('https://localhost:7021/api/Contributions/AddArticles', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        message.success('Article added successfully!');
        setTitle('');
        setFileList([]);
        setImageList([]);
        setSelectedAcademicYear('')
      } else {
        const errorMessage = await response.text();
        message.error(errorMessage);
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
              <Select
                placeholder="Select Academic Year"
                onChange={handleAcademicYearChange}
                style={{ marginBottom: '15px', width: '100%' }}
              >
                {academicYearsOptions.map(year => (
                  <Option key={year.academicYearsId} value={year.academicYear}>{year.academicYear}</Option>
                ))}
              </Select>
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
          <Navigate to="/unAuthorized" />
        </div>
      )}
    </div>
  );
};

export default Studentpage;
