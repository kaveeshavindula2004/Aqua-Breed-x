import React, { useState, useEffect } from 'react';
import { HealthRecord, NewFishPayload, Fish } from '../App';
import { CameraIcon, XIcon } from './Icons';

export interface AddFishFormInitialData {
  species: string;
  dob: string;
  motherId: string;
  fatherId: string;
  breedingId: number;
}

interface AddFishFormProps {
  onClose: () => void;
  onSave: (newFish: NewFishPayload) => void;
  existingSpecies: string[];
  initialData?: AddFishFormInitialData;
}

const AddFishForm: React.FC<AddFishFormProps> = ({ onClose, onSave, existingSpecies, initialData }) => {
    const [species, setSpecies] = useState('');
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState<Fish['gender']>('Unknown');
    const [dob, setDob] = useState('');
    const [isDobUnknown, setIsDobUnknown] = useState(false);
    const [photo, setPhoto] = useState<string | undefined>(undefined);
    const [initialNotes, setInitialNotes] = useState('');

    useEffect(() => {
      if(initialData) {
        setSpecies(initialData.species);
        setDob(initialData.dob);
      }
    }, [initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPhoto(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!species) {
            alert('Please fill in the Species.');
            return;
        }

        const healthHistory: HealthRecord[] = [];
        if(initialNotes.trim() !== '') {
            healthHistory.push({
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                type: 'Observation',
                notes: `Initial entry: ${initialNotes}`
            });
        }

        const newFishPayload: NewFishPayload = {
            species: species.trim(),
            nickname: nickname.trim() || undefined,
            gender,
            dob: isDobUnknown ? null : dob,
            photo,
            status: 'Active',
            healthHistory,
            motherId: initialData?.motherId,
            fatherId: initialData?.fatherId,
            breedingId: initialData?.breedingId,
        };
        onSave(newFishPayload);
    };

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm max-h-[90vh] text-gray-900 dark:text-white shadow-lg border border-gray-300 dark:border-slate-700 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">{initialData ? 'Add Fry to Stock' : 'Add New Fish'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
            <XIcon className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto">
            <div className="flex space-x-3">
                <div className="w-24 h-24 bg-gray-200 dark:bg-slate-800 rounded-lg flex-shrink-0 relative group">
                    <input type="file" id="photo-upload" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} />
                    <label htmlFor="photo-upload" className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 cursor-pointer">
                        {photo ? (<img src={photo} alt="Fish preview" className="w-full h-full object-cover rounded-lg" />) : (<><CameraIcon className="w-8 h-8"/><span className="text-xs mt-1">Add Photo</span></>)}
                    </label>
                </div>
                <div className="flex-grow space-y-3">
                    <div>
                        <label htmlFor="nickname" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Nickname</label>
                        <input type="text" id="nickname" value={nickname} onChange={e => setNickname(e.target.value)} className="w-full text-sm bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-sky-500 focus:outline-none"/>
                    </div>
                     <div>
                        <label htmlFor="gender" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Gender</label>
                        <select id="gender" value={gender} onChange={e => setGender(e.target.value as Fish['gender'])} className="w-full text-sm bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-sky-500 focus:outline-none">
                            <option value="Unknown">Unknown</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="species" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Species *</label>
                <input type="text" id="species" value={species} onChange={e => setSpecies(e.target.value)} required list="species-list" disabled={!!initialData} className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none disabled:opacity-50" placeholder="e.g., Guppy"/>
                <datalist id="species-list">{existingSpecies.map(s => <option key={s} value={s} />)}</datalist>
            </div>

            <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Date of Birth</label>
                <input type="date" id="dob" value={dob} onChange={e => setDob(e.target.value)} required={!isDobUnknown} disabled={isDobUnknown || !!initialData} className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none disabled:opacity-50"/>
                 <div className="flex items-center mt-2">
                    <input type="checkbox" id="dob-unknown" checked={isDobUnknown} onChange={e => setIsDobUnknown(e.target.checked)} disabled={!!initialData} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 disabled:opacity-50"/>
                    <label htmlFor="dob-unknown" className="ml-2 block text-sm text-gray-600 dark:text-gray-300">Date of Birth is unknown</label>
                </div>
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Initial Health Notes</label>
                <textarea id="notes" value={initialNotes} onChange={e => setInitialNotes(e.target.value)} rows={2} className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none" placeholder="e.g., Acclimated well, fins in good condition."></textarea>
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

export default AddFishForm;