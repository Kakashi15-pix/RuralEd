import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User as UserIcon, Trophy, TrendingUp, Target, AlertCircle, CheckCircle, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Profile = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/progress/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-indigo-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Button data-testid="back-btn" variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
          <Button data-testid="logout-btn" variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* User Info Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 mb-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <UserIcon className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
              <p className="text-indigo-100 mb-4">{user.email}</p>
              <div className="flex gap-4">
                <div className="bg-white/20 px-4 py-2 rounded-xl">
                  <div className="text-2xl font-bold">{user.level || 1}</div>
                  <div className="text-sm text-indigo-100">Level</div>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-xl">
                  <div className="text-2xl font-bold">{user.xp || 0}</div>
                  <div className="text-sm text-indigo-100">Total XP</div>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-xl">
                  <div className="text-2xl font-bold">{user.badges?.length || 0}</div>
                  <div className="text-sm text-indigo-100">Badges</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-10 h-10 text-yellow-500" />
              <span className="text-3xl font-bold text-gray-800">{stats?.total_completed || 0}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Completed Modules</h3>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-green-500" />
              <span className="text-3xl font-bold text-gray-800">{stats?.average_score || 0}%</span>
            </div>
            <h3 className="text-gray-600 font-medium">Average Score</h3>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-10 h-10 text-purple-500" />
              <span className="text-3xl font-bold text-gray-800">{Object.keys(stats?.subject_scores || {}).length}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Subjects Studied</h3>
          </div>
        </div>

        {/* SWOC Analysis */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">SWOC Analysis</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h4 className="text-xl font-bold text-green-800">Strengths</h4>
              </div>
              {stats?.strengths?.length > 0 ? (
                <ul className="space-y-2">
                  {stats.strengths.map((item, i) => (
                    <li key={i} className="text-green-700 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-600">Complete more modules to discover your strengths</p>
              )}
            </div>

            <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <h4 className="text-xl font-bold text-red-800">Weaknesses</h4>
              </div>
              {stats?.weaknesses?.length > 0 ? (
                <ul className="space-y-2">
                  {stats.weaknesses.map((item, i) => (
                    <li key={i} className="text-red-700 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-600">Great! No weak areas identified yet</p>
              )}
            </div>

            <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-blue-600" />
                <h4 className="text-xl font-bold text-blue-800">Opportunities</h4>
              </div>
              <p className="text-blue-700">Focus on improving your weak areas to boost overall performance</p>
            </div>

            <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-purple-600" />
                <h4 className="text-xl font-bold text-purple-800">Challenges</h4>
              </div>
              <p className="text-purple-700">Practice more quizzes and review difficult concepts</p>
            </div>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        {stats?.weekly_progress?.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Weekly Performance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.weekly_progress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#667eea" strokeWidth={3} name="Score %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Subject Performance */}
        {stats?.subject_scores && Object.keys(stats.subject_scores).length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Subject-wise Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(stats.subject_scores).map(([subject, score]) => ({ subject, score }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#667eea" name="Average Score %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
