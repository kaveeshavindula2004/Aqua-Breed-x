import React, { useState, useMemo } from 'react';
import { BreedingRecord, Fish } from '../App';

interface PerformanceViewProps {
    breedingRecords: BreedingRecord[];
    fishStock: Fish[];
}

type FilterType = 'monthly' | 'yearly' | 'custom';

const BarChart: React.FC<{ title: string, data: { label: string, value: number, color: string }[] }> = ({ title, data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">{title}</h3>
            <div className="space-y-2">
                {data.map(item => (
                    <div key={item.label} className="flex items-center">
                        <span className="w-24 text-sm text-gray-600 dark:text-gray-300 truncate">{item.label}</span>
                        <div className="flex-grow bg-gray-200 dark:bg-slate-700 rounded-full h-5">
                             <div 
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                                className={`h-full rounded-full ${item.color} flex items-center justify-end pr-2 text-xs font-bold text-white`}
                            >
                                {item.value > 0 ? item.value : ''}
                            </div>
                        </div>
                    </div>
                ))}
                 {data.length === 0 && <p className="text-xs text-gray-500 text-center py-2">No data for this period.</p>}
            </div>
        </div>
    );
}

const PerformanceView: React.FC<PerformanceViewProps> = ({ breedingRecords, fishStock }) => {
    const [filter, setFilter] = useState<FilterType>('monthly');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    const { startDate, endDate } = useMemo(() => {
        let start: Date | null = null;
        let end: Date | null = null;
        const now = new Date();

        if (filter === 'monthly') {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else if (filter === 'yearly') {
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31);
        } else if (filter === 'custom' && customStart && customEnd) {
            start = new Date(customStart);
            end = new Date(customEnd);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return { startDate: null, endDate: null };
            }
        } else {
             return { startDate: null, endDate: null };
        }
        
        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);
        return { startDate: start, endDate: end };
    }, [filter, customStart, customEnd]);

    const filteredBreeding = useMemo(() => {
        if (!startDate || !endDate) return breedingRecords;
        return breedingRecords.filter(r => {
            const pairingDate = new Date(r.pairingDate);
            return pairingDate >= startDate && pairingDate <= endDate;
        });
    }, [breedingRecords, startDate, endDate]);
    
    const breedingChartData = useMemo(() => [
        { label: 'Successful', value: filteredBreeding.filter(r => r.status === 'Successful').length, color: 'bg-green-500' },
        { label: 'Unsuccessful', value: filteredBreeding.filter(r => r.status === 'Unsuccessful').length, color: 'bg-red-500' },
        { label: 'Ongoing', value: filteredBreeding.filter(r => !['Successful', 'Unsuccessful'].includes(r.status)).length, color: 'bg-sky-500' }
    ], [filteredBreeding]);
    
    const fishStatsData = useMemo(() => {
        const sourceFish = fishStock;
        if (!startDate || !endDate) {
            return [
                 { label: 'Fry Bred', value: sourceFish.filter(f => f.origin === 'Bred').length, color: 'bg-purple-500' },
                 { label: 'Fish Sold', value: sourceFish.filter(f => f.status === 'Sold').length, color: 'bg-blue-500' },
                 { label: 'Fish Died', value: sourceFish.filter(f => f.status === 'Dead').length, color: 'bg-gray-500' },
            ];
        }

        const fryBredInPeriod = sourceFish.filter(f => f.origin === 'Bred' && f.dob && new Date(f.dob) >= startDate && new Date(f.dob) <= endDate).length;
        const soldInPeriod = sourceFish.filter(f => f.status === 'Sold' && f.saleDate && new Date(f.saleDate) >= startDate && new Date(f.saleDate) <= endDate).length;
        const diedInPeriod = sourceFish.filter(f => f.status === 'Dead' && f.deathDate && new Date(f.deathDate) >= startDate && new Date(f.deathDate) <= endDate).length;
        
        return [
             { label: 'Fry Bred', value: fryBredInPeriod, color: 'bg-purple-500' },
             { label: 'Fish Sold', value: soldInPeriod, color: 'bg-blue-500' },
             { label: 'Fish Died', value: diedInPeriod, color: 'bg-gray-500' },
        ];
    }, [fishStock, startDate, endDate]);

    return (
        <div className="animate-fade-in h-full p-2">
            <h1 className="text-2xl font-bold mb-4">Performance</h1>

            <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg mb-4">
                <div className="flex justify-between items-center text-sm">
                    <button onClick={() => setFilter('monthly')} className={`px-3 py-1 rounded ${filter === 'monthly' ? 'bg-sky-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-slate-700'}`}>Monthly</button>
                    <button onClick={() => setFilter('yearly')} className={`px-3 py-1 rounded ${filter === 'yearly' ? 'bg-sky-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-slate-700'}`}>Yearly</button>
                    <button onClick={() => setFilter('custom')} className={`px-3 py-1 rounded ${filter === 'custom' ? 'bg-sky-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-slate-700'}`}>Custom</button>
                </div>
                {filter === 'custom' && (
                    <div className="flex space-x-2 mt-2">
                        <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="w-full text-xs bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-2 py-1"/>
                        <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="w-full text-xs bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-2 py-1"/>
                    </div>
                )}
            </div>

            <div className="space-y-4 pb-20">
                <BarChart title="Breeding Outcomes" data={breedingChartData} />
                <BarChart title="Fish Statistics" data={fishStatsData} />
            </div>
        </div>
    );
};

export default PerformanceView;