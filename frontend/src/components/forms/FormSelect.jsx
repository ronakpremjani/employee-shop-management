import React from 'react';

const FormSelect = React.forwardRef(({
  label,
  name,
  options = [],
  error,
  required = false,
  className = '',
  placeholder = 'Select option...',
  ...props
}, ref) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={name}
        name={name}
        className={`w-full bg-slate-900 border ${
          error ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/5 focus:border-blue-500/50'
        } rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-all shadow-inner cursor-pointer`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs font-medium text-rose-500 animate-fade-in">{error.message || error}</p>
      )}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

export default FormSelect;
