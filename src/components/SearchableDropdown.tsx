'use client';
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { useState } from 'react';

interface Intern {
  full_name: string;
  position_name: string;
}

interface Props {
  options: Intern[];
  value: Intern | null;
  onChange: (val: Intern) => void;
  onSearch?: (query: string) => void; 
  placeholder?: string;
  className?: string;
}

export const SearchableDropdown = ({
  options,
  value,
  onChange,
  onSearch,
  placeholder = '',
  className = '',
}: Props) => {
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.full_name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox value={value} onChange={onChange}>
      <div className={`relative ${className}`}>
        <ComboboxInput
          className="
            border-b 
           border-black 
            focus:outline-none 
            w-full 
            py-1 px-2 
            text-[22px]"
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            onSearch?.(value); 
          }}
          displayValue={(intern: Intern) => intern?.full_name || ''}
          placeholder={placeholder}
        />
        {filteredOptions.length > 0 && (
          <ComboboxOptions className="
            absolute z-10 max-h-60 
            overflow-y-auto 
            bg-white border 
            border-gray-200 
            shadow-md"
          >
            {filteredOptions.map((intern, index) => (
              <ComboboxOption
                key={`${intern.full_name}-${index}`}
                value={intern}
                className={({ active }) =>
                  `cursor-pointer px-3 py-1 text-[22px] ${
                    active ? 'bg-blue-100' : ''
                  }`
                }
              >
                {intern.full_name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
};
