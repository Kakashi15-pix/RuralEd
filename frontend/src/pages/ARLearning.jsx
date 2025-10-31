import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Box, Camera, QrCode } from 'lucide-react';
import { Button } from '../components/ui/button';

const ARLearning = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Button data-testid="back-btn" variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gray-800">AR Learning</h1>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Box className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">AR Learning</h2>
                <p className="text-orange-100">Interactive augmented reality experiences</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">How to Use AR</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Camera className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Step 1: Enable Camera</h4>
                  <p className="text-gray-600">Allow camera access to view AR content</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Step 2: Scan QR Code</h4>
                  <p className="text-gray-600">Point your camera at AR markers in textbooks</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Box className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Step 3: Interact</h4>
                  <p className="text-gray-600">Rotate and explore 3D models in your environment</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 border-2 border-orange-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">AR Coming Soon!</h3>
            <p className="text-gray-700 mb-6">
              Our AR features are currently in development. Soon you'll be able to:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                View 3D models on any flat surface
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                Scan textbook pages for interactive content
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                Practice experiments in augmented reality
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ARLearning;
