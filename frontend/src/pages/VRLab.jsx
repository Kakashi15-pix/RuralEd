import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Microscope } from 'lucide-react';
import { Button } from '../components/ui/button';

const VRLab = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const vrModels = [
    {
      title: 'Solar System',
      description: 'Explore planets and their orbits',
      embed: 'https://solarsystem.nasa.gov/gltf_embed/2392'
    },
    {
      title: 'Human Heart',
      description: '3D anatomy of the heart',
      embed: 'https://sketchfab.com/models/e4c42915612b40aa870c88b83f8e18a6/embed'
    },
    {
      title: 'Plant Cell',
      description: 'Detailed plant cell structure',
      embed: 'https://sketchfab.com/models/fa1d90a4c5274c1fa0cff27cbdd46f85/embed'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Button data-testid="back-btn" variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gray-800">VR Lab</h1>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Microscope className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">VR Laboratory</h2>
                <p className="text-green-100">Explore 3D models and interactive experiments</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {vrModels.map((model, index) => (
              <div key={index} data-testid={`vr-model-${index}`} className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{model.title}</h3>
                <p className="text-gray-600 mb-6">{model.description}</p>
                <div className="bg-gray-100 rounded-xl overflow-hidden">
                  <iframe
                    src={model.embed}
                    width="100%"
                    height="480px"
                    frameBorder="0"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    title={model.title}
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VRLab;
