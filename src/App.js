import './App.css';
import Loginform from './Components/loginform';
import RegisterForm from './Components/registerform';
import Homepage from './Components/homepage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes> 
          <Route path="/" element={<Loginform />} />
          <Route path="/login" element={<Loginform />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/homepage" element={<Homepage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;