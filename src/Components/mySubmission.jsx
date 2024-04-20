import { message, Card, } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { DownloadOutlined, EditOutlined, UnorderedListOutlined } from '@ant-design/icons';
import ContributionModal from './ContributionModal';
import EditModal from './Editmodal';
const { Meta } = Card;

const MySubmission = () => {

  const { userName, userId } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [selectedEditContribution, setSelectedEditContribution] = useState(null);
  const [contributions, setContributions] = useState([]);

  const handleEdit = async ({ title, files, images }) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      files.forEach((file) => {
        formData.append('files', file);
      });
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.put(
        `https://localhost:7021/api/Contributions/Edit/${selectedEditContribution.contributionId}`,
        formData
      );

      // Sau khi gọi API thành công, cập nhật UI
      const updatedData = {
        contributionId: selectedEditContribution.contributionId,
        userId: selectedEditContribution.userId,
        status: selectedEditContribution.status,
        facultyName: selectedEditContribution.facultyName,
        title: response.data.title,
        filePaths: response.data.filePaths,
        imagePaths: response.data.imagePaths,
        commentions: selectedEditContribution.commentions
      };

      setSelectedEditContribution(updatedData);

      const updatedContributions = contributions.map((contribution) =>
        contribution.contributionId === selectedEditContribution.contributionId
          ? updatedData
          : contribution
      );

      setContributions(updatedContributions);

      message.success('Update successful');
    } catch (error) {
      message.error('Invalid input');
    }
  };

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

  const handleSaveComment = async (comment) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const commentData = {
        commentions: comment,
        userName: userName,
      };

      await axios.put(
        `https://localhost:7021/api/Contributions/Comment/${selectedContribution.contributionId}`,
        commentData,
        config
      );

      // Update comments locally
      const updatedContribution = {
        ...selectedContribution,
        commentions: [...selectedContribution.commentions, `${userName} commented: ${comment}`],
      };

      setSelectedContribution(updatedContribution);

      // Update contributions list with the updated contribution
      const updatedContributions = contributions.map((contribution) =>
        contribution.contributionId === selectedContribution.contributionId
          ? updatedContribution
          : contribution
      );

      setContributions(updatedContributions);


      message.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('Failed to add comment');
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7021/api/Contributions/${userId}`);
        const myContributions = response.data;
        setContributions(myContributions);
      } catch (error) {
        console.error('Error fetching contributions:', error);
      }
    };

    fetchData();
  }, [userId]);

  const showModal = (contribution) => {
    setSelectedContribution(contribution);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditModalVisible(false)

  };
  const showEditModal = (contribution) => {
    setSelectedEditContribution(contribution);
    setIsEditModalVisible(true)
  }

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {contributions.map((contribution, index) => (
          <Card
            key={index}
            style={{ width: 300, margin: 10 }}
            cover={
              <img
                alt={contribution.title}
                src={'https://th.bing.com/th/id/OIP.1EjjKwF1EODXnXekeJD8iwHaCq?w=325&h=125&c=7&r=0&o=5&pid=1.7'}
              />
            }
            actions={[
              <DownloadOutlined
                style={{ fontSize: 15 }}
                onClick={() => handleDownload(contribution.contributionId)}
              />,
              <UnorderedListOutlined
                key="edit"
                onClick={() => showModal(contribution)}
              />,
              <EditOutlined
                onClick={() => showEditModal(contribution)}
              />,
            ]}
          >
            <Meta
              title={contribution.title}
              description={`Faculty: ${contribution.facultyName}`}
            />
          </Card>
        ))}
      </div>
      <ContributionModal
        contribution={selectedContribution}
        visible={isModalVisible}
        onCancel={handleCancel}
        onSaveComment={handleSaveComment}
      />
      <EditModal
        visible={isEditModalVisible}
        onCancel={handleCancel}
        onSave={handleEdit}
        contribution={selectedEditContribution}
      />
    </>
  );
}

export default MySubmission;
