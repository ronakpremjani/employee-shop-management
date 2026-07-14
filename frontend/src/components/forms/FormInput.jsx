import React from 'react';

const FormInput = React.forwardRef(({
  label,
  name,
  type = 'text',
  error,
  placeholder,
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full bg-slate-900 border ${
          error ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/5 focus:border-blue-500/50'
        } rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all shadow-inner`}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-rose-500 animate-fade-in">{error.message || error}</p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
