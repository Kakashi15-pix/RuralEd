import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BookOpen, Clock, BarChart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ModuleViewer = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModule(response.data);
    } catch (error) {
      toast.error('Failed to load module');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/progress/add`,
        {
          subject: module.subject,
          topic: module.title,
          score: 100,
          completed: true
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Module marked as complete! +10 XP');
    } catch (error) {
      toast.error('Failed to mark complete');
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
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Button data-testid="back-btn" variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gray-800">Learning Module</h1>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Module Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white">
            <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {module.subject}
            </div>
            <h1 className="text-4xl font-bold mb-4">{module.title}</h1>
            <p className="text-lg text-blue-100 mb-6">{module.description}</p>
            <div className="flex gap-4 flex-wrap">
              <div className="bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                <span>{module.difficulty}</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{module.estimatedTime}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Content</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>{module.content}</p>
              
              {module.id === 'sci-solar' && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">3D Solar System Model</h3>
                  <div className="bg-gray-100 rounded-xl p-8 text-center">
                    <iframe
                      src="https://solarsystem.nasa.gov/gltf_embed/2392"
                      width="100%"
                      height="450px"
                      frameBorder="0"
                      className="rounded-lg"
                      title="Solar System 3D Model"
                    ></iframe>
                    <p className="text-sm text-gray-600 mt-4">Interactive 3D model of our Solar System</p>
                  </div>
                </div>
              )}

              {module.id === 'math-fractions' && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Visual Examples</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <div className="text-4xl font-bold text-blue-600 mb-2">1/2</div>
                      <div className="w-full h-8 bg-blue-600 rounded"></div>
                      <p className="text-sm text-gray-600 mt-2">One half</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl">
                      <div className="text-4xl font-bold text-green-600 mb-2">3/4</div>
                      <div className="flex gap-1">
                        <div className="flex-1 h-8 bg-green-600 rounded"></div>
                        <div className="flex-1 h-8 bg-green-600 rounded"></div>
                        <div className="flex-1 h-8 bg-green-600 rounded"></div>
                        <div className="flex-1 h-8 bg-gray-300 rounded"></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Three quarters</p>
                    </div>
                  </div>
                </div>
              )}

              {module.id === 'sci-circuits' && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Circuit Diagram</h3>
                  <div className="bg-gray-100 rounded-xl p-8">
                    <svg width="100%" height="200" viewBox="0 0 400 200">
                      <line x1="50" y1="100" x2="150" y2="100" stroke="#333" strokeWidth="3" />
                      <circle cx="200" cy="100" r="30" fill="none" stroke="#333" strokeWidth="3" />
                      <text x="190" y="105" fontSize="20" fill="#333">⚡</text>
                      <line x1="230" y1="100" x2="350" y2="100" stroke="#333" strokeWidth="3" />
                      <rect x="140" y="80" width="20" height="40" fill="#FF6B6B" />
                      <line x1="350" y1="100" x2="350" y2="150" stroke="#333" strokeWidth="3" />
                      <line x1="350" y1="150" x2="50" y2="150" stroke="#333" strokeWidth="3" />
                      <line x1="50" y1="150" x2="50" y2="100" stroke="#333" strokeWidth="3" />
                    </svg>
                    <p className="text-sm text-gray-600 mt-4">Simple electric circuit with battery and bulb</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              data-testid="mark-complete-btn"
              onClick={markComplete}
              className="flex-1 py-6 bg-gradient-to-r from-green-600 to-teal-600 text-white text-lg"
            >
              Mark as Complete
            </Button>
            <Button
              data-testid="take-quiz-btn"
              onClick={() => navigate('/quiz')}
              className="flex-1 py-6 bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-lg"
            >
              Take Quiz
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModuleViewer;
