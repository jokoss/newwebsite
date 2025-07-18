import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/utils/ScrollToTop';
import ErrorBoundary from './components/utils/ErrorBoundary';

// Initialize error tracking as early as possible
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    // You could send this to a logging service
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise rejection:', event.reason);
    // You could send this to a logging service
  });
}

// Function to determine if we should use HashRouter or BrowserRouter
// HashRouter is more reliable in some deployment environments
const shouldUseHashRouter = () => {
  // Check if we're in a production environment
  if (process.env.NODE_ENV === 'production') {
    // Check if we're on Render or similar platform that might have routing issues
    if (typeof window !== 'undefined') {
      const { hostname } = window.location;
      if (hostname.includes('render.com') || hostname.includes('onrender.com')) {
        console.log('Using HashRouter for Render deployment');
        return true;
      }
    }
  }
  // Default to BrowserRouter for better URLs
  return false;
};

// Dynamically choose the router based on environment
const RouterComponent = shouldUseHashRouter() ? 
  require('react-router-dom').HashRouter : 
  require('react-router-dom').BrowserRouter;

// Log which router we're using
console.log(`Using ${shouldUseHashRouter() ? 'HashRouter' : 'BrowserRouter'} for routing`);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterComponent>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <ScrollToTop />
            <App />
          </AuthProvider>
        </ThemeProvider>
      </RouterComponent>
    </ErrorBoundary>
  </React.StrictMode>
);
