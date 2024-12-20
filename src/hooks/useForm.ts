import { useState } from 'react';
import { z } from 'zod';

export function useForm<T extends z.ZodType>(schema: T) {
  type FormData = z.infer<typeof schema>;
  
  const [data, setData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof FormData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when field is modified
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const validate = (formData: Partial<FormData> = data): formData is FormData => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  return {
    data,
    errors,
    handleChange,
    validate,
    setData,
  };
}