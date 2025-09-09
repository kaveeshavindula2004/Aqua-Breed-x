import React, { useState } from 'react';
import { SpeciesTimeline } from '../App';
import { XIcon } from './Icons';

interface SpeciesSettingsFormProps {
    species: string;
    settings: SpeciesTimeline;
    onSave: (timeline: SpeciesTimeline) => void;
    onClose: () => void;
}

const SpeciesSettingsForm: React.FC<SpeciesSettingsFormProps> = ({ species, settings, onSave, onClose }) => {
    const [incubationDays, setIncubationDays] = useState(settings.incubationDays);
    const [saleReadyDays, setSaleReadyDays] = useState(settings.saleReadyDays);
    const [breedingCooldownDays, setBreedingCooldownDays] = useState(settings.breedingCooldownDays);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            incubationDays: Number(incubationDays),
            saleReadyDays: Number(saleReadyDays),
            breedingCooldownDays: Number(breedingCooldownDays),
        });
    };

    const FormRow: React.FC<{ label: string, description: string, value: number, onChange: (val: number) => void }> = ({ label, description, value, onChange }) => (
        <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">{label}</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{description}</p>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
        </div>
    );

    return (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm max-h-[90vh] text-gray-900 dark:text-white shadow-lg border border-gray-300 dark:border-slate-700 flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold">{species} Settings</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><XIcon className="w-5 h-5" /></button>
                </header>
                <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
                    <FormRow 
                        label="Incubation Period"
                        description="Days from eggs laid to hatching."
                        value={incubationDays}
                        onChange={setIncubationDays}
                    />
                    <FormRow 
                        label="Growth to Sale"
                        description="Days from hatching until fry are ready for sale."
                        value={saleReadyDays}
                        onChange={setSaleReadyDays}
                    />
                    <FormRow 
                        label="Breeding Cycle"
                        description="Days needed between successful breeding cycles."
                        value={breedingCooldownDays}
                        onChange={setBreedingCooldownDays}
                    />
                    <div className="flex justify-end space-x-3 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold rounded-lg px-4 py-2 transition-colors">Cancel</button>
                        <button type="submit" className="bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-6 py-2 shadow-md transition-all active:scale-95 hover:shadow-lg">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SpeciesSettingsForm;