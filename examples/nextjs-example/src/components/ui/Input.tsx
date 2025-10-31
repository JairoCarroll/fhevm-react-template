/**
 * Input Component
 * Reusable input component with label and error handling
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = 'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors';
  const normalStyles = 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  const errorStyles = 'border-red-500 focus:ring-red-500 focus:border-red-500';

  const combinedClassName = `
    ${baseStyles}
    ${error ? errorStyles : normalStyles}
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={combinedClassName}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
