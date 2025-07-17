/**
 * API Diagnostic Script
 * 
 * This script checks the health of the API endpoints used by the React application.
 * It can be run in the browser console or as a Node.js script.
 */

// Configuration
const API_BASE_URL = '/api'; // Change to your API base URL in production
const ENDPOINTS = [
  '/categories',
  '/partners',
  '/blog',
  '/auth/me'
];

// Function to check a single API endpoint
async function checkEndpoint(endpoint) {
  console.log(`Checking endpoint: ${endpoint}`);
  
  try {
    const startTime = performance.now();
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    const result = {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      responseTime: `${responseTime}ms`,
      ok: response.ok
    };
    
    if (response.ok) {
      try {
        const data = await response.json();
        result.dataReceived = true;
        result.dataSize = JSON.stringify(data).length;
        result.hasData = Array.isArray(data) ? data.length > 0 : (data && Object.keys(data).length > 0);
        
        if (Array.isArray(data)) {
          result.itemCount = data.length;
        } else if (data && data.data && Array.isArray(data.data)) {
          result.itemCount = data.data.length;
        }
      } catch (error) {
        result.dataReceived = false;
        result.parseError = error.message;
      }
    }
    
    return result;
  } catch (error) {
    return {
      endpoint,
      error: error.message,
      ok: false
    };
  }
}

// Function to check all endpoints
async function checkAllEndpoints() {
  console.log('Starting API diagnostics...');
  console.log(`Base URL: ${API_BASE_URL}`);
  
  const results = [];
  
  for (const endpoint of ENDPOINTS) {
    const result = await checkEndpoint(endpoint);
    results.push(result);
  }
  
  // Print summary
  console.log('\nAPI Diagnostic Results:');
  console.table(results);
  
  // Count successful and failed endpoints
  const successful = results.filter(r => r.ok).length;
  const failed = results.length - successful;
  
  console.log(`\nSummary: ${successful} endpoints OK, ${failed} endpoints failed`);
  
  if (failed > 0) {
    console.log('\nFailed endpoints:');
    results.filter(r => !r.ok).forEach(result => {
      console.log(`- ${result.endpoint}: ${result.status || 'Error'} ${result.statusText || result.error || ''}`);
    });
    
    console.log('\nPossible solutions:');
    console.log('1. Check if the server is running');
    console.log('2. Verify API base URL is correct');
    console.log('3. Check for CORS issues');
    console.log('4. Ensure the server has the correct routes configured');
    console.log('5. Check server logs for errors');
  }
  
  return {
    results,
    successful,
    failed
  };
}

// Run the diagnostics
if (typeof window !== 'undefined') {
  // Browser environment
  console.log('Running API diagnostics in browser...');
  window.runApiDiagnostics = checkAllEndpoints;
  console.log('To run diagnostics, type: runApiDiagnostics()');
} else {
  // Node.js environment
  console.log('Running API diagnostics in Node.js...');
  checkAllEndpoints().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}
