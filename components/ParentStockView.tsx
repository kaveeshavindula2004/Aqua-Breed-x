import React from 'react';
import { Fish } from '../App';
import { PlusIcon, SettingsIcon } from './Icons';
import FishCard from './FishCard';

interface ParentStockViewProps {
  fishStock: Fish[];
  onAddFish: () => void;
  onSelectFish: (id: string) => void;
  onEditSpeciesSettings: (species: string) => void;
}

const ParentStockView: React.FC<ParentStockViewProps> = ({ fishStock, onAddFish, onSelectFish, onEditSpeciesSettings }) => {
  
  // Filter for active fish, which are considered potential parents.
  const activeFish = fishStock.filter(f => f.status === 'Active');

  // Group the active fish by species
  const groupedFish = activeFish.reduce((acc, fish) => {
    (acc[fish.species] = acc[fish.species] || []).push(fish);
    return acc;
  }, {} as Record<string, Fish[]>);

  const categories = Object.keys(groupedFish).sort();

  return (
    <div className="animate-fade-in h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parent Stock</h1>
        <button
          onClick={onAddFish}
          className="flex items-center space-x-2 bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-3 py-2 shadow-md transition-all active:scale-95 hover:shadow-lg"
          aria-label="Add new fish"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Fish</span>
        </button>
      </div>

      <div className="space-y-6 pb-20">
        {categories.length > 0 ? (
            categories.map(species => {
                const activeFishCount = groupedFish[species].length; // All fish here are active
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
            <p>No active parent fish found.</p>
            <p className="text-sm">Add fish to your stock to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentStockView;