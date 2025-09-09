
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 shadow-md dark:shadow-none">
      <div className="bg-sky-100 dark:bg-sky-500/10 p-2 rounded-full">
        {icon}
      </div>
      <span className="text-gray-500 dark:text-gray-400 text-xs text-center">{label}</span>
      <span className="text-gray-800 dark:text-white font-bold text-2xl">{value}</span>
    </div>
  );
};

export default StatCard;