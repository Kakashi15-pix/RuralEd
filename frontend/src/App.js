import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@/App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ModuleViewer from './pages/ModuleViewer';
import QuizPage from './pages/QuizPage';
import AITutor from './pages/AITutor';
import VRLab from './pages/VRLab';
import ARLearning from './pages/ARLearning';
import LandingPage from './pages/LandingPage';
import { Toaster } from 'sonner';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup onLogin={handleLogin} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/modules/:moduleId" element={user ? <ModuleViewer user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/quiz" element={user ? <QuizPage user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/ai-tutor" element={user ? <AITutor user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/vr-lab" element={user ? <VRLab user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/ar-learning" element={user ? <ARLearning user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
