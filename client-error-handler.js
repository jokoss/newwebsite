/**
 * Client Error Handler Script
 * 
 * This script adds a global error handler to the client-side React application
 * to prevent blank screens when errors occur. It should be included in the
 * client/public/index.html file.
 */

// Create a div to display errors
function createErrorDisplay() {
  const errorContainer = document.createElement('div');
  errorContainer.id = 'react-error-display';
  errorContainer.style.display = 'none';
  errorContainer.style.position = 'fixed';
  errorContainer.style.top = '0';
  errorContainer.style.left = '0';
  errorContainer.style.width = '100%';
  errorContainer.style.backgroundColor = '#f8d7da';
  errorContainer.style.color = '#721c24';
  errorContainer.style.padding = '20px';
  errorContainer.style.zIndex = '9999';
  errorContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  errorContainer.style.textAlign = 'center';
  
  const heading = document.createElement('h3');
  heading.textContent = 'Application Error';
  errorContainer.appendChild(heading);
  
  const message = document.createElement('p');
  message.id = 'error-message';
  message.textContent = 'An error occurred while loading the application.';
  errorContainer.appendChild(message);
  
  const details = document.createElement('details');
  details.style.marginTop = '10px';
  details.style.textAlign = 'left';
  
  const summary = document.createElement('summary');
  summary.textContent = 'Technical Details';
  details.appendChild(summary);
  
  const detailsContent = document.createElement('pre');
  detailsContent.id = 'error-details';
  detailsContent.style.whiteSpace = 'pre-wrap';
  detailsContent.style.fontSize = '12px';
  detailsContent.style.backgroundColor = '#f8f9fa';
  detailsContent.style.padding = '10px';
  detailsContent.style.borderRadius = '4px';
  detailsContent.style.marginTop = '10px';
  details.appendChild(detailsContent);
  
  errorContainer.appendChild(details);
  
  const reload = document.createElement('button');
  reload.textContent = 'Reload Page';
  reload.style.marginTop = '15px';
  reload.style.padding = '8px 16px';
  reload.style.backgroundColor = '#0b4d83';
  reload.style.color = 'white';
  reload.style.border = 'none';
  reload.style.borderRadius = '4px';
  reload.style.cursor = 'pointer';
  reload.onclick = function() {
    window.location.reload();
  };
  errorContainer.appendChild(reload);
  
  document.body.appendChild(errorContainer);
  return errorContainer;
}

// Global error handler
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error);
  
  let errorContainer = document.getElementById('react-error-display');
  if (!errorContainer) {
    errorContainer = createErrorDisplay();
  }
  
  const errorMessage = document.getElementById('error-message');
  const errorDetails = document.getElementById('error-details');
  
  errorMessage.textContent = 'An error occurred while loading the application: ' + 
    (event.error ? event.error.message : 'Unknown error');
  
  if (event.error && event.error.stack) {
    errorDetails.textContent = event.error.stack;
  } else {
    errorDetails.textContent = 'No stack trace available.\n\n' + 
      'Error occurred at: ' + event.filename + ':' + event.lineno + ':' + event.colno;
  }
  
  errorContainer.style.display = 'block';
});

// Handle unhandled promise rejections (like failed API calls)
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  
  let errorContainer = document.getElementById('react-error-display');
  if (!errorContainer) {
    errorContainer = createErrorDisplay();
  }
  
  const errorMessage = document.getElementById('error-message');
  const errorDetails = document.getElementById('error-details');
  
  errorMessage.textContent = 'An API request failed: ' + 
    (event.reason ? (event.reason.message || 'Connection error') : 'Unknown error');
  
  if (event.reason) {
    if (event.reason.stack) {
      errorDetails.textContent = event.reason.stack;
    } else if (event.reason.response) {
      errorDetails.textContent = 'API Response Status: ' + event.reason.response.status + 
        '\nURL: ' + (event.reason.config ? event.reason.config.url : 'Unknown URL');
    } else {
      errorDetails.textContent = JSON.stringify(event.reason, null, 2);
    }
  } else {
    errorDetails.textContent = 'No details available for this error.';
  }
  
  errorContainer.style.display = 'block';
});

console.log('Client error handler initialized');
