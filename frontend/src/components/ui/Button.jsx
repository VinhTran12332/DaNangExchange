import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = "px-4 py-2 rounded font-medium transition-all active:scale-95 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-primary text-black hover:bg-primary-hover shadow-[0_0_10px_rgba(0,229,153,0.3)]",
        outline: "border border-border-subtle hover:border-text-muted text-text-muted hover:text-text-main",
        ghost: "bg-transparent hover:bg-bg-hover text-text-muted hover:text-text-main"
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};
