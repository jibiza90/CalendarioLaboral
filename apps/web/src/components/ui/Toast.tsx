"use client";

import { Toaster, toast } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: 'var(--color-bg-elevated)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          fontSize: '14px',
          fontFamily: 'var(--font-body)',
          boxShadow: 'var(--shadow-lg)',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-success)',
            secondary: 'white',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-error)',
            secondary: 'white',
          },
        },
      }}
    />
  );
}

// Helper functions to show toasts
export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  custom: (message: string) => toast(message),
};

export { toast };
