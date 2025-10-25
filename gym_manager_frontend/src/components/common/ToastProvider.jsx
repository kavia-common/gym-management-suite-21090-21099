import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Snackbar from './Snackbar';

/**
 * A minimal global toast/notification provider.
 * Uses the existing Snackbar component and exposes showToast() via context.
 */

const ToastContext = createContext({
  // PUBLIC_INTERFACE
  showToast: (_msg, _variant = 'info', _duration = 3000) => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('info');
  const [duration, setDuration] = useState(3000);

  // PUBLIC_INTERFACE
  const showToast = useCallback((msg, type = 'info', ms = 3000) => {
    setMessage(typeof msg === 'string' ? msg : String(msg));
    setVariant(type);
    setDuration(ms);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        message={message}
        variant={variant}
        duration={duration}
        onClose={() => setOpen(false)}
      />
    </ToastContext.Provider>
  );
}
