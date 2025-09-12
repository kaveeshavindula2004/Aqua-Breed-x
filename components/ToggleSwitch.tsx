import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (isChecked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  const handleToggle = () => {
    onChange(!checked);
  };

  return (
    <button
      onClick={handleToggle}
      role="switch"
      aria-checked={checked}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:ring-offset-slate-800 focus:ring-sky-500 ${
        checked ? 'bg-sky-600 dark:bg-sky-500' : 'bg-gray-200 dark:bg-slate-600'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;