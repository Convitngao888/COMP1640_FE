import './App.css';
import Loginform from './Components/loginform';
import RegisterForm from './Components/registerform';
import Homepage from './Components/homepage';
import Adminpage from './Components/adminpage';
import Studentpage from './Components/studentpage'
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
          <Route path="/" element={<Loginform />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/homepage" element = {<Homepage />}/>
          <Route path="/adminpage" element = {<Adminpage />}/>
          <Route path="/studentpage" element = {<Studentpage />}/>
      </Routes>
    </Router>
  );
}

export default App; 