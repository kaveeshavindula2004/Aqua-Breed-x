import React from 'react';
import { BreedingRecord, BreedingStatus } from '../App';
import { ChevronRightIcon } from './Icons';

interface BreedingCardProps {
  record: BreedingRecord;
  pairLabel: string;
  onClick: () => void;
}

const getStatusColor = (status: BreedingStatus): string => {
  switch (status) {
    case 'Successful':
      return 'bg-green-500/80';
    case 'Unsuccessful':
      return 'bg-red-500/80';
    case 'Hatched':
    case 'Fry Out':
      return 'bg-orange-500/80';
    case 'Eggs Laid':
      return 'bg-purple-500/80';
    case 'Paired':
      return 'bg-sky-500/80';
    default:
      return 'bg-gray-500/80';
  }
};

const BreedingCard: React.FC<BreedingCardProps> = ({ record, pairLabel, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-slate-800/50 p-4 rounded-xl flex items-center space-x-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-800"
    >
      <div className="flex-grow">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-lg truncate">{pairLabel}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{record.species}</p>
            </div>
            <span
                className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(record.status)} flex-shrink-0`}
            >
                {record.status}
            </span>
        </div>
      </div>
      <ChevronRightIcon className="w-6 h-6 text-gray-400 flex-shrink-0" />
    </button>
  );
};

export default BreedingCard;