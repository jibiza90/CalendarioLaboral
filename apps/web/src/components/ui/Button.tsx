import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, loading, disabled, children, ...props }, ref) => {
    const baseStyles = [
      'inline-flex items-center justify-center gap-2',
      'font-semibold rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    const variants = {
      primary: [
        'bg-[var(--color-brand-primary)] text-white',
        'hover:opacity-90',
        'focus:ring-[var(--color-brand-primary)]',
      ],
      secondary: [
        'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]',
        'hover:bg-[var(--color-border-hover)]',
        'focus:ring-[var(--color-border-hover)]',
      ],
      ghost: [
        'bg-transparent text-[var(--color-text-secondary)]',
        'hover:bg-[var(--color-bg-tertiary)]',
        'focus:ring-[var(--color-border-default)]',
      ],
      destructive: [
        'bg-[var(--color-error)] text-white',
        'hover:opacity-90',
        'focus:ring-[var(--color-error)]',
      ],
      success: [
        'bg-[var(--color-success)] text-white',
        'hover:opacity-90',
        'focus:ring-[var(--color-success)]',
      ],
      outline: [
        'bg-transparent border-2 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]',
        'hover:bg-[var(--color-brand-primary)] hover:text-white',
        'focus:ring-[var(--color-brand-primary)]',
      ],
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          ...baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
