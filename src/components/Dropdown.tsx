import React from 'react'
import { FormSelect, FormOption } from './FormStyles'

interface DropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  className = '',
}) => {
  const isPlaceholder = value === ''

  return (
    <FormSelect
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`
       border-b border-black 
       focus:outline-none
       w-[335px]
        pt-[8px] pb-[8px] pl-[4px]
        ${isPlaceholder
          ? 'text-[#192836]/40'
          : 'text-[#192836]'
        }
        ${className}`}
    >
      <FormOption value="" disabled>
        {placeholder}
      </FormOption>
      {options.map((opt, index) => (
        <FormOption key={`${opt}-${index}`} value={opt}>
          {opt}
        </FormOption>
      ))}
    </FormSelect>
  )
}