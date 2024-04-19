import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from '../components/Welcome';
import Login from '../components/Login';
import Signup from '../components/Signup';
import MainScreen from '../components/MainScreen';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<MainScreen />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
