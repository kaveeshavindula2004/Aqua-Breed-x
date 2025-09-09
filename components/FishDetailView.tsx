import React, { useState } from 'react';
import { Fish, HealthRecord, BreedingRecord } from '../App';
import { ParentFishIcon, PrintIcon } from './Icons';

interface FishDetailViewProps {
  fish: Fish;
  onUpdateFish: (updatedFish: Fish) => void;
  onGenerateCertificate: (fishId: string) => void;
  fishStock: Fish[];
  breedingRecords: BreedingRecord[];
}

const DetailRow: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </div>
  );
};


const FishDetailView: React.FC<FishDetailViewProps> = ({ fish, onUpdateFish, onGenerateCertificate, fishStock, breedingRecords }) => {
    const [newRecordType, setNewRecordType] = useState<'Observation' | 'Treatment'>('Observation');
    const [newRecordNotes, setNewRecordNotes] = useState('');

    const mother = fishStock.find(f => f.id === fish.motherId);
    const father = fishStock.find(f => f.id === fish.fatherId);
    const breedingRecord = breedingRecords.find(r => r.id === fish.breedingId);

    const handleMarkSold = () => { 
        const priceStr = window.prompt("Enter the sale price for this fish:");
        if (priceStr !== null) {
            const price = parseFloat(priceStr);
            if (!isNaN(price) && price >= 0) {
                onUpdateFish({ ...fish, status: 'Sold', salePrice: price });
            } else {
                alert("Invalid price entered. Please enter a valid number.");
            }
        }
    };
    const handleMarkDead = () => {
        const cause = window.prompt("Enter cause of death (optional):");
        if (cause !== null) onUpdateFish({ ...fish, status: 'Dead', causeOfDeath: cause || 'Unknown' });
    };
    
    const handleAddHealthRecord = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRecordNotes.trim() === '') return;
        const newRecord: HealthRecord = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            type: newRecordType,
            notes: newRecordNotes.trim(),
        };
        onUpdateFish({ ...fish, healthHistory: [...fish.healthHistory, newRecord] });
        setNewRecordNotes('');
    }

  return (
    <div className="animate-fade-in pb-10">
      <header className="mb-4">
        <div className="w-full aspect-video bg-gray-200 dark:bg-slate-700 rounded-xl mb-4 overflow-hidden">
             {fish.photo ? (<img src={fish.photo} alt={fish.nickname || fish.id} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center"><ParentFishIcon className="w-1/2 h-1/2 text-gray-400 dark:text-gray-500" /></div>)}
        </div>
        <h1 className="text-3xl font-bold">{fish.nickname || fish.id}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-300">{fish.species} {fish.nickname && `(${fish.id})`}</p>
      </header>

      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 mb-4">
        <h2 className="text-xl font-bold mb-2">Details</h2>
        <DetailRow label="Status" value={fish.status} />
        {fish.status === 'Sold' && <DetailRow label="Sale Price" value={`$${fish.salePrice?.toFixed(2)}`} />}
        <DetailRow label="Gender" value={fish.gender} />
        <DetailRow label="Origin" value={fish.origin} />
        <DetailRow label="Date of Birth" value={fish.dob || 'Unknown'} />
        {fish.status === 'Dead' && <DetailRow label="Cause of Death" value={fish.causeOfDeath} />}
      </div>
      
      {fish.origin === 'Bred' && (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">Genealogy & Breeding History</h2>
            <DetailRow label="Mother (Dam)" value={mother?.nickname || fish.motherId} />
            <DetailRow label="Father (Sire)" value={father?.nickname || fish.fatherId} />
            <DetailRow label="Pairing Date" value={breedingRecord?.pairingDate} />
            <DetailRow label="Hatch Date" value={breedingRecord?.hatchDate} />
        </div>
      )}

      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 mb-4">
        <h2 className="text-xl font-bold mb-2">Health History</h2>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {fish.healthHistory.length > 0 ? [...fish.healthHistory].reverse().map(record => (
                <div key={record.id} className="text-sm">
                    <div className="flex justify-between items-center">
                        <span className={`font-semibold ${record.type === 'Treatment' ? 'text-orange-500 dark:text-orange-400' : 'text-sky-500 dark:text-sky-400'}`}>{record.type}</span>
                        <span className="text-xs text-gray-400">{record.date}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{record.notes}</p>
                </div>
            )) : <p className="text-sm text-gray-500 dark:text-gray-400">No health records found.</p>}
        </div>
      </div>
      
      {fish.status === 'Active' && (
        <>
            <form onSubmit={handleAddHealthRecord} className="bg-white dark:bg-slate-800/50 rounded-xl p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Add Health Record</h3>
                <div className="flex space-x-2 mb-2">
                    <select value={newRecordType} onChange={e => setNewRecordType(e.target.value as any)} className="bg-gray-100 dark:bg-slate-700 rounded px-2 py-1 text-sm">
                        <option value="Observation">Observation</option>
                        <option value="Treatment">Treatment</option>
                    </select>
                    <input type="text" value={newRecordNotes} onChange={e => setNewRecordNotes(e.target.value)} placeholder="Enter notes..." className="flex-grow bg-gray-100 dark:bg-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"/>
                </div>
                <button type="submit" className="w-full text-sm bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg transition-colors">Save Record</button>
            </form>
            <div className="flex space-x-3">
              <button onClick={handleMarkSold} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">Mark as Sold</button>
              <button onClick={handleMarkDead} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">Mark as Dead</button>
            </div>
        </>
      )}
      
      {fish.status === 'Sold' && (
        <div className="mt-4">
            <button onClick={() => onGenerateCertificate(fish.id)} className="w-full flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                <PrintIcon className="w-5 h-5" />
                <span>Generate Certificate</span>
            </button>
        </div>
      )}
    </div>
  );
};

export default FishDetailView;