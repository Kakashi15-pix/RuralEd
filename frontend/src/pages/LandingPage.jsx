import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Zap, Globe, Award, Users } from 'lucide-react';
import { Button } from '../components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">RuralEd+</span>
          </div>
          <div className="flex gap-4">
            <Button data-testid="login-btn" variant="ghost" onClick={() => navigate('/login')} className="text-gray-700 hover:text-indigo-600">
              Login
            </Button>
            <Button data-testid="signup-btn" onClick={() => navigate('/signup')} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm">
            Empowering Rural Education
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Learn Smarter
            </span>
            <br />
            <span className="text-gray-800">With AI-Powered Education</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Experience personalized learning with multilingual AI tutors, interactive VR labs, AR demonstrations, and gamified progress tracking - all designed for rural students.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button data-testid="get-started-hero-btn" onClick={() => navigate('/signup')} size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 text-lg hover:shadow-xl">
              Start Learning Free
            </Button>
            <Button data-testid="explore-features-btn" variant="outline" size="lg" className="border-2 border-indigo-600 text-indigo-600 px-8 py-6 text-lg hover:bg-indigo-50">
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-gray-800">Why Choose RuralEd+?</h2>
          <p className="text-center text-gray-600 mb-16 text-lg max-w-2xl mx-auto">
            Comprehensive learning tools designed specifically for students in rural areas with limited resources
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="w-12 h-12" />}
              title="AI Tutor"
              description="Get personalized lessons in your language. Our AI adapts to your learning style and explains concepts multiple ways."
              color="from-indigo-500 to-purple-500"
            />
            <FeatureCard 
              icon={<Zap className="w-12 h-12" />}
              title="VR & AR Labs"
              description="Explore 3D models of solar systems, circuits, and more. Learn by doing with immersive experiences."
              color="from-purple-500 to-pink-500"
            />
            <FeatureCard 
              icon={<Globe className="w-12 h-12" />}
              title="Offline First"
              description="Download content for offline access. Learn anytime, anywhere without internet connectivity."
              color="from-pink-500 to-rose-500"
            />
            <FeatureCard 
              icon={<BookOpen className="w-12 h-12" />}
              title="NCERT Content"
              description="Curriculum-aligned study materials with diagrams, notes, and interactive exercises."
              color="from-blue-500 to-indigo-500"
            />
            <FeatureCard 
              icon={<Award className="w-12 h-12" />}
              title="Gamification"
              description="Earn XP, badges, and level up as you learn. Track your progress with detailed analytics."
              color="from-green-500 to-teal-500"
            />
            <FeatureCard 
              icon={<Users className="w-12 h-12" />}
              title="Multilingual"
              description="Learn in English, Hindi, Tamil, and more. Our AI speaks your language fluently."
              color="from-orange-500 to-red-500"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-indigo-200 text-lg">Active Students</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-indigo-200 text-lg">Learning Modules</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-indigo-200 text-lg">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of students already learning smarter with RuralEd+
          </p>
          <Button data-testid="cta-signup-btn" onClick={() => navigate('/signup')} size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-6 text-lg hover:shadow-xl">
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">RuralEd+</span>
          </div>
          <p className="text-gray-400 mb-4">Empowering rural education through AI, VR, and personalized learning</p>
          <p className="text-gray-500 text-sm">© 2025 RuralEd+. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }) => {
  return (
    <div className="group p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default LandingPage;
