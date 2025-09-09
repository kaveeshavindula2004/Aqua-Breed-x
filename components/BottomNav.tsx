import React from 'react';
import { HomeIcon, CalendarIcon, TotalParentFishIcon, SettingsIcon } from './Icons';
import { View } from '../App';

interface BottomNavProps {
  activeTab: View;
  setActiveTab: (tab: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {

  const navItems = [
    { id: 'dashboard', icon: HomeIcon, label: 'Home' },
    { id: 'breeding', icon: CalendarIcon, label: 'Breeding' },
    { id: 'fishStock', icon: TotalParentFishIcon, label: 'Fish Stock' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-10 flex justify-center">
      <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl h-16 flex items-center justify-around shadow-lg w-full max-w-md">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as View)}
            aria-label={item.label}
            className={`p-2 rounded-full transition-colors duration-300 ${
              activeTab === item.id || (activeTab !== 'breeding' && activeTab !== 'fishStock' && activeTab !== 'settings' && item.id === 'dashboard')
                ? 'text-blue-600'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <item.icon className="w-7 h-7" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;