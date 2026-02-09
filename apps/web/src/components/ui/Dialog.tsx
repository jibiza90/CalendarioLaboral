import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[var(--z-modal)]"
            onClick={() => onOpenChange(false)}
          />
          <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, maxWidth = 'md', children, ...props }, ref) => {
    const maxWidths = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full bg-[var(--color-bg-elevated)] rounded-[var(--radius-lg)]',
          'shadow-[var(--shadow-xl)] overflow-hidden',
          maxWidths[maxWidth],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogContent.displayName = 'DialogContent';

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between',
          'px-6 py-4 border-b border-[var(--color-border-default)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogHeader.displayName = 'DialogHeader';

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'text-lg font-semibold text-[var(--color-text-primary)]',
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

DialogTitle.displayName = 'DialogTitle';

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-sm text-[var(--color-text-secondary)]',
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

DialogDescription.displayName = 'DialogDescription';

export interface DialogBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogBody.displayName = 'DialogBody';

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end gap-3',
          'px-6 py-4 border-t border-[var(--color-border-default)]',
          'bg-[var(--color-bg-secondary)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogFooter.displayName = 'DialogFooter';
