import React from 'react';
import { Fish } from '../App';
import FishCard from './FishCard';
import { SettingsIcon } from './Icons';

interface FryViewProps {
  fishStock: Fish[];
  onSelectFish: (id: string) => void;
  showInactiveFish: boolean;
  onEditSpeciesSettings: (species: string) => void;
}

const FryView: React.FC<FryViewProps> = ({ fishStock, onSelectFish, showInactiveFish, onEditSpeciesSettings }) => {
  
  // 1. Filter for fish that were bred
  const bredFish = fishStock.filter(f => f.origin === 'Bred');

  // 2. Filter based on the setting
  const filteredFish = showInactiveFish ? bredFish : bredFish.filter(f => f.status === 'Active');

  // 3. Sort fish to always show 'Active' first
  const statusOrder: Record<Fish['status'], number> = {
    'Active': 1,
    'Sold': 2,
    'Dead': 3,
  };
  const sortedFish = [...filteredFish].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  // 4. Group the filtered and sorted fish by species
  const groupedFish = sortedFish.reduce((acc, fish) => {
    (acc[fish.species] = acc[fish.species] || []).push(fish);
    return acc;
  }, {} as Record<string, Fish[]>);

  const categories = Object.keys(groupedFish).sort();

  return (
    <div className="animate-fade-in h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fry & Juveniles</h1>
        {/* No "Add Fish" button here as it's contextually incorrect for bred fish */}
      </div>

      <div className="space-y-6 pb-20">
        {categories.length > 0 ? (
            categories.map(species => {
                // Count only active bred fish for the header
                const activeFishCount = bredFish.filter(f => f.species === species && f.status === 'Active').length;
                return (
                    <div key={species}>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-baseline space-x-3">
                                <h2 className="text-xl font-bold">{species}</h2>
                                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">({activeFishCount})</span>
                            </div>
                            <button 
                                onClick={() => onEditSpeciesSettings(species)} 
                                className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                                aria-label={`Settings for ${species}`}
                            >
                                <SettingsIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-fr gap-3">
                            {groupedFish[species].map(fish => (
                                <FishCard key={fish.id} fish={fish} onClick={() => onSelectFish(fish.id)} />
                            ))}
                        </div>
                    </div>
                )
            })
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            <p>No bred fish recorded yet.</p>
            <p className="text-sm">Successful breedings will populate this list.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FryView;