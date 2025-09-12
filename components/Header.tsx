import React from 'react';
import { MenuIcon, BellIcon, LogoIcon, BackIcon, XIcon } from './Icons';
import { View } from '../App';

interface HeaderProps {
  currentView: View;
  onBack: () => void;
  notificationCount: number;
  onBellClick: () => void;
  onMenuClick: () => void;
  isMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentView, onBack, notificationCount, onBellClick, onMenuClick, isMenuOpen }) => {
  const isDashboard = currentView === 'dashboard';

  return (
    <header className="flex-shrink-0 grid grid-cols-3 items-center p-4 text-gray-900 dark:text-white">
      <div className="flex justify-start">
        {isDashboard ? (
          <button onClick={onMenuClick} className="p-2" aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            {isMenuOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
          </button>
        ) : (
          <button onClick={onBack} className="p-2" aria-label="Go back">
            <BackIcon className="w-7 h-7" />
          </button>
        )}
      </div>
      <h1 className="text-xl font-bold text-center">Aqua Breed</h1>
      <div className="flex justify-end items-center space-x-2">
        <div className="w-10 h-10 p-1 rounded-full bg-white dark:bg-slate-800">
          <LogoIcon />
        </div>
        <div className="relative">
          <button onClick={onBellClick} className="p-2" aria-label={`View notifications (${notificationCount} new)`}>
            <BellIcon className="w-6 h-6" />
          </button>
          {notificationCount > 0 && (
            <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-[#0B172E]" aria-hidden="true"></span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;