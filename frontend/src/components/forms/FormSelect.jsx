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
        <label htmlFor={name} className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider select-none">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={name}
        name={name}
        className={`w-full bg-zinc-950 border ${
          error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/10' : 'border-zinc-800/80 focus:border-blue-500/60 focus:ring-blue-500/10'
        } rounded-lg px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-2 transition-all shadow-sm cursor-pointer`}
        {...props}
      >
        {placeholder && <option value="" className="bg-zinc-950 text-zinc-500">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-950 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-[10px] font-semibold text-rose-500 animate-fade-in">{error.message || error}</p>
      )}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

export default FormSelect;
