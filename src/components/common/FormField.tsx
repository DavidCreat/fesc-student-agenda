import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  children: React.ReactElement;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({ label, error, children, ...props }, ref) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      {React.cloneElement(children, { ref })}
      <AnimatePresence mode="wait">
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm mt-1 block"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
});

FormField.displayName = 'FormField';
export default FormField;