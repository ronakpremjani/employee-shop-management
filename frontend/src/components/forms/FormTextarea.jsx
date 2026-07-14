import React from 'react';

const FormTextarea = React.forwardRef(({
  label,
  name,
  error,
  placeholder,
  rows = 4,
  required = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider select-none">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-zinc-950 border ${
          error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/10' : 'border-zinc-800/80 focus:border-blue-500/60 focus:ring-blue-500/10'
        } rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all shadow-sm resize-y`}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-semibold text-rose-500 animate-fade-in">{error.message || error}</p>
      )}
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
