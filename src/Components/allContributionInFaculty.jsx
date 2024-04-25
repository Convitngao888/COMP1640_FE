import React, { useEffect, useState } from 'react';
import { Card, Popover, Button } from 'antd';
import axios from 'axios';


import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const { Meta } = Card;

const AllContributionInFaculty = () => {

  const { facultyName, isAuthorized } = useAuth();
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7021/api/Contributions/accepted/faculty/${facultyName}`);
        const myContributions = response.data;
        setContributions(myContributions);
      } catch (error) {
        console.error('Error fetching contributions:', error);
      }
    };

    fetchData();
  }, [facultyName]);

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

              >
                <Meta
                  title={contribution.title}
                  description={`Faculty: ${contribution.facultyName}`}
                />
                <Popover overlayStyle={{ maxWidth: '440px' }} placement="bottom" title={'Description'} content={contribution.description}>
                  <Button style={{ padding: 0 }} type="link">View Description</Button>
                </Popover>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div>
          <Navigate to="/unAuthorized" />
        </div>
      )}

    </>
  );
}

export default AllContributionInFaculty;
