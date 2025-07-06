import React, { forwardRef } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ChevronDown } from 'lucide-react';

interface DatePickerFieldProps {
    placeholderText: string
    selected: Date | null
    onChange: (date: Date | null) => void
    className?: string
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
    placeholderText,
    selected,
    onChange,
    className = '',
}) => (
    <div className={`${className}`}>
        <DatePicker
            selected={selected}
            onChange={onChange}
            dateFormat="dd/MM/yyyy"
            placeholderText={placeholderText}
            className="w-[321px] pl-[8px] pt-[6px] pb-[6px]"
            customInput={
                <CustomDateInput placeholder={placeholderText} />
            }
            showPopperArrow={false}
        />
    </div>
)

interface CustomInputProps {
    value?: string
    onClick?: () => void
    placeholder: string
    className?: string
}

const CustomDateInput = forwardRef<HTMLDivElement, CustomInputProps>(
    ({ value, onClick, placeholder, className = '' }, ref) => (
        <div
            ref={ref}
            onClick={onClick}
            className={`
                relative flex 
                border-b 
                text-[28px] text-[#192836] 
                cursor-pointer select-none
                ${className}
            `}
        >
            {/* If data does not choice - show placeholder */}
            <span className={`${value ? 'opacity-100' : 'opacity-40'}`}>
                {value || placeholder}
            </span>

            <ChevronDown className="absolute right-2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
    )
)
CustomDateInput.displayName = 'CustomDateInput'