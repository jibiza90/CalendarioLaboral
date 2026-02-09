import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot, children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]',
      primary: 'bg-[var(--color-brand-primary)] text-white',
      success: 'bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success-border)]',
      error: 'bg-[var(--color-error-bg)] text-[var(--color-error)] border border-[var(--color-error-border)]',
      warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning-border)]',
      info: 'bg-[var(--color-info-bg)] text-[var(--color-info)] border border-[var(--color-info-border)]',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span className="w-1.5 h-1.5 rounded-full bg-currentColor" />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
