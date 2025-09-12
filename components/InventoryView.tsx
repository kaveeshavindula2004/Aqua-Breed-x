import React, { useState } from 'react';
import { InventoryItem, InventoryCategory } from '../App';
import { PlusIcon, TrashIcon, InventoryIcon } from './Icons';

interface InventoryViewProps {
    inventory: InventoryItem[];
    onUpdateItem: (item: InventoryItem) => void;
    onOpenAddItem: () => void;
    onOpenDeleteItem: (item: InventoryItem) => void;
}

const InventoryCard: React.FC<{
    item: InventoryItem;
    onUpdateQuantity: (newQuantity: number) => void;
    onDelete: () => void;
}> = ({ item, onUpdateQuantity, onDelete }) => {
    return (
        <div className="bg-white dark:bg-slate-800/50 p-2 rounded-xl flex flex-col h-full text-left relative transition-colors shadow-sm">
            <button
                onClick={onDelete}
                className="absolute top-1 right-1 p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors z-10"
                aria-label={`Delete ${item.name}`}
            >
                <TrashIcon className="w-4 h-4" />
            </button>

            <div className="aspect-square w-full bg-gray-200 dark:bg-slate-700 rounded-lg mb-2 overflow-hidden">
                {item.photo ? (
                    <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-3">
                        <InventoryIcon className="w-full h-full text-gray-400 dark:text-gray-500" />
                    </div>
                )}
            </div>

            <div className="px-1 flex-grow">
                <p className={`font-bold truncate text-sm ${item.quantity <= 0 ? 'text-red-500 dark:text-red-400' : ''}`}>{item.name}</p>
            </div>
            
            <div className="flex items-center justify-center space-x-2 mt-2">
                <button
                    onClick={() => onUpdateQuantity(item.quantity - 1)}
                    className="bg-gray-200 dark:bg-slate-700 w-7 h-7 rounded-full font-bold text-base flex items-center justify-center transition-colors hover:bg-gray-300 dark:hover:bg-slate-600 active:scale-95 disabled:opacity-50"
                    disabled={item.quantity <= 0}
                    aria-label={`Decrease quantity of ${item.name}`}
                >
                    -
                </button>
                <span className="w-8 text-center font-semibold text-base tabular-nums">{item.quantity}</span>
                <button
                    onClick={() => onUpdateQuantity(item.quantity + 1)}
                    className="bg-gray-200 dark:bg-slate-700 w-7 h-7 rounded-full font-bold text-base flex items-center justify-center transition-colors hover:bg-gray-300 dark:hover:bg-slate-600 active:scale-95"
                    aria-label={`Increase quantity of ${item.name}`}
                >
                    +
                </button>
            </div>
        </div>
    );
};


const InventoryView: React.FC<InventoryViewProps> = ({ inventory, onUpdateItem, onOpenAddItem, onOpenDeleteItem }) => {
    const [feedback, setFeedback] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

    const showFeedback = (message: string) => {
        setFeedback({ message, visible: true });
        setTimeout(() => {
            setFeedback(prev => ({ ...prev, visible: false }));
        }, 2500);
    };
    
    const updateQuantity = (id: string, newQuantity: number) => {
        const item = inventory.find(i => i.id === id);
        if (item) {
            onUpdateItem({ ...item, quantity: Math.max(0, newQuantity) });
            showFeedback('Quantity updated.');
        }
    }

    const groupedInventory = inventory.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {} as Record<InventoryCategory, InventoryItem[]>);

    const categories: InventoryCategory[] = ['Fish Feeds', 'Medicines', 'Maintenance'];

    return (
        <div className="animate-fade-in h-full p-2 relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Inventory</h1>
                <button onClick={onOpenAddItem} className="flex items-center space-x-2 bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-3 py-2">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Item</span>
                </button>
            </div>
            
            <div className="space-y-6 pb-20">
                {inventory.length > 0 ? (
                    categories.map(category => (
                        <div key={category}>
                            <h2 className="font-bold text-xl mb-3">{category}</h2>
                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 auto-rows-fr gap-3">
                                {groupedInventory[category]?.length > 0 ? (
                                    groupedInventory[category].map(item => (
                                        <InventoryCard
                                            key={item.id}
                                            item={item}
                                            onUpdateQuantity={(newQuantity) => updateQuantity(item.id, newQuantity)}
                                            onDelete={() => onOpenDeleteItem(item)}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-sm text-gray-400 dark:text-gray-500 py-8 bg-white dark:bg-slate-800/50 rounded-lg">
                                        No items in this category.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                        <p>Your inventory is empty.</p>
                        <p className="text-sm">Tap 'Add Item' to start tracking your supplies!</p>
                    </div>
                )}
            </div>
            {feedback.message && (
                <div 
                    className={`absolute bottom-24 left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out
                                ${feedback.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                >
                    {feedback.message}
                </div>
            )}
        </div>
    );
};

export default InventoryView;