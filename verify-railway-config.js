#!/usr/bin/env node

/**
 * Railway Configuration Verification Script
 * Checks if the project is properly configured for Railway deployment with Node 18
 */

const fs = require('fs');
const path = require('path');

console.log('🚂 Railway Configuration Verification');
console.log('=====================================\n');

let hasErrors = false;
let hasWarnings = false;

function printStatus(message) {
    console.log(`✅ ${message}`);
}

function printWarning(message) {
    console.log(`⚠️  ${message}`);
    hasWarnings = true;
}

function printError(message) {
    console.log(`❌ ${message}`);
    hasErrors = true;
}

function printInfo(message) {
    console.log(`ℹ️  ${message}`);
}

// Check package.json
function checkPackageJson() {
    printInfo('Checking package.json...');
    
    if (!fs.existsSync('package.json')) {
        printError('package.json not found');
        return;
    }
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check engines
    if (packageJson.engines && packageJson.engines.node) {
        const nodeVersion = packageJson.engines.node;
        if (nodeVersion.includes('18')) {
            printStatus(`Node.js version constraint: ${nodeVersion}`);
        } else {
            printError(`Node.js version constraint should include 18, found: ${nodeVersion}`);
        }
    } else {
        printError('No Node.js version constraint found in engines');
    }
    
    // Check main entry point
    if (packageJson.main === 'api-server-minimal.js') {
        printStatus(`Main entry point: ${packageJson.main}`);
    } else {
        printWarning(`Main entry point: ${packageJson.main} (expected: api-server-minimal.js)`);
    }
    
    // Check scripts
    const scripts = packageJson.scripts || {};
    
    if (scripts.start && scripts.start.includes('api-server-minimal.js')) {
        printStatus('Start script configured correctly');
    } else {
        printError(`Start script should run api-server-minimal.js, found: ${scripts.start}`);
    }
    
    if (scripts.build && scripts.build.includes('cd client && npm run build')) {
        printStatus('Build script configured correctly');
    } else {
        printWarning(`Build script: ${scripts.build}`);
    }
    
    if (scripts.install && scripts.install.includes('cd client && npm ci')) {
        printStatus('Install script configured correctly');
    } else {
        printWarning(`Install script: ${scripts.install}`);
    }
}

// Check .nvmrc
function checkNvmrc() {
    printInfo('Checking .nvmrc...');
    
    if (!fs.existsSync('.nvmrc')) {
        printWarning('.nvmrc not found');
        return;
    }
    
    const nvmrcContent = fs.readFileSync('.nvmrc', 'utf8').trim();
    if (nvmrcContent === '18') {
        printStatus(`.nvmrc version: ${nvmrcContent}`);
    } else {
        printWarning(`.nvmrc version: ${nvmrcContent} (should be 18)`);
    }
}

// Check nixpacks.toml
function checkNixpacks() {
    printInfo('Checking nixpacks.toml...');
    
    if (!fs.existsSync('nixpacks.toml')) {
        printWarning('nixpacks.toml not found');
        return;
    }
    
    const nixpacksContent = fs.readFileSync('nixpacks.toml', 'utf8');
    if (nixpacksContent.includes('projectPaths = ["client"]')) {
        printStatus('nixpacks.toml configured correctly');
    } else {
        printWarning('nixpacks.toml may not be configured correctly');
    }
    
    console.log('nixpacks.toml content:');
    console.log(nixpacksContent);
}

// Check api-server-minimal.js
function checkApiServer() {
    printInfo('Checking api-server-minimal.js...');
    
    if (!fs.existsSync('api-server-minimal.js')) {
        printError('api-server-minimal.js not found');
        return;
    }
    
    const apiServerContent = fs.readFileSync('api-server-minimal.js', 'utf8');
    if (apiServerContent.includes('express.static') && apiServerContent.includes('client/build')) {
        printStatus('api-server-minimal.js configured to serve client build');
    } else {
        printWarning('api-server-minimal.js may not be configured to serve client build');
    }
}

// Check client package.json
function checkClientPackageJson() {
    printInfo('Checking client/package.json...');
    
    if (!fs.existsSync('client/package.json')) {
        printError('client/package.json not found');
        return;
    }
    
    const clientPackageJson = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
    
    // Check react-scripts version
    const dependencies = clientPackageJson.dependencies || {};
    if (dependencies['react-scripts']) {
        const reactScriptsVersion = dependencies['react-scripts'];
        printStatus(`React Scripts version: ${reactScriptsVersion}`);
        
        if (reactScriptsVersion.startsWith('5.')) {
            printStatus('React Scripts 5.x is compatible with Node 18');
        } else {
            printWarning(`React Scripts version ${reactScriptsVersion} - verify Node 18 compatibility`);
        }
    } else {
        printError('react-scripts not found in client dependencies');
    }
    
    // Check homepage setting
    if (clientPackageJson.homepage === '.') {
        printStatus('Client homepage set to relative path');
    } else {
        printInfo(`Client homepage: ${clientPackageJson.homepage || 'not set'}`);
    }
}

// Check if client build directory exists
function checkClientBuild() {
    printInfo('Checking client build...');
    
    if (fs.existsSync('client/build')) {
        printStatus('Client build directory exists');
        
        if (fs.existsSync('client/build/index.html')) {
            printStatus('Client build contains index.html');
        } else {
            printWarning('Client build directory exists but no index.html found');
        }
    } else {
        printInfo('Client build directory not found (will be created during deployment)');
    }
}

// Main execution
function main() {
    console.log('Starting configuration verification...\n');
    
    checkPackageJson();
    console.log();
    
    checkNvmrc();
    console.log();
    
    checkNixpacks();
    console.log();
    
    checkApiServer();
    console.log();
    
    checkClientPackageJson();
    console.log();
    
    checkClientBuild();
    console.log();
    
    // Summary
    console.log('📊 Verification Summary');
    console.log('======================');
    
    if (hasErrors) {
        console.log('❌ Configuration has errors that need to be fixed');
        process.exit(1);
    } else if (hasWarnings) {
        console.log('⚠️  Configuration has warnings but should work');
        console.log('✅ Ready for Railway deployment with minor issues');
    } else {
        console.log('✅ Configuration looks good for Railway deployment!');
    }
    
    console.log('\n🚀 Next steps:');
    console.log('1. Run: railway-deployment-fix.bat (Windows) or ./railway-deployment-fix.sh (Linux/macOS)');
    console.log('2. Or manually set Railway environment variables and deploy');
    console.log('3. Monitor deployment logs for Node 18 usage');
}

// Run the verification
main();
