import React from 'react';
import { View } from '../App';
import { CertificateIcon, ChartIcon, DietPlanIcon, FinanceIcon, InfoIcon, InventoryIcon } from './Icons';

interface DropdownMenuProps {
    onSelect: (view: View) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ onSelect }) => {
    const menuItems: { label: string; view: View; icon: React.FC<{ className?: string }> }[] = [
        { label: 'Certificates', view: 'certificates', icon: CertificateIcon },
        { label: 'Performance', view: 'performance', icon: ChartIcon },
        { label: 'Inventory', view: 'inventory', icon: InventoryIcon },
        { label: 'Diet Plans', view: 'dietPlans', icon: DietPlanIcon },
        { label: 'Profit / Loss', view: 'finance', icon: FinanceIcon },
        { label: 'About', view: 'about', icon: InfoIcon },
    ];

    return (
        <div className="absolute top-16 left-4 w-56 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl z-20 animate-fade-in border border-gray-200 dark:border-slate-700/50">
            <ul className="text-gray-900 dark:text-white divide-y divide-gray-200 dark:divide-slate-700/50">
                {menuItems.map(item => (
                    <li key={item.view}>
                        <button 
                            onClick={() => onSelect(item.view)}
                            className="w-full flex items-center space-x-3 text-left px-4 py-3 text-sm hover:bg-sky-500/10 transition-colors"
                        >
                            <item.icon className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DropdownMenu;