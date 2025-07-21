import React from 'react';

// Component for <select>
export const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <select
    className={`
      border-b
      border-black 
      focus:outline-none
      text-[22px]
      text-[#192836] 
      ${className}`}
    {...props}
  >
    {children}
  </select>
);

// Component for <option>
export const FormOption: React.FC<React.OptionHTMLAttributes<HTMLOptionElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <option
    className={`
      text-[22px]
    text-[#192836] ${className}`}
    {...props}
  >
    {children}
  </option>
);
