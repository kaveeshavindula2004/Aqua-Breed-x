import React from 'react';
import { Fish } from '../App';
import { ParentFishIcon } from './Icons';

interface FishCardProps {
  fish: Fish;
  onClick: () => void;
}

const getStatusBadge = (status: Fish['status']): React.ReactNode => {
    switch (status) {
        case 'Sold':
            return <span className="absolute top-1 right-1 text-xs bg-blue-500 text-white font-semibold px-1.5 py-0.5 rounded-full">Sold</span>;
        case 'Dead':
            return <span className="absolute top-1 right-1 text-xs bg-gray-600 text-white font-semibold px-1.5 py-0.5 rounded-full">Dead</span>;
        default:
            return null;
    }
}

const FishCard: React.FC<FishCardProps> = ({ fish, onClick }) => {
  return (
    <button onClick={onClick} className="bg-white dark:bg-slate-800/50 p-2 rounded-xl flex flex-col h-full text-left relative transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/80">
      <div className="aspect-square w-full bg-gray-200 dark:bg-slate-700 rounded-lg mb-2 overflow-hidden">
        {fish.photo ? (
            <img src={fish.photo} alt={fish.nickname || fish.id} className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full flex items-center justify-center">
                <ParentFishIcon className="w-1/2 h-1/2 text-gray-400 dark:text-gray-500" />
            </div>
        )}
      </div>
      <div className="px-1">
        <p className="font-bold truncate text-sm">{fish.nickname || fish.id}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{fish.nickname ? fish.id : ' '}</p>
      </div>
      {getStatusBadge(fish.status)}
    </button>
  );
};

export default FishCard;