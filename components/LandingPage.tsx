import React from 'react';
import { LogoIcon, BreedingIcon, ParentFishIcon, CertificateIcon, HeartbeatIcon } from './Icons';

interface LandingPageProps {
  onEnter: () => void;
}

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-slate-800/50 p-6 rounded-xl text-center flex flex-col items-center h-full">
    <div className="bg-sky-500/20 p-3 rounded-full mb-4 flex-shrink-0">
        {icon}
    </div>
    <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-[#0B172E] text-white font-sans flex flex-col animate-fade-in">
      <main className="flex-grow flex flex-col justify-center items-center p-4 text-center">
        <div className="w-24 h-24 mb-4">
          <LogoIcon />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Welcome to <span className="text-sky-400">Aqua Breed</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-300">
          Your digital companion for managing fish breeding projects. Track parent stock, monitor breeding cycles, and maintain detailed records with ease.
        </p>
        <button 
          onClick={onEnter} 
          className="mt-8 px-8 py-3 bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-transform active:scale-95 hover:shadow-sky-400/30"
        >
          Launch App
        </button>
      </main>

      <section className="py-16 px-4 bg-slate-900/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Powerful Features, Simple Interface</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Feature 
              icon={<BreedingIcon className="w-8 h-8 text-sky-400" />}
              title="Breeding Management"
              description="Log pairing dates, track egg laying, and monitor fry development from start to finish."
            />
            <Feature 
              icon={<ParentFishIcon className="w-8 h-8 text-sky-400" />}
              title="Stock Tracking"
              description="Keep a detailed inventory of your parent stock, fry, and juveniles, including photos and genealogy."
            />
            <Feature 
              icon={<HeartbeatIcon className="w-8 h-8 text-sky-400" />}
              title="Health Records"
              description="Record observations and treatments to maintain a comprehensive health history for every fish."
            />
            <Feature 
              icon={<CertificateIcon className="w-8 h-8 text-sky-400" />}
              title="Certificates of Origin"
              description="Generate professional certificates for sold fish, complete with parentage and breeder details."
            />
          </div>
        </div>
      </section>

      <footer className="text-center p-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Aqua Breed. All Rights Reserved.
      </footer>
    </div>
  );
};

export default LandingPage;