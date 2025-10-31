import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Trophy, Play, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QuizPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/quiz/generate`,
        { topic, num_questions: 5 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuiz(response.data);
      setAnswers(new Array(response.data.questions.length).fill(null));
      setResult(null);
      toast.success('Quiz generated!');
    } catch (error) {
      toast.error('Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (answers.some(a => a === null)) {
      toast.error('Please answer all questions');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/quiz/submit`,
        { quiz_id: quiz.quiz_id, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data);
      toast.success(`Quiz completed! You earned ${response.data.xp_gained} XP`);
    } catch (error) {
      toast.error('Failed to submit quiz');
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
          <h1 className="text-xl font-bold text-gray-800">Quiz Center</h1>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Trophy className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Quiz Center</h2>
                <p className="text-yellow-100">Test your knowledge and earn XP</p>
              </div>
            </div>
          </div>

          {/* Quiz Generator */}
          {!quiz && !result && (
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Quiz</h3>
              <div className="space-y-4">
                <Input
                  data-testid="quiz-topic-input"
                  type="text"
                  placeholder="Enter topic (e.g., Mathematics, Science)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full py-6 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && generateQuiz()}
                />
                <Button
                  data-testid="create-quiz-btn"
                  onClick={generateQuiz}
                  disabled={loading}
                  className="w-full py-6 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-lg"
                >
                  {loading ? 'Generating...' : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Create Quiz
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Quiz Questions */}
          {quiz && !result && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz: {topic}</h3>
                <p className="text-gray-600 mb-6">{quiz.questions.length} Questions</p>

                {quiz.questions.map((q, qIndex) => (
                  <div key={qIndex} data-testid={`question-${qIndex}`} className="mb-8 pb-8 border-b last:border-b-0">
                    <p className="text-lg font-semibold text-gray-800 mb-4">
                      {qIndex + 1}. {q.question}
                    </p>
                    <div className="space-y-3">
                      {q.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          data-testid={`option-${qIndex}-${oIndex}`}
                          onClick={() => {
                            const newAnswers = [...answers];
                            newAnswers[qIndex] = oIndex;
                            setAnswers(newAnswers);
                          }}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            answers[qIndex] === oIndex
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                data-testid="submit-quiz-btn"
                onClick={submitQuiz}
                disabled={loading}
                className="w-full py-6 bg-gradient-to-r from-green-600 to-teal-600 text-white text-lg"
              >
                {loading ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            </div>
          )}

          {/* Results */}
          {result && (
            <div data-testid="quiz-result" className="bg-white rounded-3xl p-8 shadow-lg text-center">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">{result.score}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">{result.percentage}%</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <div className="text-3xl font-bold text-yellow-600">{result.xp_gained}</div>
                  <div className="text-sm text-gray-600">XP Earned</div>
                </div>
              </div>
              <Button
                data-testid="new-quiz-btn"
                onClick={() => {
                  setQuiz(null);
                  setResult(null);
                  setTopic('');
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4"
              >
                Take Another Quiz
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
