import React from 'react';

// Component for <select>
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: boolean;
}
export const FormSelect: React.FC<FormSelectProps> = ({
  children,
  placeholder = true,
  className = '',
  ...props
}) => (
  <select
    className={`
      border-b
      border-black 
      focus:outline-none
      text-[28px]
      text-[#192836] 
      ${className}`}
    {...props}
  >
    {children}
  </select>
);

// Component for <option>
interface FormOptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  placeholder?: boolean;
}

export const FormOption: React.FC<FormOptionProps> = ({
  children,
  placeholder = false,
  className = '',
  ...props
}) => (
  <option
    className={`
      text-[28px]
     
    text-[#192836] ${className}`}
    {...props}
  >
    {children}
  </option>
);
