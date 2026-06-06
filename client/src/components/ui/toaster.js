import React from 'react';
import { Toaster as Sonner, toast } from 'sonner';
import { useTheme } from '../theme-provider';

/**
 * App-wide toast host. Replaces MUI Snackbar / native alert() calls.
 */
export function Toaster() {
  const { resolved } = useTheme();
  return (
    <Sonner
      theme={resolved}
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'rounded-xl border border-border shadow-pop font-sans text-sm',
        },
      }}
    />
  );
}

export { toast };
