import React, { useState, useMemo } from 'react';
import { Fish, InventoryItem } from '../App';
import { useTheme } from '../contexts/ThemeContext';

type FilterType = 'weekly' | 'monthly' | 'yearly' | 'custom';
interface ChartDataPoint {
    date: string;
    income: number;
    expenses: number;
    net: number;
}

const FinanceCard: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color}) => (
    <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
);

const LineChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
    const { theme } = useTheme();
    const WIDTH = 500;
    const HEIGHT = 250;
    const PADDING = 30;

    const { yMin, yMax, points } = useMemo(() => {
        if (data.length === 0) return { yMin: 0, yMax: 100, points: { income: '', expenses: '', net: '' } };

        const allValues = data.flatMap(d => [d.income, d.expenses, d.net]);
        let yMin = Math.min(...allValues);
        let yMax = Math.max(...allValues);
        
        if (yMin === yMax) {
            yMin -= 50;
            yMax += 50;
        }

        const yRange = yMax - yMin;
        yMin -= yRange * 0.1;
        yMax += yRange * 0.1;
        if (yMax < 0) yMax = 0;

        const getCoords = (val: number) => {
            const y = HEIGHT - PADDING - ((val - yMin) / (yMax - yMin)) * (HEIGHT - PADDING * 2);
            return isNaN(y) ? HEIGHT - PADDING : y;
        }

        const toPoints = (key: keyof Omit<ChartDataPoint, 'date'>) => 
            data.map((d, i) => `${PADDING + i * (WIDTH - PADDING * 2) / (data.length - 1)},${getCoords(d[key])}`).join(' ');

        return {
            yMin,
            yMax,
            points: { income: toPoints('income'), expenses: toPoints('expenses'), net: toPoints('net') }
        };
    }, [data]);

    const yAxisLabels = useMemo(() => {
        const labels = [];
        for (let i = 0; i <= 4; i++) {
            labels.push(yMin + (i/4) * (yMax - yMin));
        }
        return labels;
    }, [yMin, yMax]);

    return (
        <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-center">Financial Report</h3>
            <div className="flex justify-center space-x-4 text-xs mb-4">
                <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>Income</span>
                <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div>Expenses</span>
                <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-sky-500 mr-1.5"></div>Net Profit</span>
            </div>
            {data.length > 1 ? (
                <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
                    {/* Y-Axis Grid Lines & Labels */}
                    {yAxisLabels.map((label, i) => {
                        const y = HEIGHT - PADDING - (i/4) * (HEIGHT - PADDING * 2);
                        return (
                           <g key={i}>
                                <line x1={PADDING} y1={y} x2={WIDTH - PADDING} y2={y} stroke={theme === 'dark' ? '#334155' : '#e5e7eb'} strokeWidth="1" />
                                <text x={PADDING - 5} y={y + 3} fill={theme === 'dark' ? '#94a3b8' : '#6b7280'} textAnchor="end" fontSize="10">{Math.round(label)}</text>
                           </g>
                        );
                    })}
                     <line x1={PADDING} y1={HEIGHT - PADDING} x2={WIDTH - PADDING} y2={HEIGHT-PADDING} stroke={theme === 'dark' ? '#475569' : '#d1d5db'} strokeWidth="1" />

                    {/* Lines */}
                    <polyline fill="none" stroke="#22c55e" strokeWidth="2" points={points.income} />
                    <polyline fill="none" stroke="#ef4444" strokeWidth="2" points={points.expenses} />
                    <polyline fill="none" stroke="#0ea5e9" strokeWidth="2.5" points={points.net} />
                </svg>
            ) : (
                <div className="h-[250px] flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                    Not enough data to display a chart for this period.
                </div>
            )}
        </div>
    );
};

