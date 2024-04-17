import React, { useEffect, useState } from 'react';
import { Input, Button, message, Collapse } from 'antd';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';


const MCpage = () => {
  const [data, setData] = useState([]);
  const { userName } = useAuth();
  const [newComment, setNewComment] = useState('');
  
  const { isAuthorized } = useAuth();

  const handleDownload = async (contributionId) => {
    try {
      const response = await axios.get(`https://localhost:7021/api/Contributions/Download/${contributionId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${contributionId}.zip`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      message.error('Failed to download ZIP');
    }
  };

  const handleSaveComment = async (contributionId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const commentData = {
        commentions: newComment,
        userName: userName,
      };

      await axios.put(
        `https://localhost:7021/api/Contributions/Comment/${contributionId}`,
        commentData,
        config
      );

      const newCommentions = `${userName} commented: ${newComment}`;

      const updatedData = data.map((item) => {
        if (item.contributionId === contributionId) {
          let comments = item.commentions || [];
          comments = [...comments, newCommentions]; // Add new comment to the beginning of the array
          return {
            ...item,
            commentions: comments,
          };
        }
        return item;
      });

      setData(updatedData);
      setNewComment('');
      message.success('Comment successful');
    } catch (error) {
      console.error('Error commenting:', error);
      message.error('Failed to add comment');
    }
  };
    
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7021/api/Contributions');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleApprove = async (contributionId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      await axios.put(
        `https://localhost:7021/api/Contributions/Review/${contributionId}`,
        { approval: true },
        config
      );

      const updatedData = data.map((item) =>
        item.contributionId === contributionId ? { ...item, approval: true } : item
      );

      setData(updatedData);
      message.success('Approved successfully');
    } catch (error) {
      console.error('Error approving:', error);
      message.error('Failed to approve');
    }
  };

  const handleReject = async (contributionId) => {
    try {
      await axios.delete(`https://localhost:7021/api/Contributions/${contributionId}`);

      const updatedData = data.filter((item) => item.contributionId !== contributionId);

      setData(updatedData);
      message.success('Rejected successfully');
    } catch (error) {
      console.error('Error rejecting:', error);
      message.error('Failed to reject');
    }
  };

  const handleReset = async (contributionId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      await axios.put(
        `https://localhost:7021/api/Contributions/Review/${contributionId}`,
        { approval: false },
        config
      );

      const updatedData = data.map((item) =>
        item.contributionId === contributionId ? { ...item, approval: false } : item
      );

      setData(updatedData);
      message.success('Delete successfully');
    } catch (error) {
      console.error('Error resetting:', error);
      message.error('Failed to reset');
    }
  };

  return (
    <div>
      {isAuthorized(3) ? (
        <>
          {data.map((contribution) => (
            <Collapse key={contribution.contributionId} size="large" items={[{ 
              key: contribution.contributionId.toString(), 
              label: contribution.title,
              children: (
                <>
                  <table>
                    <tbody>
                      <tr className='tr'>
                        <th className='th'>Contribution ID</th>
                        <td className='td'>{contribution.contributionId}</td>
                      </tr>
                      <tr className='tr'>
                        <th className='th'>User ID</th>
                        <td className='td'>{contribution.userId}</td>
                      </tr>
                      <tr className='tr'>
                        <th className='th'>Status</th>
                        <td className='td'>{contribution.status}</td>
                      </tr>
                      <tr className='tr'>
                        <th className='th'>Faculty Name</th>
                        <td className='td'>{contribution.facultyName}</td>
                      </tr>
                      <tr className='tr'>
                        <th className='th'>Documents</th>
                        <td className='td'><Button style={{padding: 0}} size="large" type="link" onClick={() => handleDownload(contribution.contributionId)}>Download</Button></td>
                      </tr>
                      <tr className='tr'>
                        <th className='th'>Approval</th>
                        <td className='td'>
                          {contribution?.approval ? (
                            <>
                              <Button danger onClick={() => handleReset(contribution.contributionId)}>Resit</Button>
                            </>
                          ) : (
                            <>
                              <Button type="primary" danger style={{background:'#66FF00', marginRight:'8px'}}  onClick={() => handleApprove(contribution.contributionId)}>Approve</Button>
                              <Button type="primary" danger onClick={() => handleReject(contribution.contributionId)}>Reject</Button>
                            </>
                          )}
                        </td>
                      </tr>
                      <tr className='tr'>
                        <th className='th'>Comments</th>
                        <td className='td' style={{ maxHeight: '320px', overflowY: 'scroll', display: 'block' }}>
                          {contribution.commentions.map((comment, index) => (
                            <div key={index} className="comment">
                              {comment}
                            </div>
                          ))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <Input.TextArea
                    placeholder="Enter your comment..."
                    value={newComment}
                    onChange={handleCommentChange}
                    rows={4}
                  />
                  <Button
                    style={{ marginTop: '12px', float: 'right' }}
                    key="save"
                    type="primary"
                    onClick={() => handleSaveComment(contribution.contributionId)}
                  >
                    Save Comment
                  </Button>
                  <div style={{ clear: 'both' }}></div>
                </>
              ),
            }]} />
          ))}
        </>
      ) : (
        <div>
          <Navigate to="/unAuthorized" />
        </div>
      )}
      
    </div>
  );
};

export default MCpage;
