import React from 'react';
import { BreedingRecord, Fish } from '../App';
import BreedingCard from './BreedingCard';
import { PlusIcon } from './Icons';

interface BreedingManagementViewProps {
  records: BreedingRecord[];
  fishStock: Fish[];
  onSelectRecord: (id: number) => void;
  onAddBreeding: () => void;
}

const BreedingManagementView: React.FC<BreedingManagementViewProps> = ({ records, fishStock, onSelectRecord, onAddBreeding }) => {
  return (
    <div className="animate-fade-in h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Breeding Management</h1>
        <button
          onClick={onAddBreeding}
          className="flex items-center space-x-2 bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-3 py-2 shadow-md transition-all active:scale-95 hover:shadow-lg"
          aria-label="Add new breeding record"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New</span>
        </button>
      </div>

      <div className="space-y-3 pb-20">
        {records.map(record => {
            const mother = fishStock.find(f => f.id === record.motherId);
            const father = fishStock.find(f => f.id === record.fatherId);
            const pairLabel = `${mother?.nickname || record.motherId} x ${father?.nickname || record.fatherId}`;

            return (
              <BreedingCard
                key={record.id}
                record={record}
                pairLabel={pairLabel}
                onClick={() => onSelectRecord(record.id)}
              />
            )
        })}
        {records.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            <p>No breeding records found.</p>
            <p className="text-sm">Tap the 'New' button to add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreedingManagementView;