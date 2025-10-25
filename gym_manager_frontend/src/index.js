import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './theme/global.css';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastProvider } from './components/common/ToastProvider';
import BootLoader from './boot/BootLoader';

// Optional React Router future flags to reduce warnings; safe no-op if unused
window.__reactRouterFuture = {
  v7_fetcherPersist: true,
  v7_relativeSplatPath: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true,
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary hardReloadOnRetry>
      <ToastProvider>
        <BootLoader />
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
