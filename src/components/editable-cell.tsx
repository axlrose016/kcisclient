import React, { ReactNode, useMemo, useRef } from 'react';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import debounce from "lodash.debounce";

interface EditableCellProps {
    disabled?: boolean;
    placeholder?: string;
    value: string;
    onDebouncedChange: (value: string) => void;
    className?: string;
    element?: ReactNode;
}

export const EditableCell: React.FC<EditableCellProps> = ({ 
    disabled = false, 
    value, 
    onDebouncedChange, 
    className = cn(
        "align-top border-r p-1 w-full px-2 py-1 h-full bg-blue-100/40 ring-0",
        "focus:outline-none focus:ring-1"
    ), 
    placeholder = "", 
    element 
}) => {
    const divRef = useRef<HTMLDivElement>(null);

    const debouncedChange = useMemo(
        () =>
            debounce((text: string) => {
                onDebouncedChange(text);
            }, 900),
        [onDebouncedChange]
    );

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        debouncedChange(e.currentTarget.innerText || "");
    };

    return (
        <TableCell className={className}>
            <div className='flex items-center'>
                <div 
                    className='flex-1' 
                    id="editable"
                    contentEditable={disabled}
                    suppressContentEditableWarning
                    onInput={handleInput}
                    data-placeholder={placeholder}
                >
                    {value}
                </div>
                {element}
            </div>
        </TableCell>
    );
}; 