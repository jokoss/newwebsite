// Simple script to check the API health endpoint
const https = require('https');
const http = require('http');

// Get the URL from command line arguments or use default
const url = process.argv[2] || 'https://your-render-app.onrender.com/api/health';

console.log(`Checking API health at: ${url}`);

// Determine if we should use http or https
const client = url.startsWith('https') ? https : http;

const request = client.get(url, (res) => {
  let data = '';
  
  // A chunk of data has been received
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  // The whole response has been received
  res.on('end', () => {
    console.log(`Status code: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
      console.log('✅ API is healthy!');
      try {
        const parsedData = JSON.parse(data);
        console.log('Response data:');
        console.log(JSON.stringify(parsedData, null, 2));
      } catch (e) {
        console.log('Response is not JSON:');
        console.log(data);
      }
    } else {
      console.log('❌ API returned non-200 status code');
      console.log('Response:');
      console.log(data);
    }
  });
});

request.on('error', (error) => {
  console.error('❌ Error connecting to API:');
  console.error(error.message);
});

// Set a timeout of 10 seconds
request.setTimeout(10000, () => {
  console.error('❌ Request timed out after 10 seconds');
  request.abort();
});
