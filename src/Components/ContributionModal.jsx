import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Avatar, message } from 'antd';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './modal.css';

const ContributionModal = ({ contribution, visible, onCancel,}) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://localhost:7021/api/Commentions/${contribution?.contributionId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (contribution) {
      fetchComments();
    }
  }, [contribution]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
    console.log(e.target.value);
  };  

  const handleSaveComment = async () => {
    try {
      const response = await axios.post('https://localhost:7021/api/Commentions/AddComment', {
        contributionId: contribution?.contributionId,
        userId: userId,
        contents: newComment,
      });

      // Update comments state with the newly added comment
      setComments([...comments, response.data]);

      // Clear the comment input field
      setNewComment('');

      // Inform the user that the comment has been added successfully
      message.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('Failed to add comment');
    }
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
              {comments.map((comment, index) => (
                <div key={index} className="comment">
                  <Avatar style={{marginRight: 8}}src={comment.avatarLink} />
                  <span style={{marginRight: 8, fontSize: 18, fontWeight:"bold" }}className="username">{comment.userName}</span>
                  <span className="comment-time">{comment.commentTimeText}:</span>
                  <div style={{marginLeft: 39, fontSize: 12}} className="content">{comment.content}</div>
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
