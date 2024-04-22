import { message, Card, Button, Popover  } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { DownloadOutlined, EditOutlined, UnorderedListOutlined } from '@ant-design/icons';
import ContributionModal from './ContributionModal';
import EditModal from './Editmodal';
const { Meta } = Card;

const MySubmission = () => {

  const { userId, isAuthorized } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [selectedEditContribution, setSelectedEditContribution] = useState(null);
  const [contributions, setContributions] = useState([]);


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

  const handleSaveEdit = (updatedContribution) => {
    // Cập nhật danh sách contributions với contribution đã được cập nhật
    setContributions(prevContributions => prevContributions.map(contribution => {
      if (contribution.contributionId === updatedContribution.contributionId) {
        return updatedContribution;
      }
      return contribution;
    }));
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
      {isAuthorized(1) ? (
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
                <Popover overlayStyle={{ maxWidth: '440px' }} placement="bottom" title={'Description'} content={contribution.description}>
                  <Button style ={{padding: 0 }} type="link">View Description</Button>
                </Popover>
              </Card>
            ))}
          </div>
          <ContributionModal
            contribution={selectedContribution}
            visible={isModalVisible}
            onCancel={handleCancel}
          />
          <EditModal
            visible={isEditModalVisible}
            onCancel={handleCancel}
            contribution={selectedEditContribution}
            onSave={handleSaveEdit}
          />
        </>
      ) : (
        <div>
          <Navigate to="/unAuthorized" />
        </div>
      )}
      
    </>
  );
}

export default MySubmission;
