import React from 'react';
import { type FieldError } from 'react-hook-form';
import clsx from 'clsx';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: FieldError;
  register: any; // From React Hook Form
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  register,
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={clsx('mb-4', className)}>
      {/* Label */}
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Field */}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
        className={clsx(
          // Base styles
          'w-full px-3 py-2 border rounded-lg shadow-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          // Normal state
          !error && 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
          // Error state
          error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
          // Disabled state
          disabled && 'bg-gray-100 cursor-not-allowed'
        )}
      />

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormField;
