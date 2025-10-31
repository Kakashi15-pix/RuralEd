import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Brain, Send, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AITutor = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('English');
  const [lesson, setLesson] = useState('');
  const [loading, setLoading] = useState(false);

  const generateLesson = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/ai/tutor`,
        { topic, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLesson(response.data.lesson);
      toast.success('Lesson generated!');
    } catch (error) {
      toast.error('Failed to generate lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Button data-testid="back-btn" variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gray-800">AI Tutor</h1>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Brain className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">AI Tutor</h2>
                <p className="text-purple-100">Get personalized multilingual lessons</p>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">What would you like to learn?</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <Input
                  data-testid="topic-input"
                  type="text"
                  placeholder="e.g., Fractions, Solar System, Photosynthesis"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full py-6 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && generateLesson()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger data-testid="language-select" className="w-full py-6 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                    <SelectItem value="Telugu">Telugu</SelectItem>
                    <SelectItem value="Bengali">Bengali</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                data-testid="generate-lesson-btn"
                onClick={generateLesson}
                disabled={loading}
                className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg hover:shadow-xl"
              >
                {loading ? 'Generating...' : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Generate Lesson
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Lesson Display */}
          {lesson && (
            <div data-testid="lesson-content" className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Lesson</h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {lesson}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AITutor;
