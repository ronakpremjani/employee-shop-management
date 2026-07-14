import React from 'react';
import FormInput from './FormInput';

const DatePicker = React.forwardRef(({
  label,
  name,
  error,
  required = false,
  className = '',
  ...props
}, ref) => {
  return (
    <FormInput
      ref={ref}
      label={label}
      name={name}
      type="date"
      error={error}
      required={required}
      className={className}
      {...props}
    />
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
