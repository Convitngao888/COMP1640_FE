import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
import Chart from 'chart.js/auto'; 

const ChartPageMC = () => {
  const { isAuthorized, facultyName } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://localhost:7021/api/Contributions/GetContributionsByFaculty?facultyName=${facultyName}`);
        const data = await res.json();
        setContributions(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [facultyName]);

  useEffect(() => {
    if (contributions.length > 0) {
      renderChart();
    }
      // eslint-disable-next-line
  }, [contributions]);

  const renderChart = () => {
    const faculties = {};
    contributions.forEach(contribution => {
      const facultyName = contribution.facultyName;
      if (!faculties[facultyName]) {
        faculties[facultyName] = {
          pending: 0,
          rejected: 0,
          accepted: 0
        };
      }
      switch (contribution.status) {
        case 'Pending':
          faculties[facultyName].pending++;
          break;
        case 'Rejected':
          faculties[facultyName].rejected++;
          break;
        case 'Accepted':
          faculties[facultyName].accepted++;
          break;
        default:
          break;
      }
    });

    const labels = Object.keys(faculties);
    const data = Object.values(faculties);

    const ctx = document.getElementById('myChart');
    if (ctx) {
      if (chart) {
        chart.destroy();
      }
      const newChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Pending',
              data: data.map(item => item.pending),
              backgroundColor: 'rgba(255, 99, 132, 0.2)'
            },
            {
              label: 'Rejected',
              data: data.map(item => item.rejected),
              backgroundColor: 'rgba(54, 162, 235, 0.2)'
            },
            {
              label: 'Accepted',
              data: data.map(item => item.accepted),
              backgroundColor: 'rgba(75, 192, 192, 0.2)'
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
      setChart(newChart);
    }
  };

  return (
    <div>
      {isAuthorized(3) ? (
        <>
          {/* Hiển thị biểu đồ */}
          <canvas id="myChart" style={{ maxWidth: '2000px', maxHeight: '750px' }}></canvas>
        </>
      ) : (
        <div>
          <Navigate to="/unAuthorized" />
        </div>
      )}
    </div>
  );
};

export default ChartPageMC;
