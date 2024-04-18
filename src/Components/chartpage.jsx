import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const Chartpage = () => {
  const { isAuthorized } = useAuth();
  const [data, setData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7021/api/Statistics/PercentageOfContributionsByFaculty');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      chartRef.current.chartInstance?.destroy();
    }
  }, [data]);

  const chartData = {
    labels: data.map(item => item.facultyName),
    datasets: [
      {
        label: 'Percentage',
        data: data.map(item => parseFloat(item.percentage).toFixed(2)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };


  return (
    <div>
      {isAuthorized(4) ? (
        <>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2>Percentage of Contributions by Faculty</h2>
            <Pie ref={chartRef} data={chartData}/>
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

export default Chartpage;
