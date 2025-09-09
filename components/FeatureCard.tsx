import React from 'react';

// FIX: Changed icon prop type to React.ReactElement<{ className?: string }> to ensure it's a clonable element
// that accepts a className prop, which is required by React.cloneElement. This resolves the type error.
interface FeatureCardProps {
  icon: React.ReactElement<{ className?: string }>;
  label: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, label, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="bg-white dark:bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 p-4 rounded-2xl flex flex-col items-center justify-center space-y-3 aspect-square shadow-lg dark:shadow-none text-left w-full transition-transform active:scale-95"
    >
      <div className="dark:hidden bg-sky-100 p-3 rounded-full">{React.cloneElement(icon, { className: "w-8 h-8 text-sky-600" })}</div>
      <div className="hidden dark:block">{icon}</div>
      <span className="text-gray-800 dark:text-white font-semibold text-center text-sm">{label}</span>
    </button>
  );
};

export default FeatureCard;