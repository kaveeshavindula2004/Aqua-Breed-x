import React, { useState } from 'react';
import { DietPlan } from '../App';
import { PlusIcon, XIcon, TrashIcon } from './Icons';

interface DietPlansViewProps {
    dietPlans: DietPlan[];
    setDietPlans: React.Dispatch<React.SetStateAction<DietPlan[]>>;
    allSpecies: string[];
}

const AddDietPlanForm: React.FC<{ onSave: (plan: Omit<DietPlan, 'id'>) => void, onClose: () => void, allSpecies: string[] }> = ({ onSave, onClose, allSpecies }) => {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [food, setFood] = useState('');
    const [target, setTarget] = useState<'Parents' | 'Fry' | 'All'>('All');
    const [feedingTimes, setFeedingTimes] = useState<string[]>(['09:00']);

    const handleTimeChange = (index: number, value: string) => {
        const newTimes = [...feedingTimes];
        newTimes[index] = value;
        setFeedingTimes(newTimes);
    };

    const addTimeField = () => setFeedingTimes([...feedingTimes, '']);
    const removeTimeField = (index: number) => setFeedingTimes(feedingTimes.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !species || !food || feedingTimes.some(t => !t)) {
            alert("Please fill out all required fields.");
            return;
        }
        onSave({ 
            name, 
            species, 
            food, 
            target, 
            feedingTimes: feedingTimes.filter(t => t), 
            timesPerDay: feedingTimes.filter(t => t).length,
            isTemporary: false 
        });
    };

    return (
        <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm text-gray-900 dark:text-white p-4 space-y-3 border border-gray-300 dark:border-slate-700 max-h-[90vh] flex flex-col">
                <h3 className="text-lg font-bold">New Diet Plan</h3>
                <div className="overflow-y-auto pr-2 space-y-3">
                    <input type="text" placeholder="Plan Name (e.g., Guppy Fry Growth)" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm" required/>
                    <select value={species} onChange={e => setSpecies(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm" required>
                        <option value="">Select Species</option>
                        {allSpecies.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <input type="text" placeholder="Food Type (e.g., Baby Brine Shrimp)" value={food} onChange={e => setFood(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm" required/>
                    <select value={target} onChange={e => setTarget(e.target.value as any)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm">
                        <option value="All">All</option>
                        <option value="Parents">Parents</option>
                        <option value="Fry">Fry</option>
                    </select>
                    <div>
                        <label className="text-sm">Feeding Times</label>
                        {feedingTimes.map((time, index) => (
                             <div key={index} className="flex items-center space-x-2 mt-1">
                                <input type="time" value={time} onChange={e => handleTimeChange(index, e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm"/>
                                <button type="button" onClick={() => removeTimeField(index)} className="p-1 text-red-500 dark:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        ))}
                        <button type="button" onClick={addTimeField} className="text-sky-500 dark:text-sky-400 text-sm mt-2">+ Add Time</button>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                    <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
                    <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
                </div>
                <button type="button" onClick={onClose} className="absolute top-3 right-3 p-1"><XIcon className="w-5 h-5"/></button>
            </form>
        </div>
    );
};

const DietPlansView: React.FC<DietPlansViewProps> = ({ dietPlans, setDietPlans, allSpecies }) => {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddPlan = (plan: Omit<DietPlan, 'id'>) => {
        const newPlan = { ...plan, id: `diet-${Date.now()}` };
        setDietPlans(prev => [...prev, newPlan]);
        setIsAdding(false);
    };

    return (
        <div className="animate-fade-in h-full p-2">
            {isAdding && <AddDietPlanForm onSave={handleAddPlan} onClose={() => setIsAdding(false)} allSpecies={allSpecies}/>}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Diet Plans</h1>
                <button onClick={() => setIsAdding(true)} className="flex items-center space-x-2 bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-3 py-2">
                    <PlusIcon className="w-5 h-5" />
                    <span>New Plan</span>
                </button>
            </div>

            <div className="space-y-3 pb-20">
                {dietPlans.length > 0 ? (
                    dietPlans.map(plan => (
                        <div key={plan.id} className="bg-white dark:bg-slate-800/50 p-3 rounded-lg">
                            <h3 className="font-bold">{plan.name} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">({plan.species} / {plan.target})</span></h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Feed <span className="font-semibold">{plan.food}</span> at {plan.feedingTimes.join(', ')}</p>
                        </div>
                    ))
                ) : (
                     <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                        <p>No diet plans created yet.</p>
                        <p className="text-sm">Create a plan to receive feeding notifications.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DietPlansView;