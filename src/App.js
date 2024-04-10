import './App.css';
import Loginform from './Components/loginform';
import RegisterForm from './Components/registerform';
import Homepage from './Components/homepage';
import Studentpage from './Components/studentpage'
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import SideBar from './Components/sideBarStudent';
import SideBarMC from './Components/sideBarMC';
import UnAuthorized from './Components/unAuthorized';
import ViewFileAndImage from './Components/viewFileAndImage';
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
          <Route path="/viewfileandimage" element = {<ViewFileAndImage/>}/>
      </Routes>
    </Router>
  );
}

export default App; 