/**
 * Script to update the HomePage component for better Render compatibility
 * This script adds error handling and fallback content to ensure the homepage
 * always renders something, even if API calls fail
 */

const fs = require('fs');
const path = require('path');

// Path to HomePage.js
const homePagePath = path.join(__dirname, '..', '..', 'client', 'src', 'pages', 'public', 'HomePage.js');
const backupPath = path.join(__dirname, '..', '..', 'client', 'src', 'pages', 'public', 'HomePage.js.bak');

console.log('Updating HomePage component for better Render compatibility...');

// Check if HomePage.js exists
if (!fs.existsSync(homePagePath)) {
  console.error(`Error: HomePage.js not found at ${homePagePath}`);
  process.exit(1);
}

// Read the current HomePage.js file
let homePageContent = fs.readFileSync(homePagePath, 'utf8');

// Check if the HomePage has already been updated
if (homePageContent.includes('renderFallbackContent') || homePageContent.includes('isRenderEnvironment')) {
  console.log('HomePage.js has already been updated for Render compatibility');
  process.exit(0);
}

// Create a backup of the original file
console.log('Creating backup of original HomePage.js...');
fs.writeFileSync(backupPath, homePageContent);

// Extract imports from the original file
const importMatches = homePageContent.match(/import[^;]*;/g) || [];
let imports = importMatches.join('\n');

// Make sure we have all the necessary imports
if (!imports.includes('import ApiErrorHandler from')) {
  imports += '\nimport ApiErrorHandler from \'../../components/utils/ApiErrorHandler\';';
}

if (!imports.includes('useState')) {
  imports = imports.replace(/import React[^;]*;/, 'import React, { useState, useEffect, useRef } from \'react\';');
} else if (!imports.includes('useEffect')) {
  imports = imports.replace(/import React[^;]*;/, (match) => {
    return match.replace('useState', 'useState, useEffect, useRef');
  });
} else if (!imports.includes('useRef')) {
  imports = imports.replace(/import React[^;]*;/, (match) => {
    return match.replace('useEffect', 'useEffect, useRef');
  });
}

// Extract any component definitions from the original file
// This regex looks for component definitions like "const Hero = () => {" or "function Hero() {"
const componentRegex = /(?:const|function)\s+([A-Z][a-zA-Z0-9]*)\s*=?\s*(?:\(\s*\)\s*=>\s*{|\([^)]*\)\s*{)/g;
let componentMatch;
const componentNames = [];
const componentDefinitions = [];

while ((componentMatch = componentRegex.exec(homePageContent)) !== null) {
  const componentName = componentMatch[1];
  if (componentName !== 'HomePage') { // Skip the main HomePage component
    componentNames.push(componentName);
    
    // Find the start and end of this component
    const startIndex = componentMatch.index;
    let braceCount = 0;
    let endIndex = startIndex;
    
    // Find the opening brace
    for (let i = startIndex; i < homePageContent.length; i++) {
      if (homePageContent[i] === '{') {
        braceCount = 1;
        endIndex = i + 1;
        break;
      }
    }
    
    // Find the matching closing brace
    for (let i = endIndex; i < homePageContent.length; i++) {
      if (homePageContent[i] === '{') braceCount++;
      if (homePageContent[i] === '}') braceCount--;
      if (braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
    
    // Extract the component definition
    const definition = homePageContent.substring(startIndex, endIndex);
    componentDefinitions.push(definition);
  }
}

// Create the new HomePage component with error handling
const newHomePageComponent = `${imports}

${componentDefinitions.join('\n\n')}

// Enhanced HomePage component with robust error handling and fallback content
const HomePage = () => {
  // State for tracking API loading and errors
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [renderWarning, setRenderWarning] = useState(false);
  const loadingTimeoutRef = useRef(null);
  
  // Helper function to detect if we're in a Render environment
  const isRenderEnvironment = () => {
    return (
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('render.com') || 
       window.location.hostname.includes('onrender.com'))
    );
  };
  
  // Fallback content to display if there are API issues
  const renderFallbackContent = () => {
    return (
      <div className="fallback-content" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Welcome to Analytical Testing Laboratory</h1>
        {renderWarning && (
          <div style={{ 
            padding: '15px', 
            marginBottom: '20px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeeba', 
            borderRadius: '4px',
            color: '#856404'
          }}>
            <h4 style={{ marginTop: '0' }}>Connection Notice</h4>
            <p>We're experiencing some connectivity issues with our backend services. 
            Some content may not be fully available at the moment.</p>
            <p>Please try refreshing the page or check back later.</p>
          </div>
        )}
        
        <div style={{ marginBottom: '30px' }}>
          <h2>Our Services</h2>
          <p>We provide comprehensive analytical testing services for various industries including:</p>
          <ul>
            <li>Chemical Analysis</li>
            <li>Microbiological Testing</li>
            <li>Environmental Analysis</li>
            <li>Food & Beverage Testing</li>
            <li>Material Characterization</li>
            <li>And more...</li>
          </ul>
          <p>Please navigate to our Services page to learn more about our specific offerings.</p>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <h2>Why Choose Us</h2>
          <p>With state-of-the-art equipment and experienced professionals, we deliver:</p>
          <ul>
            <li>Accurate and reliable results</li>
            <li>Quick turnaround times</li>
            <li>Comprehensive reporting</li>
            <li>Customized testing solutions</li>
            <li>Excellent customer service</li>
          </ul>
        </div>
        
        <div>
          <h2>Contact Us</h2>
          <p>For inquiries about our services or to request a quote, please contact us at:</p>
          <p><strong>Email:</strong> info@analyticaltestinglab.com</p>
          <p><strong>Phone:</strong> (123) 456-7890</p>
        </div>
      </div>
    );
  };
  
  // Set up a safety timeout for loading
  useEffect(() => {
    try {
      // Set a timeout to prevent infinite loading state
      loadingTimeoutRef.current = setTimeout(() => {
        if (isLoading) {
          console.log('Loading timeout reached, showing fallback content');
          setIsLoading(false);
          setRenderWarning(true);
        }
      }, 10000); // 10 second timeout
      
      // Check for Render-specific issues
      if (isRenderEnvironment()) {
        console.log('Render environment detected, enabling enhanced error handling');
        
        // Add a specific check for API connectivity
        fetch('/api/health')
          .then(response => {
            if (!response.ok) throw new Error('API health check failed');
            return response.json();
          })
          .then(data => {
            console.log('API health check successful:', data);
            // We'll still let the normal data loading happen
          })
          .catch(error => {
            console.error('API health check failed:', error);
            setRenderWarning(true);
          });
      }
      
      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      };
    } catch (error) {
      console.error('Error in HomePage useEffect:', error);
      setHasError(true);
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  }, [isLoading]);

  // Main data fetching and rendering logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setHasError(true);
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render the main content or fallback content based on state
  return (
    <div>
      {hasError ? (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" color="error" gutterBottom>
            Error Loading Content
          </Typography>
          <Typography variant="body1" paragraph>
            {errorMessage || 'An unexpected error occurred. Please try again later.'}
          </Typography>
          {renderFallbackContent()}
        </Box>
      ) : isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          ${componentNames.map(name => `<${name} />`).join('\n          ')}
        </>
      )}
    </div>
  );
};

export default HomePage;`;

// Write the updated content back to the file
fs.writeFileSync(homePagePath, newHomePageComponent);
console.log('HomePage.js updated successfully for Render compatibility');
console.log(`Original file backed up to ${backupPath}`);
