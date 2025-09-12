import React, { useState } from 'react';
import { SpeciesTimeline } from '../App';
import { XIcon } from './Icons';

interface SpeciesSettingsFormProps {
    speciesToEdit?: string;
    settings?: SpeciesTimeline;
    onSave: (speciesName: string, timeline: SpeciesTimeline) => void;
    onClose: () => void;
    allSpecies: string[];
}

const FormRow: React.FC<{ label: string, description: string, value: number, onChange: (val: number) => void }> = ({ label, description, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">{label}</label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{description}</p>
        <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={(e) => {
                const sanitizedValue = e.target.value.replace(/\D/g, '');
                onChange(Number(sanitizedValue));
            }}
            className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />
    </div>
);

const SpeciesSettingsForm: React.FC<SpeciesSettingsFormProps> = ({ speciesToEdit, settings, onSave, onClose, allSpecies }) => {
    const isAdding = !speciesToEdit;

    const [speciesName, setSpeciesName] = useState(speciesToEdit || '');
    const [incubationDays, setIncubationDays] = useState(settings?.incubationDays || 0);
    const [saleReadyDays, setSaleReadyDays] = useState(settings?.saleReadyDays || 0);
    const [breedingCooldownDays, setBreedingCooldownDays] = useState(settings?.breedingCooldownDays || 0);
    const [maturityDays, setMaturityDays] = useState(settings?.maturityDays || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const trimmedName = speciesName.trim();
        if (isAdding) {
            if (!trimmedName) {
                alert("Species name is required.");
                return;
            }
            if (allSpecies.some(s => s.toLowerCase() === trimmedName.toLowerCase())) {
                alert(`Species "${trimmedName}" already exists.`);
                return;
            }
        }

        onSave(trimmedName, {
            incubationDays: Number(incubationDays),
            saleReadyDays: Number(saleReadyDays),
            breedingCooldownDays: Number(breedingCooldownDays),
            maturityDays: Number(maturityDays),
        });
    };

    return (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm max-h-[90vh] text-gray-900 dark:text-white shadow-lg border border-gray-300 dark:border-slate-700 flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold">{isAdding ? 'Add New Species' : `${speciesToEdit} Settings`}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><XIcon className="w-5 h-5" /></button>
                </header>
                <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
                    {isAdding && (
                        <div>
                             <label htmlFor="speciesName" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Species Name *</label>
                             <input
                                id="speciesName"
                                type="text"
                                value={speciesName}
                                onChange={(e) => setSpeciesName(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                required
                                autoFocus
                            />
                        </div>
                    )}
                    <FormRow 
                        label="Incubation Period (days)"
                        description="Days from eggs laid to hatching."
                        value={incubationDays}
                        onChange={setIncubationDays}
                    />
                    <FormRow 
                        label="Growth to Sale (days)"
                        description="Days from hatching until fry are ready for sale."
                        value={saleReadyDays}
                        onChange={setSaleReadyDays}
                    />
                     <FormRow 
                        label="Maturity (days)"
                        description="Days from birth until fish can become a parent."
                        value={maturityDays}
                        onChange={setMaturityDays}
                    />
                    <FormRow 
                        label="Breeding Cycle (days)"
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