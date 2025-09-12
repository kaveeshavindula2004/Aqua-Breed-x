import React from 'react';
import { DietPlan } from '../App';
import { PlusIcon, TrashIcon, EditIcon } from './Icons';

// Props for the main view component
interface DietPlansViewProps {
    dietPlans: DietPlan[];
    onOpenAdd: () => void;
    onOpenEdit: (plan: DietPlan) => void;
    onOpenDelete: (plan: DietPlan) => void;
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
const DietPlansView: React.FC<DietPlansViewProps> = ({ dietPlans, onOpenAdd, onOpenEdit, onOpenDelete }) => {
    return (
        <div className="animate-fade-in h-full p-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Diet Plans</h1>
                <button onClick={onOpenAdd} className="flex items-center space-x-2 bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-3 py-2 shadow-md transition-all active:scale-95 hover:shadow-lg">
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
                            onEdit={() => onOpenEdit(plan)}
                            onDelete={() => onOpenDelete(plan)}
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