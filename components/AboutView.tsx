import React from 'react';
import { LogoIcon } from './Icons';

const AboutView: React.FC = () => {
  return (
    <div className="animate-fade-in h-full p-2">
      <h1 className="text-2xl font-bold mb-6">About the App</h1>

      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 flex flex-col items-center text-center">
        <div className="w-32 h-32 rounded-full bg-white border-4 border-slate-200 dark:border-slate-600 mb-4 flex items-center justify-center p-3">
            {/* Using the app logo as the developer photo */}
            <LogoIcon />
        </div>
        <h2 className="text-2xl font-bold">Kaveesha Vindula</h2>
        <p className="text-md text-sky-500 dark:text-sky-400">Developer</p>

        <div className="border-t border-gray-200 dark:border-slate-700 w-full my-6"></div>

        <div className="space-y-3 text-left self-stretch">
            <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Contact</h3>
                <a href="tel:+94702100334" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">+94 70 210 0334</a>
            </div>
             <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Email</h3>
                <a href="mailto:kaveeshavindula2004@gmail.com" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">kaveeshavindula2004@gmail.com</a>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AboutView;