import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ error, className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full px-4 py-3 rounded-lg bg-white/50 border ${
        error ? 'border-red-500' : 'border-gray-200'
      } focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all ${className}`}
      {...props}
    />
  );
});

export default Input;