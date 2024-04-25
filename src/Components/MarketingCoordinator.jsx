import React, { useEffect, useState } from 'react';
import { Input, Button, message, Collapse, Avatar, Select } from 'antd';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
const { Option } = Select;

const MCpage = () => {
  const [data, setData] = useState([]);
  const { userId } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const { isAuthorized, facultyName } = useAuth();
  const [filterStatus, setFilterStatus] = useState('Show All');
  const [searchTitle, setSearchTitle] = useState('');

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

  // Function to fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7021/api/Contributions/GetContributionsByFaculty?facultyName=${facultyName}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [facultyName]);

  // Function to fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentData = {};
        for (const contribution of data) {
          const response = await axios.get(`https://localhost:7021/api/Commentions/${contribution.contributionId}`);
          // Assuming response.data is an array of comments
          commentData[contribution.contributionId] = response.data;
        }
        setComments(commentData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [data]);

  // Function to handle comment change
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Function to save comment
  const handleSaveComment = async (contributionId) => {
    try {
      const response = await axios.post('https://localhost:7021/api/Commentions/AddComment', {
        contributionId: contributionId,
        userId: userId,
        contents: newComment,
      });
      setComments({
        ...comments,
        [contributionId]: [...(comments[contributionId] || []), response.data],
      });
      setNewComment('');
      const updatedData = data.map((item) =>
        item.contributionId === contributionId
          ? { ...item, commentCount: (item.commentCount || 0) + 1 }
          : item
      );
      setData(updatedData);
      message.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('Failed to add comment');
    }
  };

  // Function to handle approve
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
        item.contributionId === contributionId ? { ...item, approval: true, status: 'Approved' } : item
      );
      setData(updatedData);
      message.success('Approved successfully');
    } catch (error) {
      console.error('Error approving:', error);
      message.error('Failed to approve');
    }
  };

  // Function to handle resit
  const handleResit = async (contributionId) => {
    try {
      await axios.delete(`https://localhost:7021/api/Contributions/ResitArticles/${contributionId}`);
      const updatedData = data.filter((item) => item.contributionId !== contributionId);
      setData(updatedData);
      message.success('Resit successfully');
    } catch (error) {
      console.error('Error rejecting:', error);
      message.error('Failed to resit');
    }
  };

  // Function to handle reject
  const handleReject = async (contributionId) => {
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
        item.contributionId === contributionId ? { ...item, approval: false, status: 'Rejected' } : item
      );
      setData(updatedData);
      message.success('Reject successfully');
    } catch (error) {
      console.error('Error resetting:', error);
      message.error('Failed to reject');
    }
  };

  // Function to filter data
  const filteredData = data.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(searchTitle.toLowerCase());
    if (filterStatus === 'Pending') {
      return item.status === 'Pending' && titleMatch;
    }
    if (filterStatus === 'Accepted') {
      return item.status === 'Accepted' && titleMatch;
    }
    if (filterStatus === 'Rejected') {
      return item.status === 'Rejected' && titleMatch;
    }
    return titleMatch;
  });

  return (
    <div>
      {isAuthorized(3) ? (
        <>
          <Select value={filterStatus} onChange={(value) => setFilterStatus(value)} style={{ width: 120, marginBottom: '10px' }}>
            <Option value="Show All">Show All</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Accepted">Accepted</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
          <Input.Search
            placeholder="Search by title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            style={{ width: 200, marginBottom: '10px' }}
          />
          {filteredData.map((contribution) => (
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
                        <td className='td'><Button style={{ padding: 0 }} size="large" type="link" onClick={() => handleDownload(contribution.contributionId)}>Download</Button></td>
                      </tr>
                      <tr className='tr'>
                        <th className='th'>Approval</th>
                        <td className='td'>
                          {contribution?.status !== 'Pending' ? (
                            <>
                              <Button danger onClick={() => handleResit(contribution.contributionId)}>Resit</Button>
                            </>
                          ) : (
                            <>
                              <Button type="primary" danger style={{ background: '#66FF00', marginRight: '8px' }} onClick={() => handleApprove(contribution.contributionId)}>Accept</Button>
                              <Button type="primary" danger onClick={() => handleReject(contribution.contributionId)}>Reject</Button>
                            </>
                          )}
                        </td>
                      </tr>
                      <tr className='tr'>
                        <th className='th'>Comments</th>
                        <td className='td' style={{ maxHeight: '320px', overflowY: 'scroll', display: 'block' }}>
                          <div key={contribution.contributionId} className="comments-container">
                            {comments[contribution.contributionId]?.map((comment, index) => (
                              <div key={index} className="comment">
                                <Avatar style={{ marginRight: 8 }} src={comment.avatarLink} />
                                <span style={{ marginRight: 8 }} className="username">{comment.userName}</span>
                                <span className="comment-time">{comment.commentTimeText}:</span>
                                <div style={{ marginLeft: 39 }} className="content">{comment.content}</div>
                              </div>
                            ))}
                          </div>
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
