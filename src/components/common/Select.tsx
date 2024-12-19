import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ options, error, className = '', ...props }) => {
  return (
    <select
      className={`w-full px-4 py-3 rounded-lg bg-white/50 border ${
        error ? 'border-red-500' : 'border-gray-200'
      } focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all ${className}`}
      {...props}
    >
      <option value="">Seleccionar...</option>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};