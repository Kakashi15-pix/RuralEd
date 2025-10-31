import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Brain, Microscope, Box, Trophy, BarChart3, LogOut, User, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import ChatBot from '../components/ChatBot';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/modules/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModules(response.data.modules.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    }
  };

  const dashboardCards = [
    {
      title: 'Learning Modules',
      description: 'NCERT-aligned content with 3D models',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-600',
      path: '/modules/sci-solar'
    },
    {
      title: 'AI Tutor',
      description: 'Personalized multilingual lessons',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-600',
      path: '/ai-tutor'
    },
    {
      title: 'VR Lab',
      description: 'Explore 3D models and experiments',
      icon: <Microscope className="w-8 h-8" />,
      color: 'from-green-500 to-teal-600',
      path: '/vr-lab'
    },
    {
      title: 'AR Learning',
      description: 'Interactive augmented reality demos',
      icon: <Box className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      path: '/ar-learning'
    },
    {
      title: 'Quiz Center',
      description: 'Test your knowledge with AI quizzes',
      icon: <Trophy className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-600',
      path: '/quiz'
    },
    {
      title: 'Progress & Analytics',
      description: 'Track your learning journey',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-600',
      path: '/profile'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">RuralEd+</h1>
                <p className="text-xs text-gray-600">Welcome, {user.name}!</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full">
                <Trophy className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-indigo-700">{user.xp || 0} XP</span>
              </div>
              <Button data-testid="profile-btn" variant="ghost" onClick={() => navigate('/profile')} className="gap-2">
                <User className="w-5 h-5" />
                Profile
              </Button>
              <Button data-testid="logout-btn" variant="outline" onClick={onLogout} className="gap-2">
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              data-testid="mobile-menu-btn"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              <Button data-testid="mobile-profile-btn" variant="ghost" onClick={() => navigate('/profile')} className="w-full justify-start gap-2">
                <User className="w-5 h-5" />
                Profile ({user.xp || 0} XP)
              </Button>
              <Button data-testid="mobile-logout-btn" variant="outline" onClick={onLogout} className="w-full justify-start gap-2">
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 mb-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Welcome to RuralEd+</h2>
            <p className="text-lg text-indigo-100 mb-6">Empowering rural education through AI, VR, and personalized learning insights</p>
            <div className="flex gap-4 flex-wrap">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <div className="text-2xl font-bold">{user.level || 1}</div>
                <div className="text-sm text-indigo-100">Level</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <div className="text-2xl font-bold">{user.badges?.length || 0}</div>
                <div className="text-sm text-indigo-100">Badges</div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 right-20 w-48 h-48 bg-white/10 rounded-full -mb-24"></div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              data-testid={`dashboard-card-${index}`}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-2xl p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white mb-4`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Learning Modules Preview */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Popular Learning Modules</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                data-testid={`module-${module.id}`}
                onClick={() => navigate(`/modules/${module.id}`)}
                className="border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-indigo-500 hover:shadow-lg transition-all"
              >
                <div className="text-sm font-semibold text-indigo-600 mb-2">{module.subject}</div>
                <h4 className="font-bold text-gray-800 mb-2">{module.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                <div className="flex gap-2 text-xs">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{module.difficulty}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{module.estimatedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* AI Chatbot */}
      <ChatBot user={user} />
    </div>
  );
};

export default Dashboard;
