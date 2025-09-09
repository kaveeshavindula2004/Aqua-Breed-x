import React from 'react';
import { Fish, InventoryItem } from '../App';

interface FinanceViewProps {
    fishStock: Fish[];
    inventory: InventoryItem[];
}

const FinanceCard: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color}) => (
    <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
);


const FinanceView: React.FC<FinanceViewProps> = ({ fishStock, inventory }) => {
    const totalIncome = fishStock
        .filter(f => f.status === 'Sold' && f.salePrice)
        .reduce((sum, f) => sum + (f.salePrice || 0), 0);

    const totalExpenses = inventory.reduce((sum, item) => sum + item.cost, 0);

    const netProfit = totalIncome - totalExpenses;

    const profitColor = netProfit >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
    
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
    
    // For the graph
    const maxVal = Math.max(totalIncome, totalExpenses, 1);

    return (
        <div className="animate-fade-in h-full p-2">
            <h1 className="text-2xl font-bold mb-6">Profit / Loss</h1>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <FinanceCard label="Total Income" value={formatCurrency(totalIncome)} color="text-green-500 dark:text-green-400" />
                <FinanceCard label="Total Expenses" value={formatCurrency(totalExpenses)} color="text-red-500 dark:text-red-400" />
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg text-center mb-6">
                <p className="text-lg font-semibold">Net Profit</p>
                <p className={`text-4xl font-bold ${profitColor}`}>{formatCurrency(netProfit)}</p>
            </div>
            
             <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4 text-center">Financial Summary</h3>
                <div className="flex justify-around items-end h-40">
                    <div className="flex flex-col items-center">
                        <div className="w-12 bg-green-500 rounded-t" style={{height: `${(totalIncome / maxVal) * 100}%`}}></div>
                        <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">Income</span>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="w-12 bg-red-500 rounded-t" style={{height: `${(totalExpenses / maxVal) * 100}%`}}></div>
                        <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">Expenses</span>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className={`w-12 ${netProfit >= 0 ? 'bg-sky-500' : 'bg-orange-500'} rounded-t`} style={{height: `${(Math.abs(netProfit) / maxVal) * 100}%`}}></div>
                        <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">Net</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FinanceView;