'use client'

import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption
} from '@headlessui/react';

export interface GroupedSkills {
    title: string;
    skills: string[];
}

interface MultiSelectProps {
    options: GroupedSkills[];
    selected: string[];
    onChange: (vals: string[]) => void;
    placeholder?: string;
    className?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectProps> = ({
    options,
    selected,
    onChange,
    placeholder = 'Select...',
    className = '',
}) => {
    const toggle = (val: string) => {
        if (selected.includes(val)) {
            onChange(selected.filter(s => s !== val));
        } else {
            const totalLength = [...selected, val].join(', ').length;

            if (totalLength > 400) {
                alert('Exceeded 400 character limit - remove something before adding a new item.');
                return;
            }
            onChange([...selected, val]);
        }
    };

    return (
        <Listbox multiple value={selected} onChange={onChange}>
            <div className={`relative ${className}`}>
                <ListboxButton className="
                    w-full 
                    text-left 
                    border-b 
                    border-black 
                    py-1 px-2 
                    text-[28px] 
                    focus:outline-none"
                >
                    {selected.length > 0 ? (
                        <div className="flex flex-col space-y-1">
                            {selected.map(item => (
                                <span key={item}>{item}</span>
                            ))}
                        </div>
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                </ListboxButton>

                <ListboxOptions className="
                    absolute z-10 mt-1 w-full
                    max-h-24          
                    overflow-y-auto  
                 bg-white border border-gray-200 shadow-md"
                >
                    {options.map(group => (
                        <div key={group.title} className='px-2 py-1'>
                            <div className="font-semibold text-[17px] text-gray-600 mb-1">
                                {group.title}
                            </div>
                            {group.skills.map(skill => (
                                <ListboxOption
                                    key={skill}
                                    value={skill}
                                    className='cursor-pointer px-3 py-1 text-[10px] ui-active:bg-blue-100'
                                >
                                    {({ selected }) => (
                                        <div className="
                                            flex 
                                            items-center 
                                            px-3 py-1 
                                            text-[15px] 
                                            cursor-pointer 
                                            ui-active:bg-blue-100"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggle(skill)
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                readOnly
                                                className="mr-2" />
                                            <span>{skill}</span>
                                        </div>
                                    )}
                                </ListboxOption>
                            ))}
                        </div>
                    ))}
                </ListboxOptions>
                <div className="text-right text-[12px] text-gray-500 mt-1">
                    Length: {selected.join(', ').length} / 400 characters
                </div>
            </div>
        </Listbox>
    )
};
