import React, { useState } from 'react';
import { Fish } from '../App';
import { XIcon, ParentFishIcon } from './Icons';

interface SelectFishForCertificateFormProps {
    eligibleFish: Fish[];
    onClose: () => void;
    onConfirm: (fishId: string, price: number) => void;
}

const SelectFishForCertificateForm: React.FC<SelectFishForCertificateFormProps> = ({ eligibleFish, onClose, onConfirm }) => {
    const [selectedFish, setSelectedFish] = useState<Fish | null>(null);
    const [salePrice, setSalePrice] = useState('');

    const handleConfirmClick = () => {
        const price = parseFloat(salePrice);
        if (selectedFish && !isNaN(price) && price >= 0) {
            onConfirm(selectedFish.id, price);
        } else {
            alert('Please enter a valid, non-negative price.');
        }
    };

    if (selectedFish) {
        return (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm text-gray-900 dark:text-white p-6 space-y-4 border border-gray-300 dark:border-slate-700 text-center shadow-lg">
                    <h3 className="text-xl font-bold">Set Sale Price</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Set the final sale price for <span className="font-semibold text-gray-900 dark:text-white">{selectedFish.nickname || selectedFish.id}</span>. This will mark the fish as 'Sold'.
                    </p>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                            type="number"
                            value={salePrice}
                            onChange={e => setSalePrice(e.target.value)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 pl-7 text-center text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-center space-x-4 pt-2">
                        <button onClick={() => setSelectedFish(null)} className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">Back</button>
                        <button onClick={handleConfirmClick} className="bg-gradient-to-br from-sky-500 to-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md hover:shadow-lg">Confirm & Generate</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm max-h-[90vh] text-gray-900 dark:text-white shadow-lg border border-gray-300 dark:border-slate-700 flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold">Select Fish for Certificate</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>

                <div className="p-4 space-y-2 overflow-y-auto">
                    {eligibleFish.length > 0 ? (
                        eligibleFish.map(fish => (
                            <button
                                key={fish.id}
                                onClick={() => setSelectedFish(fish)}
                                className="w-full flex items-center space-x-3 p-2 bg-gray-100 dark:bg-slate-800/50 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors text-left"
                            >
                                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-md flex-shrink-0 overflow-hidden">
                                    {fish.photo ? (
                                        <img src={fish.photo} alt={fish.nickname || fish.id} className="w-full h-full object-cover" />
                                    ) : (
                                        <ParentFishIcon className="w-full h-full p-2 text-gray-400 dark:text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold">{fish.nickname || fish.id}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{fish.species}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                            <p>No eligible fish available.</p>
                            <p className="text-sm">Only 'Active' fish can be selected to generate a new certificate.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelectFishForCertificateForm;