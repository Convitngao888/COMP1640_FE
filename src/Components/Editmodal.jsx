import { Modal, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState,  } from 'react';
import axios from 'axios';

const EditModal = ({ contribution, visible, onCancel, onSave }) => {
  const [title, setTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [imageList, setImageList] = useState([]);

  // Function to handle title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Function to handle file upload change
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Function to handle image upload change
  const handleImageChange = ({ fileList }) => {
    setImageList(fileList);
  };

  const handleEdit = async () => {
    try {
      const promises = [];
  
      if (title !== "") {
        const formData = new FormData();
        formData.append('title', title);
        const titlePromise = axios.put(`https://localhost:7021/api/Contributions/EditTitle/${contribution.contributionId}`, formData);
        promises.push(titlePromise);
      }
  
      if (fileList.length !== 0) {
        const fileFormData = new FormData();
        fileList.forEach(file => {
          fileFormData.append('files', file.originFileObj);
        });
        const filePromise = axios.put(`https://localhost:7021/api/Contributions/EditFiles/${contribution.contributionId}`, fileFormData);
        promises.push(filePromise);
      }
  
      if (imageList.length !== 0) {
        const imageFormData = new FormData();
        imageList.forEach(image => {
          imageFormData.append('files', image.originFileObj);
        });
        const imagePromise = axios.put(`https://localhost:7021/api/Contributions/EditImage/${contribution.contributionId}`, imageFormData);
        promises.push(imagePromise);
      }
  
      const responses = await Promise.all(promises);
  
      // Xử lý các response nếu cần
      responses.forEach(response => {
        if (title !== "" && response.config.url.includes("EditTitle")) {
          contribution.title = response.data;
          setTitle('')
        }

        if (fileList.length !== 0 && response.config.url.includes("EditFiles")) {
          contribution.filePaths = response.data;
          setFileList([]);
        } 
        
        if (imageList.length !== 0 && response.config.url.includes("EditImage")) {
          contribution.imagePaths = response.data;
          setImageList([]);
        }
      });
  
      message.success('Contribution updated successfully');
      onSave(contribution); // Gửi contribution đã cập nhật ra ngoài
    } catch (error) {
      message.error('Failed to update contribution');
      console.error('Error:', error);
    }
  };
  
  

  const customRequest = async ({ file, onSuccess }) => {
    // Giả lập việc upload thành công với URL của file
    
      const fileUrl = 'ALAMAK';
      onSuccess(fileUrl);
    
  };
  return (
    <Modal
      title="Contribution Details"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button type="primary" onClick={handleEdit}>
          Edit
        </Button>
      ]}
      width={1000}
    >
      <table>
        <tbody>
          <tr className='tr'>
            <th className='th'>Contribution ID</th>
            <td className='td'>{contribution?.contributionId}</td>
          </tr>
          <tr className='tr'>
            <th className='th'>Title</th>
            <td className='td'>{contribution?.title}</td>
          </tr>
          <tr className='tr'>
            <th className='th'>Faculty Name</th>
            <td className='td'>{contribution?.facultyName}</td>
          </tr>
          <tr className='tr'>
            <th className='th'>Files</th>
            <td className='td'>
              <ul>
                {contribution?.filePaths?.map((filePath, index) => (
                  <li style={{listStyle: 'none'}} key={index}>{filePath}</li>
                ))}
              </ul>
            </td>
          </tr>
          <tr className='tr'>
            <th className='th'>Images</th>
            <td className='td'>
              <ul>
                {contribution?.imagePaths?.map((imagePath, index) => (
                  <li style={{listStyle: 'none'}} key={index}>{imagePath}</li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Update</h2>
      <Input
        placeholder="Title"
        value={title}
        onChange={handleTitleChange}
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
        <Button style={{ marginTop: '20px' }} icon={<UploadOutlined />}>
          Upload Images
        </Button>
      </Upload>
      
    </Modal>
  );
};

export default EditModal;
