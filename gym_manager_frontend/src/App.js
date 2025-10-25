import React from 'react';
import BootLoader from './boot/BootLoader';
import './App.css';

/**
 * App mounts BootLoader which mounts the Router.
 * Auth is disabled; no additional providers required here.
 */
export default function App() {
  return <BootLoader />;
}
