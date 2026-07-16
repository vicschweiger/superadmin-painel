import React from 'react';

interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, enabled, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer group">
    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{label}</span>
    <div className="relative flex items-center">
      <input 
        type="checkbox" 
        className="sr-only" 
        checked={enabled} 
        onChange={(e) => onChange(e.target.checked)} 
      />
      <div className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${enabled ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
      <div className={`absolute left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out shadow-sm ${enabled ? 'transform translate-x-6' : ''}`}></div>
    </div>
  </label>
);