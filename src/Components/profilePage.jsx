import { useEffect, useState } from 'react';
import axios from 'axios';
import './profilePage.css';
import { useAuth } from './AuthContext';

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [userImage, setUserImage] = useState('');
  const { userId } = useAuth();

  useEffect(() => {
    axios.get(`https://localhost:7021/api/Users/ViewUserDetail/${userId}`)
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

    axios.get(`https://localhost:7021/api/Users/Uploads/${userId}`, { responseType: 'blob' })
      .then(response => {
        setUserImage(URL.createObjectURL(response.data));
      })
      .catch(error => {
        console.error('Error fetching user image:', error);
      });
  }, [userId]);

  return (
    <div className="page-content page-container" id="page-content">
      <div className="padding">
        <div className="row container d-flex justify-content-center">
          <div className="col-xl-6 col-md-12">
            <div className="card user-card-full">
              <div className="row m-l-0 m-r-0">
                <div style={{ textAlign:'center' }} className="col-sm-4 bg-c-lite-green user-profile">
                  <div className="card-block text-center text-white">
                    <div className="m-b-25">
                      <img src={userImage || 'https://img.icons8.com/bubbles/100/000000/user.png'} className="img-radius" alt="User-Profile"/>
                    </div>
                    <h6 className="f-w-600">{userData.username}</h6>
                    <p>{userData.role}</p>
                    <i className="mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="card-block">
                    <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
                    <div className="row">
                      <div className="col-sm-6">
                        <p className="m-b-10 f-w-600">Email</p>
                        <h6 className="text-muted f-w-400">{userData.email}</h6>
                      </div>
                      <div className="col-sm-6">
                        <p className="m-b-10 f-w-600">Falcuty</p>
                        <h6 className="text-muted f-w-400">{userData.faculty}</h6>
                      </div>
                    </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
