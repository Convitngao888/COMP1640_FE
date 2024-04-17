import { Modal, Input, Upload, Button,  } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState,  } from 'react';

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
    const files = fileList.map((file) => file.originFileObj);
    const images = imageList.map((image) => image.originFileObj);

    onSave({ title, files, images });

    // Sau khi gọi API thành công, cập nhật lại giá trị của state
    setTitle('');
    setFileList([]);
    setImageList([]);
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
