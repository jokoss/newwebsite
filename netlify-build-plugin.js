module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('Starting Netlify build process...');
    console.log('Current directory:', process.cwd());
    console.log('Directory contents:', require('fs').readdirSync('.'));
    
    // Check if client directory exists
    if (require('fs').existsSync('./client')) {
      console.log('Client directory exists');
      console.log('Client directory contents:', require('fs').readdirSync('./client'));
    } else {
      console.log('Client directory does not exist');
      utils.build.failBuild('Client directory not found');
    }
  },
  onBuild: () => {
    console.log('Build step completed');
    
    // Check if build directory exists
    if (require('fs').existsSync('./client/build')) {
      console.log('Build directory exists');
      console.log('Build directory contents:', require('fs').readdirSync('./client/build'));
    } else {
      console.log('Build directory does not exist');
    }
  },
  onPostBuild: ({ utils }) => {
    console.log('Post-build step');
    
    // Check if index.html exists in the build directory
    if (require('fs').existsSync('./client/build/index.html')) {
      console.log('index.html exists in build directory');
    } else {
      console.log('index.html does not exist in build directory');
      utils.build.failBuild('index.html not found in build directory');
    }
  }
};
