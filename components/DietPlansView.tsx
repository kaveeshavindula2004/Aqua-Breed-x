import React, { useState, useEffect } from 'react';
import { DietPlan, InventoryItem } from '../App';
import { PlusIcon, TrashIcon, EditIcon, XIcon } from './Icons';

// Form for adding or editing a diet plan
const AddDietPlanForm: React.FC<{
    onSave: (plan: DietPlan | Omit<DietPlan, 'id'>) => void,
    onClose: () => void,
    allSpecies: string[],
    initialData?: DietPlan,
    fishFeeds: InventoryItem[],
}> = ({ onSave, onClose, allSpecies, initialData, fishFeeds }) => {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [food, setFood] = useState('');
    const [target, setTarget] = useState<'Parents' | 'Fry' | 'All'>('All');
    const [feedingTimes, setFeedingTimes] = useState<string[]>(['09:00']);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setSpecies(initialData.species);
            setFood(initialData.food);
            setTarget(initialData.target);
            setFeedingTimes(initialData.feedingTimes);
        }
    }, [initialData]);

    const handleTimeChange = (index: number, value: string) => {
        const newTimes = [...feedingTimes];
        newTimes[index] = value;
        setFeedingTimes(newTimes);
    };

    const addTimeField = () => setFeedingTimes([...feedingTimes, '']);
    const removeTimeField = (index: number) => {
        if (feedingTimes.length > 1) {
            setFeedingTimes(feedingTimes.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !species || !food || feedingTimes.some(t => !t)) {
            alert("Please fill out all required fields and ensure feeding times are set.");
            return;
        }
        
        const planData = {
            name,
            species,
            food,
            target,
            feedingTimes: feedingTimes.filter(t => t),
            timesPerDay: feedingTimes.filter(t => t).length,
            isTemporary: false
        };

        if (initialData) {
            onSave({ ...planData, id: initialData.id });
        } else {
            onSave(planData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Diet Plan' : 'New Diet Plan'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto">
                    <input type="text" placeholder="Plan Name (e.g., Guppy Fry Growth)" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none" required />
                    <select value={species} onChange={e => setSpecies(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none" required>
                        <option value="">Select Species</option>
                        {allSpecies.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={food} onChange={e => setFood(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none" required>
                        <option value="">Select Food Type</option>
                        {fishFeeds.length > 0 ? (
                            fishFeeds.map(feed => <option key={feed.id} value={feed.name}>{feed.name}</option>)
                        ) : (
                            <option value="" disabled>No fish feeds in inventory</option>
                        )}
                    </select>
                    {fishFeeds.length === 0 && <p className="text-xs text-yellow-500 text-center -mt-2">Please add items to the 'Fish Feeds' category in your inventory first.</p>}
                    <select value={target} onChange={e => setTarget(e.target.value as any)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none">
                        <option value="All">All</option>
                        <option value="Parents">Parents</option>
                        <option value="Fry">Fry</option>
                    </select>
                    <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Feeding Times</label>
                        {feedingTimes.map((time, index) => (
                            <div key={index} className="flex items-center space-x-2 mt-1">
                                <input type="time" value={time} onChange={e => handleTimeChange(index, e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none" required/>
                                {feedingTimes.length > 1 && (
                                    <button type="button" onClick={() => removeTimeField(index)} className="p-1 text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-full">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addTimeField} className="text-sky-500 dark:text-sky-400 text-sm font-semibold mt-2 hover:underline">+ Add Time</button>
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

// Confirmation dialog for deleting a plan
const DietPlanConfirmationDialog: React.FC<{ plan: DietPlan; onConfirm: () => void; onCancel: () => void; }> = ({ plan, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm text-gray-900 dark:text-white p-6 space-y-4 border border-gray-300 dark:border-slate-700 text-center shadow-lg">
            <h3 className="text-xl font-bold">Confirm Deletion</h3>
            <p className="text-gray-600 dark:text-gray-300">Are you sure you want to delete the plan <span className="font-semibold text-gray-900 dark:text-white">{plan.name}</span>?</p>
            <div className="flex justify-center space-x-4 pt-2">
                <button onClick={onCancel} className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">Cancel</button>
                <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">Delete</button>
            </div>
        </div>
    </div>
);

// Props for the main view component
interface DietPlansViewProps {
    dietPlans: DietPlan[];
    allSpecies: string[];
    onAdd: (plan: Omit<DietPlan, 'id'>) => Promise<void>;
    onUpdate: (plan: DietPlan) => Promise<void>;
    onDelete: (planId: string) => Promise<void>;
    fishFeeds: InventoryItem[];
}

// Card for displaying a single diet plan
const DietPlanCard: React.FC<{ plan: DietPlan, onEdit: () => void, onDelete: () => void }> = ({ plan, onEdit, onDelete }) => (
    <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg flex items-center space-x-3">
        <div className="flex-grow">
            <h3 className="font-bold">{plan.name} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">({plan.species} / {plan.target})</span></h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Feed <span className="font-semibold">{plan.food}</span> at {plan.feedingTimes.join(', ')}</p>
        </div>
        <div className="flex-shrink-0 flex items-center space-x-1">
            <button onClick={onEdit} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-sky-500 dark:hover:text-sky-400 transition-colors" aria-label={`Edit ${plan.name}`}>
                <EditIcon className="w-5 h-5" />
            </button>
            <button onClick={onDelete} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-red-500 dark:hover:text-red-400 transition-colors" aria-label={`Delete ${plan.name}`}>
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
    </div>
);

// Main view component
const DietPlansView: React.FC<DietPlansViewProps> = ({ dietPlans, allSpecies, onAdd, onUpdate, onDelete, fishFeeds }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<DietPlan | undefined>(undefined);
    const [planToDelete, setPlanToDelete] = useState<DietPlan | null>(null);

    const handleOpenAdd = () => {
        setEditingPlan(undefined);
        setIsModalOpen(true);
    };
    
    const handleOpenEdit = (plan: DietPlan) => {
        setEditingPlan(plan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingPlan(undefined);
        setIsModalOpen(false);
    };
    
    const handleSave = async (planData: DietPlan | Omit<DietPlan, 'id'>) => {
        if ('id' in planData) {
            await onUpdate(planData as DietPlan);
        } else {
            await onAdd(planData as Omit<DietPlan, 'id'>);
        }
        handleCloseModal();
    };

    const handleDelete = async () => {
        if (planToDelete) {
            await onDelete(planToDelete.id);
            setPlanToDelete(null);
        }
    };

    return (
        <div className="animate-fade-in h-full p-2">
            {isModalOpen && (
                <AddDietPlanForm
                    onSave={handleSave}
                    onClose={handleCloseModal}
                    allSpecies={allSpecies}
                    initialData={editingPlan}
                    fishFeeds={fishFeeds}
                />
            )}
            {planToDelete && (
                <DietPlanConfirmationDialog
                    plan={planToDelete}
                    onConfirm={handleDelete}
                    onCancel={() => setPlanToDelete(null)}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Diet Plans</h1>
                <button onClick={handleOpenAdd} className="flex items-center space-x-2 bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-3 py-2 shadow-md transition-all active:scale-95 hover:shadow-lg">
                    <PlusIcon className="w-5 h-5" />
                    <span>New Plan</span>
                </button>
            </div>

            <div className="space-y-3 pb-20">
                {dietPlans.length > 0 ? (
                    dietPlans.map(plan => (
                        <DietPlanCard
                            key={plan.id}
                            plan={plan}
                            onEdit={() => handleOpenEdit(plan)}
                            onDelete={() => setPlanToDelete(plan)}
                        />
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