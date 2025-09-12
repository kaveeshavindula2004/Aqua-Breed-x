import React, { useState } from 'react';
import { InventoryItem, InventoryCategory } from '../App';
import { PlusIcon, XIcon, TrashIcon, CameraIcon, InventoryIcon } from './Icons';

interface InventoryViewProps {
    inventory: InventoryItem[];
    onAddItem: (item: Omit<InventoryItem, 'id' | 'purchaseDate'>) => void;
    onUpdateItem: (item: InventoryItem) => void;
    onDeleteItem: (itemId: string) => void;
}

const AddInventoryItemForm: React.FC<{ onSave: (item: Omit<InventoryItem, 'id' | 'purchaseDate'>) => void, onClose: () => void }> = ({ onSave, onClose }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<InventoryCategory>('Fish Feeds');
    const [quantity, setQuantity] = useState(1);
    const [unitCost, setUnitCost] = useState(0);
    const [photo, setPhoto] = useState<string | undefined>();

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
        if(!name || quantity <= 0 || unitCost < 0) {
            alert("Please fill out all fields with valid values.");
            return;
        }
        const cost = quantity * unitCost;
        onSave({ name, category, quantity, cost, photo });
    }

    return (
        <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold">Add New Item</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-gray-200 dark:bg-slate-800 rounded-lg relative group">
                            <input type="file" id="item-photo-upload" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} />
                            <label htmlFor="item-photo-upload" className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 cursor-pointer">
                                {photo ? (
                                    <img src={photo} alt="Item preview" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <>
                                        <CameraIcon className="w-8 h-8" />
                                        <span className="text-xs mt-1">Add Photo</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm mt-1 border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value as InventoryCategory)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm mt-1 border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none">
                            <option>Fish Feeds</option>
                            <option>Medicines</option>
                            <option>Maintenance</option>
                        </select>
                    </div>
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Quantity</label>
                            <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} min="1" className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm mt-1 border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none"/>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Unit Cost ($)</label>
                            <input type="number" value={unitCost} onChange={e => setUnitCost(parseFloat(e.target.value) || 0)} min="0" step="0.01" className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm mt-1 border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none"/>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
                        <button type="submit" className="bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-6 py-2 shadow-md transition-all active:scale-95 hover:shadow-lg">Save</button>
                    </div>
                </form>
            </div>
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


const InventoryCard: React.FC<{
    item: InventoryItem;
    onUpdateQuantity: (newQuantity: number) => void;
    onDelete: () => void;
}> = ({ item, onUpdateQuantity, onDelete }) => {
    return (
        <div className="bg-white dark:bg-slate-800/50 p-3 rounded-xl flex flex-col h-full text-left relative transition-colors shadow-sm">
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
                    <div className="w-full h-full flex items-center justify-center p-4">
                        <InventoryIcon className="w-full h-full text-gray-400 dark:text-gray-500" />
                    </div>
                )}
            </div>

            <div className="px-1 flex-grow">
                <p className={`font-bold truncate text-sm ${item.quantity <= 0 ? 'text-red-500 dark:text-red-400' : ''}`}>{item.name}</p>
            </div>
            
            <div className="flex items-center justify-center space-x-3 mt-2">
                <button
                    onClick={() => onUpdateQuantity(item.quantity - 1)}
                    className="bg-gray-200 dark:bg-slate-700 w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center transition-colors hover:bg-gray-300 dark:hover:bg-slate-600 active:scale-95 disabled:opacity-50"
                    disabled={item.quantity <= 0}
                    aria-label={`Decrease quantity of ${item.name}`}
                >
                    -
                </button>
                <span className="w-10 text-center font-semibold text-lg tabular-nums">{item.quantity}</span>
                <button
                    onClick={() => onUpdateQuantity(item.quantity + 1)}
                    className="bg-gray-200 dark:bg-slate-700 w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center transition-colors hover:bg-gray-300 dark:hover:bg-slate-600 active:scale-95"
                    aria-label={`Increase quantity of ${item.name}`}
                >
                    +
                </button>
            </div>
        </div>
    );
};


const InventoryView: React.FC<InventoryViewProps> = ({ inventory, onAddItem, onUpdateItem, onDeleteItem }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
    const [feedback, setFeedback] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

    const showFeedback = (message: string) => {
        setFeedback({ message, visible: true });
        setTimeout(() => {
            setFeedback(prev => ({ ...prev, visible: false }));
        }, 2500);
    };

    const handleAddItem = (item: Omit<InventoryItem, 'id' | 'purchaseDate'>) => {
        onAddItem(item);
        setIsAdding(false);
        showFeedback(`${item.name} added successfully!`);
    }
    
    const updateQuantity = (id: string, newQuantity: number) => {
        const item = inventory.find(i => i.id === id);
        if (item) {
            onUpdateItem({ ...item, quantity: Math.max(0, newQuantity) });
            showFeedback('Quantity updated.');
        }
    }

    const handleDeleteClick = (item: InventoryItem) => {
        setItemToDelete(item);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            onDeleteItem(itemToDelete.id);
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
            
            <div className="space-y-6 pb-20">
                {inventory.length > 0 ? (
                    categories.map(category => (
                        <div key={category}>
                            <h2 className="font-bold text-xl mb-3">{category}</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-fr gap-3">
                                {groupedInventory[category]?.length > 0 ? (
                                    groupedInventory[category].map(item => (
                                        <InventoryCard
                                            key={item.id}
                                            item={item}
                                            onUpdateQuantity={(newQuantity) => updateQuantity(item.id, newQuantity)}
                                            onDelete={() => handleDeleteClick(item)}
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