import React, { useState } from 'react';
import { BreedingRecord, BreedingStatus, Fish } from '../App';

interface BreedingDetailViewProps {
  record: BreedingRecord;
  onUpdateStatus: (id: number, status: BreedingStatus) => void;
  onUpdateRecord: (record: BreedingRecord) => void;
  onAddFry: (record: BreedingRecord) => void;
  fishStock: Fish[];
}

const DetailRow: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-slate-700 last:border-b-0">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </div>
  );
};

const ParentDetail: React.FC<{ label: string, fish?: Fish }> = ({ label, fish }) => (
    <div className="flex-1 bg-gray-100 dark:bg-slate-900/50 p-3 rounded-lg">
        <p className="text-sm text-sky-500 dark:text-sky-400 font-semibold">{label}</p>
        <p className="truncate">{fish?.nickname || fish?.id || 'N/A'}</p>
    </div>
);


const BreedingDetailView: React.FC<BreedingDetailViewProps> = ({ record, onUpdateStatus, onUpdateRecord, onAddFry, fishStock }) => {
  const [dietPlan, setDietPlan] = useState(record.dietPlan || '');
  
  const isFinished = record.status === 'Successful' || record.status === 'Unsuccessful';
  const mother = fishStock.find(f => f.id === record.motherId);
  const father = fishStock.find(f => f.id === record.fatherId);

  const statusProgression: Partial<Record<BreedingStatus, BreedingStatus>> = {
    'Paired': 'Eggs Laid',
    'Eggs Laid': 'Hatched',
    'Hatched': 'Fry Out',
    'Fry Out': 'Successful',
  };
  const nextStatus = statusProgression[record.status];
  
  const handleSaveDiet = () => {
    onUpdateRecord({ ...record, dietPlan });
    alert("Diet plan saved!");
  };

  return (
    <div className="animate-fade-in p-2 pb-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold truncate">{mother?.nickname || record.motherId} x {father?.nickname || record.fatherId}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{record.species}</p>
      </header>

      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 mb-4">
        <h2 className="text-xl font-bold mb-3">Parents</h2>
        <div className="flex space-x-3">
            <ParentDetail label="Mother (Dam)" fish={mother} />
            <ParentDetail label="Father (Sire)" fish={father} />
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 mb-4">
        <h2 className="text-xl font-bold mb-2">Breeding Timeline</h2>
        <DetailRow label="Status" value={record.status} />
        <DetailRow label="Pairing Date" value={record.pairingDate} />
        <DetailRow label="Eggs Laid" value={record.eggsLaidDate} />
        <DetailRow label="Hatch Date" value={record.hatchDate} />
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Notes</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{record.notes || 'No notes for this record.'}</p>
      </div>
      
      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Fry Diet Plan</h2>
            <button onClick={handleSaveDiet} className="text-sm bg-sky-600 hover:bg-sky-700 text-white font-semibold py-1 px-3 rounded-lg transition-colors">Save</button>
          </div>
          <textarea value={dietPlan} onChange={e => setDietPlan(e.target.value)} rows={3} className="w-full bg-gray-100 dark:bg-slate-700 text-sm rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="e.g., Day 1-3: Infusoria..." />
      </div>

      {record.status === 'Successful' && (
        <div className="mt-6">
            <button onClick={() => onAddFry(record)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              Add Fry to Stock
            </button>
        </div>
      )}

      {!isFinished && (
        <div className="mt-8 space-y-6">
          {nextStatus && (
            <div>
              <h3 className="text-lg font-semibold text-center mb-3">Update Progress</h3>
              <button
                onClick={() => onUpdateStatus(record.id, nextStatus)}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Mark as {nextStatus}
              </button>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-center mb-3">Mark as Complete</h3>
            <div className="flex space-x-4">
              <button onClick={() => onUpdateStatus(record.id, 'Successful')} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">Successful</button>
              <button onClick={() => onUpdateStatus(record.id, 'Unsuccessful')} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">Unsuccessful</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedingDetailView;