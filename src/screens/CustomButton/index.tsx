import React from 'react';
import { cn } from '@/lib/utils';

type CustomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'outline'
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, variant, className, ...props }) => {
    return (
        <button
            className={cn(
                '!rounded-full !p-3 !px-6 relative overflow-hidden transition-all duration-300 ease-in-out',
                variant === 'outline'
                    ? '!bg-transparent !border !border-[var(--secondary-color)] !text-[var(--secondary-color)] before:absolute before:inset-0 before:!bg-[var(--secondary-color)] before:scale-x-0 before:origin-left before:transition-transform before:duration-300 before:ease-in-out hover:before:scale-x-100 hover:!text-white'
                    : '!bg-[var(--secondary-color)] text-white before:absolute before:inset-0 before:bg-[#EBF1E7] before:scale-x-0 before:origin-left before:transition-transform before:duration-300 before:ease-in-out hover:before:scale-x-100 hover:!text-[var(--secondary-color)]',
                className
            )}
            {...props}
        >
            <span className="relative z-10">{children}</span>
        </button>
    )
}

export default CustomButton;