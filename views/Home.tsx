import React from 'react';
import { Icons } from '../components/Icons';
import { ViewState } from '../types';
import { Button } from '../components/Button';
import Logo from '../components/Logo.png';
import Hero from '../components/Hero.png';
import Hero2 from '../components/Hero2.png';

interface HomeProps {
  setView: (view: ViewState) => void;
}

export const Home: React.FC<HomeProps> = ({ setView }) => {
  const features = [
    {
      icon: <Icons.Sparkles className="text-purple-400" size={24} />,
      title: 'AI Power Boost',
      description: 'Go beyond your text. Our AI infers industry-standard skills and achievements to create a "perfect 10/10" candidate profile.',
    },
    {
      icon: <Icons.Shield className="text-blue-400" size={24} />,
      title: 'Strict Mode',
      description: 'Maintain 100% factual accuracy. The AI optimizes grammar, structure, and phrasing based only on the information you provide.',
    },
    {
      icon: <Icons.Zap className="text-teal-400" size={24} />,
      title: 'Tailor to Any Job',
      description: 'Customize your resume for specific job descriptions. Our AI will align your skills with what recruiters are looking for.',
    },
    {
      icon: <Icons.Download className="text-fuchsia-400" size={24} />,
      title: 'Download as PDF',
      description: 'Generate a professional, clean PDF of your new resume, ready to be sent out for applications.',
    },
  ];

  return (
    <div 
      className="w-full bg-cover bg-center bg-fixed text-white" 
      style={{ backgroundImage: `url(${Hero})` }}
    >
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-10">
        <img src={Logo} alt="Resume Blaster Logo" className="w-40 md:w-48" />
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => console.log('About clicked')} // Placeholder
            className="text-white text-sm md:text-base font-semibold hover:text-blue-200 transition-colors hidden md:block"
          >
            About
          </button>
          <button 
            onClick={() => console.log('Contact clicked')} // Placeholder
            className="text-white text-sm md:text-base font-semibold hover:text-blue-200 transition-colors hidden md:block"
          >
            Contact
          </button>
          <Button 
            size="sm" 
            onClick={() => setView(ViewState.AUTH)}
            className="bg-blue-600 hover:bg-blue-700 !text-white text-sm font-semibold shadow-md transition-all duration-300"
          >
            Login
          </Button>
        </div>
      </nav>

      <div className="min-h-screen w-full bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 pt-32">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 my-16 md:my-24">
          <img src={Hero2} alt="Resume Blaster Hero" className="w-96 md:w-[500px] mx-auto drop-shadow-[0_0_30px_rgba(120,81,255,0.5)]" />
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Build Your 10/10 Resume in Seconds
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Transform your raw notes or existing resume into a polished, ATS-optimized document that gets you hired.
          </p>
          <Button 
            size="lg" 
            onClick={() => setView(ViewState.EDITOR)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 !text-white text-lg font-bold shadow-2xl shadow-purple-500/30 transform hover:scale-105 transition-all duration-300"
          >
            Start Building for Free
            <Icons.Back className="w-5 h-5 ml-2 -rotate-180" />
          </Button>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-6xl mx-auto pb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful AI Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-col items-start space-y-3 transition-all duration-300 hover:bg-white/10 hover:border-white/20 transform hover:-translate-y-2"
              >
                <div className="p-3 bg-slate-900/50 rounded-full mb-2 border border-white/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};