const FinanceView: React.FC<{ fishStock: Fish[]; inventory: InventoryItem[] }> = ({ fishStock, inventory }) => {
    const [filter, setFilter] = useState<FilterType>('monthly');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    const { startDate, endDate } = useMemo(() => {
        const now = new Date();
        let start = new Date();
        let end = new Date();
        now.setHours(0,0,0,0);
        
        switch (filter) {
            case 'weekly':
                start = new Date(now.setDate(now.getDate() - now.getDay()));
                end = new Date(now.setDate(now.getDate() - now.getDay() + 6));
                break;
            case 'monthly':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'yearly':
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date(now.getFullYear(), 11, 31);
                break;
            case 'custom':
                if (customStart && customEnd) {
                    start = new Date(customStart);
                    end = new Date(customEnd);
                }
                break;
        }
        end.setHours(23, 59, 59, 999);
        return { startDate: start, endDate: end };
    }, [filter, customStart, customEnd]);

    const { chartData, totalIncome, totalExpenses } = useMemo(() => {
        const dailyData = new Map<string, { income: number; expenses: number }>();
        
        fishStock.forEach(fish => {
            if (fish.status === 'Sold' && fish.salePrice && fish.saleDate) {
                const saleDate = new Date(fish.saleDate);
                if (saleDate >= startDate && saleDate <= endDate) {
                    const dateStr = fish.saleDate;
                    const day = dailyData.get(dateStr) || { income: 0, expenses: 0 };
                    day.income += fish.salePrice;
                    dailyData.set(dateStr, day);
                }
            }
        });
        
        inventory.forEach(item => {
            if (item.purchaseDate) {
                 const purchaseDate = new Date(item.purchaseDate);
                 if (purchaseDate >= startDate && purchaseDate <= endDate) {
                     const dateStr = item.purchaseDate;
                     const day = dailyData.get(dateStr) || { income: 0, expenses: 0 };
                     day.expenses += item.cost;
                     dailyData.set(dateStr, day);
                 }
            }
        });

        const data: ChartDataPoint[] = [];
        let cumulativeNet = 0;
        let periodIncome = 0;
        let periodExpenses = 0;
        
        if (startDate && endDate && startDate <= endDate) {
             for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                const dayData = dailyData.get(dateStr) || { income: 0, expenses: 0 };
                cumulativeNet += dayData.income - dayData.expenses;
                periodIncome += dayData.income;
                periodExpenses += dayData.expenses;
                data.push({ date: dateStr, ...dayData, net: cumulativeNet });
            }
        }

        return { chartData: data, totalIncome: periodIncome, totalExpenses: periodExpenses };
    }, [fishStock, inventory, startDate, endDate]);

    const netProfit = totalIncome - totalExpenses;
    const profitColor = netProfit >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

    return (
        <div className="animate-fade-in h-full p-2 pb-20">
            <h1 className="text-2xl font-bold mb-4">Profit / Loss</h1>
            
            <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg mb-4">
                <div className="flex justify-between items-center text-sm">
                    {(['weekly', 'monthly', 'yearly', 'custom'] as FilterType[]).map(f => (
                         <button key={f} onClick={() => setFilter(f)} className={`capitalize flex-1 px-3 py-1 rounded-md transition-colors ${filter === f ? 'bg-sky-600 text-white font-semibold' : 'hover:bg-gray-200 dark:hover:bg-slate-700'}`}>{f}</button>
                    ))}
                </div>
                 {filter === 'custom' && (
                    <div className="flex space-x-2 mt-2">
                        <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="w-full text-xs bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-2 py-1"/>
                        <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="w-full text-xs bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-2 py-1"/>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <FinanceCard label="Income" value={formatCurrency(totalIncome)} color="text-green-500 dark:text-green-400" />
                <FinanceCard label="Expenses" value={formatCurrency(totalExpenses)} color="text-red-500 dark:text-red-400" />
                 <FinanceCard label="Net Profit" value={formatCurrency(netProfit)} color={profitColor} />
            </div>

            <LineChart data={chartData} />
        </div>
    );
};

export default FinanceView;