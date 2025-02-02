import React, { forwardRef } from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  children: React.ReactElement;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({ label, error, children, ...props }, ref) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700">{label}</label>
      {React.cloneElement(children, { ref })}
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
});

export default FormField;