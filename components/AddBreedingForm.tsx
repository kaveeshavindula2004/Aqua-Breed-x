import React, { useState } from 'react';
import { Fish, NewBreedingPayload } from '../App';
import { XIcon } from './Icons';

interface AddBreedingFormProps {
  onClose: () => void;
  onSave: (payload: NewBreedingPayload) => void;
  parentStock: Fish[];
}

const AddBreedingForm: React.FC<AddBreedingFormProps> = ({ onClose, onSave, parentStock }) => {
    const [motherId, setMotherId] = useState('');
    const [fatherId, setFatherId] = useState('');
    const [pairingDate, setPairingDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!motherId || !fatherId || !pairingDate) {
            alert('Please select a mother, father, and pairing date.');
            return;
        }
        if (motherId === fatherId) {
            alert('Mother and Father cannot be the same fish.');
            return;
        }

        onSave({
            motherId,
            fatherId,
            pairingDate,
            notes,
            status: 'Paired'
        });
    };
    
    const getParentOptions = (gender: Fish['gender'], excludeId?: string) => {
        return parentStock
            .filter(fish => fish.gender === gender && fish.id !== excludeId)
            .sort((a,b) => (a.nickname || a.id).localeCompare(b.nickname || b.id));
    };

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm max-h-[90vh] text-gray-900 dark:text-white shadow-lg border border-gray-300 dark:border-slate-700 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">New Breeding Record</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><XIcon className="w-5 h-5" /></button>
        </header>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
            <div>
                <label htmlFor="motherId" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Mother (Dam) *</label>
                <select id="motherId" value={motherId} onChange={e => setMotherId(e.target.value)} required className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none">
                    <option value="" disabled>Select a mother</option>
                    {getParentOptions('Female', fatherId).map(fish => <option key={fish.id} value={fish.id}>{fish.nickname || fish.id} ({fish.species})</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="fatherId" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Father (Sire) *</label>
                <select id="fatherId" value={fatherId} onChange={e => setFatherId(e.target.value)} required className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none">
                    <option value="" disabled>Select a father</option>
                     {getParentOptions('Male', motherId).map(fish => <option key={fish.id} value={fish.id}>{fish.nickname || fish.id} ({fish.species})</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="pairingDate" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Pairing Date *</label>
                <input type="date" id="pairingDate" value={pairingDate} onChange={e => setPairingDate(e.target.value)} required className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"/>
            </div>
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Notes</label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none" placeholder="e.g., Setting up a 10-gallon breeding tank..."></textarea>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold rounded-lg px-4 py-2 transition-colors">Cancel</button>
                <button type="submit" className="bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-6 py-2 shadow-md transition-all active:scale-95 hover:shadow-lg">Save</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddBreedingForm;