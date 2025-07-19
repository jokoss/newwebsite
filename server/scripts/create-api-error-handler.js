/**
 * Script to create the ApiErrorHandler component
 * This script creates the ApiErrorHandler component that is used by the HomePage
 * to handle API errors in the Render environment
 */

const fs = require('fs');
const path = require('path');

// Path to ApiErrorHandler.js
const apiErrorHandlerPath = path.join(__dirname, '..', '..', 'client', 'src', 'components', 'utils', 'ApiErrorHandler.js');

console.log('Creating ApiErrorHandler component...');

// Check if utils directory exists, create it if it doesn't
const utilsDir = path.dirname(apiErrorHandlerPath);
if (!fs.existsSync(utilsDir)) {
  console.log(`Creating directory: ${utilsDir}`);
  fs.mkdirSync(utilsDir, { recursive: true });
}

// Check if ApiErrorHandler.js already exists
if (fs.existsSync(apiErrorHandlerPath)) {
  console.log('ApiErrorHandler.js already exists, skipping creation');
  process.exit(0);
}

// ApiErrorHandler component content
const apiErrorHandlerContent = `import React from 'react';

/**
 * ApiErrorHandler component for handling API errors in Render environment
 * This component provides utilities for detecting and handling API errors
 * specifically in the Render deployment environment
 */
const ApiErrorHandler = {
  /**
   * Check if the current environment is Render
   * @returns {boolean} True if the current environment is Render
   */
  isRenderEnvironment: () => {
    return (
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('render.com') || 
       window.location.hostname.includes('onrender.com'))
    );
  },

  /**
   * Check if an error is likely due to Render-specific connectivity issues
   * @param {Error} error - The error to check
   * @returns {boolean} True if the error is likely due to Render connectivity issues
   */
  isRenderConnectivityError: (error) => {
    if (!error) return false;
    
    // Check for common network errors that occur in Render
    const isNetworkError = 
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('Network Error') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('ECONNREFUSED') ||
      error.message?.includes('ETIMEDOUT') ||
      error.name === 'TypeError' && error.message?.includes('Network');
    
    // Only consider it a Render-specific issue if we're in the Render environment
    return isNetworkError && ApiErrorHandler.isRenderEnvironment();
  },

  /**
   * Get a user-friendly error message for Render-specific errors
   * @param {Error} error - The error to get a message for
   * @returns {string} A user-friendly error message
   */
  getRenderErrorMessage: (error) => {
    if (ApiErrorHandler.isRenderConnectivityError(error)) {
      return "We're experiencing some connectivity issues with our backend services. This is a common issue with Render deployments during cold starts. Please try refreshing the page in a few moments.";
    }
    
    return error?.message || "An unknown error occurred";
  },

  /**
   * Log an error with additional context for Render environments
   * @param {string} component - The component where the error occurred
   * @param {Error} error - The error to log
   */
  logRenderError: (component, error) => {
    console.error(\`Error in \${component}:\`, error);
    
    if (ApiErrorHandler.isRenderEnvironment()) {
      console.info('This error occurred in a Render environment, which may have different behavior than local development.');
      
      if (ApiErrorHandler.isRenderConnectivityError(error)) {
        console.info('This appears to be a Render-specific connectivity issue, which is common during cold starts.');
      }
    }
  }
};

export default ApiErrorHandler;
`;

// Write the ApiErrorHandler component to the file
fs.writeFileSync(apiErrorHandlerPath, apiErrorHandlerContent);
console.log(`ApiErrorHandler component created at ${apiErrorHandlerPath}`);
