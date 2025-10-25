import React from 'react';
import './App.css';
import Shell from './components/layout/Shell';

// PUBLIC_INTERFACE
function App() {
  /** Root of the app rendering the layout Shell. */
  return (
    <div className="app-root">
      <Shell />
    </div>
  );
}

export default App;
