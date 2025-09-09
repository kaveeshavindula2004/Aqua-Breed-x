import React, { useState } from 'react';
import { InventoryItem, InventoryCategory } from '../App';
import { PlusIcon, XIcon, TrashIcon } from './Icons';

interface InventoryViewProps {
    inventory: InventoryItem[];
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const AddInventoryItemForm: React.FC<{ onSave: (item: Omit<InventoryItem, 'id'>) => void, onClose: () => void }> = ({ onSave, onClose }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<InventoryCategory>('Fish Feeds');
    const [quantity, setQuantity] = useState(1);
    const [unitCost, setUnitCost] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || quantity <= 0 || unitCost < 0) {
            alert("Please fill out all fields with valid values.");
            return;
        }
        const cost = quantity * unitCost;
        onSave({ name, category, quantity, cost });
    }

    return (
        <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm text-gray-900 dark:text-white p-4 space-y-3 border border-gray-300 dark:border-slate-700">
                <h3 className="text-lg font-bold">Add New Item</h3>
                <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm mt-1"/>
                </div>
                <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value as InventoryCategory)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm mt-1">
                        <option>Fish Feeds</option>
                        <option>Medicines</option>
                        <option>Maintenance</option>
                    </select>
                </div>
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <label className="text-xs text-gray-600 dark:text-gray-400">Quantity</label>
                        <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} min="1" className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm mt-1"/>
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-gray-600 dark:text-gray-400">Unit Cost ($)</label>
                        <input type="number" value={unitCost} onChange={e => setUnitCost(parseFloat(e.target.value) || 0)} min="0" step="0.01" className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm mt-1"/>
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
}

const ConfirmationDialog: React.FC<{ item: InventoryItem; onConfirm: () => void; onCancel: () => void; }> = ({ item, onConfirm, onCancel }) => (
    <div className="absolute inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm text-gray-900 dark:text-white p-6 space-y-4 border border-gray-300 dark:border-slate-700 text-center shadow-lg">
            <h3 className="text-xl font-bold">Confirm Deletion</h3>
            <p className="text-gray-600 dark:text-gray-300">Are you sure you want to permanently delete <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>? This action cannot be undone.</p>
            <div className="flex justify-center space-x-4 pt-2">
                <button onClick={onCancel} className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">Cancel</button>
                <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">Delete</button>
            </div>
        </div>
    </div>
);


const InventoryView: React.FC<InventoryViewProps> = ({ inventory, setInventory }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
    const [feedback, setFeedback] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

    const showFeedback = (message: string) => {
        setFeedback({ message, visible: true });
        setTimeout(() => {
            setFeedback(prev => ({ ...prev, visible: false }));
        }, 2500);
    };

    const handleAddItem = (item: Omit<InventoryItem, 'id'>) => {
        const newItem = { ...item, id: `item-${Date.now()}`};
        setInventory(prev => [...prev, newItem]);
        setIsAdding(false);
        showFeedback(`${item.name} added successfully!`);
    }
    
    const updateQuantity = (id: string, newQuantity: number) => {
        setInventory(prev => prev.map(item => item.id === id ? {...item, quantity: Math.max(0, newQuantity)} : item));
        showFeedback('Quantity updated.');
    }

    const handleDeleteClick = (item: InventoryItem) => {
        setItemToDelete(item);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setInventory(prev => prev.filter(item => item.id !== itemToDelete.id));
            showFeedback(`${itemToDelete.name} deleted.`);
            setItemToDelete(null);
        }
    };

    const cancelDelete = () => {
        setItemToDelete(null);
    };

    const groupedInventory = inventory.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {} as Record<InventoryCategory, InventoryItem[]>);

    const categories: InventoryCategory[] = ['Fish Feeds', 'Medicines', 'Maintenance'];

    return (
        <div className="animate-fade-in h-full p-2 relative">
            {isAdding && <AddInventoryItemForm onSave={handleAddItem} onClose={() => setIsAdding(false)}/>}
            {itemToDelete && <ConfirmationDialog item={itemToDelete} onConfirm={confirmDelete} onCancel={cancelDelete} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Inventory</h1>
                <button onClick={() => setIsAdding(true)} className="flex items-center space-x-2 bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-3 py-2">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Item</span>
                </button>
            </div>
            
            <div className="space-y-4 pb-20">
                {categories.map(category => (
                    <div key={category}>
                        <h2 className="font-bold text-lg mb-2">{category}</h2>
                        <div className="bg-white dark:bg-slate-800/50 rounded-lg p-3 space-y-2">
                            {groupedInventory[category]?.length > 0 ? (
                                groupedInventory[category].map(item => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <span className={item.quantity <= 0 ? 'text-red-500 dark:text-red-400 font-semibold' : ''}>{item.name}</span>
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-gray-200 dark:bg-slate-700 w-6 h-6 rounded font-bold">-</button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-gray-200 dark:bg-slate-700 w-6 h-6 rounded font-bold">+</button>
                                            <button onClick={() => handleDeleteClick(item)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-2">No items in this category.</p>
                            )}
                        </div>
                    </div>
                ))}
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