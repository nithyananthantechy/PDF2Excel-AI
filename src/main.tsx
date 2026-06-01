import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silence benign Vite HMR / WebSocket connection logs and rejections in the sandbox environment
if (typeof window !== 'undefined') {
  const isViteWSError = (err: any) => {
    if (!err) return false;
    try {
      const message = String(err.message || err.reason || err.stack || err).toLowerCase();
      const strVal = String(err).toLowerCase();
      return message.includes('[vite]') || 
             message.includes('websocket') || 
             message.includes('web-socket') || 
             message.includes('wss://') || 
             message.includes('ws://') || 
             message.includes('closed without opened') ||
             strVal.includes('[vite]') ||
             strVal.includes('websocket') ||
             strVal.includes('web-socket') ||
             strVal.includes('closed without opened');
    } catch {
      return false;
    }
  };

  // Intercept all main console logging channels to filter out Vite WebSocket errors
  const originalError = console.error;
  console.error = function(...args) {
    if (args.some(arg => isViteWSError(arg))) return;
    originalError.apply(console, args);
  };

  const originalWarn = console.warn;
  console.warn = function(...args) {
    if (args.some(arg => isViteWSError(arg))) return;
    originalWarn.apply(console, args);
  };

  const originalDebug = console.debug;
  console.debug = function(...args) {
    if (args.some(arg => isViteWSError(arg))) return;
    originalDebug.apply(console, args);
  };

  const originalLog = console.log;
  console.log = function(...args) {
    if (args.some(arg => isViteWSError(arg))) return;
    originalLog.apply(console, args);
  };

  // Capture global window errors to prevent reporting (capturing phase)
  window.addEventListener('error', (event) => {
    if (isViteWSError(event.error) || isViteWSError(event.message)) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  }, true);

  // Capture global window errors to prevent reporting (bubbling phase)
  window.addEventListener('error', (event) => {
    if (isViteWSError(event.error) || isViteWSError(event.message)) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  }, false);

  // Capture unhandled promise rejections (capturing phase)
  window.addEventListener('unhandledrejection', (event) => {
    if (isViteWSError(event.reason) || isViteWSError(event.reason?.message)) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  }, true);

  // Capture unhandled promise rejections (bubbling phase)
  window.addEventListener('unhandledrejection', (event) => {
    if (isViteWSError(event.reason) || isViteWSError(event.reason?.message)) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  }, false);

  // Direct assigning of onerror and onunhandledrejection
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (isViteWSError(message) || isViteWSError(error)) {
      return true; // Prevents the firing of the default event handler
    }
    if (originalOnError) {
      return originalOnError.apply(window, arguments as any);
    }
    return false;
  };

  const originalOnUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = function(event) {
    if (isViteWSError(event.reason) || isViteWSError(event.reason?.message)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return true;
    }
    if (originalOnUnhandledRejection) {
      return originalOnUnhandledRejection.apply(window, arguments as any);
    }
    return false;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

