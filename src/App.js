import './App.css';
import Loginform from './Components/loginform';
import RegisterForm from './Components/registerform';
import Homepage from './Components/homepage';
import Studentpage from './Components/studentpage'
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import SideBar from './Components/sideBarStudent';
import SideBarMC from './Components/sideBarMC';
import UnAuthorized from './Components/unAuthorized';
import SideBarMM from './Components/managerSidebar';
import SideBarAdmin from './Components/sideBarAdmin';
import SideBarProfile from './Components/sideBarProfile';
function App() {

  return (
    <Router>
      <Routes>
          <Route path="/" element={<Loginform />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/homepage" element = {<Homepage />}/>
          <Route path="/SideBarMC" element = {<SideBarMC />}/>
          <Route path="/studentpage" element = {<Studentpage />}/>
          <Route path="/sidebarStudent" element = {<SideBar/>}/>
          <Route path="/unAuthorized" element = {<UnAuthorized/>}/>
          <Route path="/SideBarMM" element = {<SideBarMM/>}/>
          <Route path="/SideBarAdmin" element = {<SideBarAdmin/>}/>
          <Route path="/SideBarProfile" element = {<SideBarProfile/>}/>
      </Routes>
    </Router>
  );
}

export default App; 