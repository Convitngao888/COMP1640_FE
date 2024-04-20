import { Modal, Button, Input } from 'antd';
import React, { useState } from 'react';
import './modal.css'
const ContributionModal = ({ contribution, visible, onCancel, onSaveComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleSaveComment = () => {
    onSaveComment(newComment);
    setNewComment('');
  };

  return (
    <Modal
      title="Contribution Details"
      visible={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSaveComment}>
          Save Comment
        </Button>,
      ]}
    >
      <table>
        <tbody>
          <tr className='tr'>
            <th className='th'>Contribution ID</th>
            <td className='td'>{contribution?.contributionId}</td>
          </tr>
          <tr className='tr'>
            <th className='th'>User ID</th>
            <td className='td'>{contribution?.userId}</td>
          </tr>
          <tr className='tr'>
            <th className='th'>Status</th>
            <td className='td'>{contribution?.status}</td>
          </tr>
          <tr className='tr'>
            <th className='th'>Faculty Name</th>
            <td className='td'>{contribution?.facultyName}</td>
          </tr>
          <tr className='tr'>
            <th className='th' >Comments</th>
            <td className='td' style={{ maxHeight: '320px', overflowY: 'scroll', display: 'block' }}>
              {contribution?.commentions?.map((comment, index) => (
                <div key={index} className="comment">
                  {comment}
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Comment</h2>
      <Input.TextArea
        placeholder="Enter your comment..."
        value={newComment}
        onChange={handleCommentChange}
        rows={4}
      />
    </Modal>
  );
};

export default ContributionModal;
