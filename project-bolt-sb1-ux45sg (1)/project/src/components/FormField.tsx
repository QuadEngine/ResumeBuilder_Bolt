import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

type FormFieldProps = {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  rows?: number;
  validation?: Record<string, any>;
};

export default function FormField({
  label,
  name,
  register,
  error,
  type = 'text',
  required = false,
  rows = 3,
  validation = {}
}: FormFieldProps) {
  const inputProps = {
    ...register(name, {
      required: required ? `${label} is required` : false,
      ...validation
    }),
    className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {type === 'textarea' ? (
        <textarea {...inputProps} rows={rows} />
      ) : (
        <input {...inputProps} type={type} />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}