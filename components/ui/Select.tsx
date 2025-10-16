import { forwardRef } from 'react';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  label?: string;
  helpText?: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      name,
      value,
      onChange,
      onBlur,
      required = false,
      disabled = false,
      error,
      label,
      helpText,
      placeholder = 'Select an option...',
      options,
      className = '',
    },
    ref
  ) => {
    const selectId = id || name;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          className={`
          w-full px-4 py-2 border rounded-md text-gray-900
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : helpText ? (
          <p className="text-sm text-gray-500">{helpText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;

