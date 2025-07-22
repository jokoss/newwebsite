import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/utils/ScrollToTop';
import ErrorBoundary from './components/utils/ErrorBoundary';
import App from './App';

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

// Router Error Boundary specifically for Router context issues
class RouterErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if it's a router context error
    if (error.message && error.message.includes('useContext')) {
      console.error('Router context error detected:', error);
      return { hasError: true, error };
    }
    return null;
  }

  componentDidCatch(error, errorInfo) {
    console.error('RouterErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#d32f2f' }}>Application Loading Error</h1>
          <p>The application encountered a routing error. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Determine basename for Railway deployment
const getBasename = () => {
  // For Railway, we typically don't need a basename
  // Railway serves the app from the root domain
  if (typeof window !== 'undefined') {
    const { hostname, pathname } = window.location;
    
    // Railway domains
    if (hostname.includes('railway.app') || hostname.includes('up.railway.app')) {
      console.log('Railway deployment detected - using root basename');
      return '/';
    }
    
    // Other deployment platforms
    if (hostname.includes('render.com') || hostname.includes('onrender.com')) {
      console.log('Render deployment detected - using root basename');
      return '/';
    }
    
    // Netlify
    if (hostname.includes('netlify.app')) {
      console.log('Netlify deployment detected - using root basename');
      return '/';
    }
  }
  
  // Default to root
  return '/';
};

const basename = getBasename();
console.log(`🚀 App starting with basename: "${basename}"`);
console.log(`🌐 Current URL: ${typeof window !== 'undefined' ? window.location.href : 'SSR'}`);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterErrorBoundary>
      <ErrorBoundary>
        <BrowserRouter basename={basename}>
          <AuthProvider>
            <ScrollToTop />
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </RouterErrorBoundary>
  </React.StrictMode>
);
