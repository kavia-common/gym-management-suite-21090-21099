import React from 'react';

/**
 * ErrorBoundary component to catch render and runtime errors in descendants.
 * Renders a minimal fallback with a retry option to reload the app.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // PUBLIC_INTERFACE
  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Avoid noisy logs; guard against extension-related or circular structures
    try {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('[ErrorBoundary] Caught error', error, info);
      }
    } catch {
      // no-op
    }
  }

  // PUBLIC_INTERFACE
  handleRetry = () => {
    // Soft reset boundary state; if the root cause persists, full reload is offered.
    this.setState({ hasError: false, error: null });
    // Optionally, force a hard reload to reset runtime state
    if (this.props.hardReloadOnRetry) {
      try {
        window.location.assign(window.location.href);
      } catch {
        // Fallback to reload in case assign is blocked
        window.location.reload();
      }
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#f9fafb',
          padding: '2rem'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '24px',
            maxWidth: 480,
            width: '100%',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
          }}>
            <h1 style={{ margin: '0 0 8px', fontSize: 20, color: '#111827' }}>
              Something went wrong
            </h1>
            <p style={{ margin: '0 0 16px', color: '#6b7280' }}>
              An unexpected error occurred. You can retry loading the application.
            </p>
            {process.env.NODE_ENV !== 'production' && this.state.error ? (
              <pre style={{
                background: '#f3f4f6',
                color: '#374151',
                padding: '12px',
                borderRadius: 8,
                overflow: 'auto',
                maxHeight: 160,
                marginBottom: 16
              }}>
                {String(this.state.error?.message || this.state.error)}
              </pre>
            ) : null}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={this.handleRetry}
                style={{
                  padding: '10px 14px',
                  background: '#2563EB',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 14px',
                  background: '#111827',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
