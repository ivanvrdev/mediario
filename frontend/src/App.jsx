import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import RequestDemo from './pages/RequestDemo';
import Login from './pages/Login';
import Chat from './pages/Chat';
import PatientFiles from './pages/PatientFiles';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/request-demo" element={<RequestDemo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:patientId" element={<Chat />} />
        <Route path="/patient/:patientId/files" element={<PatientFiles />} />
      </Routes>
    </Router>
  );
}

export default App;
