const { User } = require('../models');
const sequelize = require('../config/database');
const crypto = require('crypto');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to generate a secure random password
function generateSecurePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';
  
  // Ensure at least one character from each category
  password += charset.substring(0, 26).charAt(Math.floor(Math.random() * 26)); // lowercase
  password += charset.substring(26, 52).charAt(Math.floor(Math.random() * 26)); // uppercase
  password += charset.substring(52, 62).charAt(Math.floor(Math.random() * 10)); // number
  password += charset.substring(62).charAt(Math.floor(Math.random() * (charset.length - 62))); // special
  
  // Fill the rest of the password
  for (let i = 4; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  // Shuffle the password characters
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

async function resetAdminPassword(customPassword = null) {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Find admin user
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    
    if (!adminUser) {
      console.error('Admin user not found!');
      return;
    }
    
    // Use custom password if provided, otherwise generate a secure one
    const newPassword = customPassword || generateSecurePassword();
    
    // Update the password
    adminUser.password = newPassword;
    await adminUser.save();
    
    console.log('\n========== ADMIN PASSWORD RESET ==========');
    console.log('Admin password has been reset successfully.');
    console.log('Please login with:');
    console.log('Username: admin');
    console.log(`Password: ${newPassword}`);
    console.log('==========================================');
    console.log('\nIMPORTANT: Please save this password in a secure location.');
    console.log('You will not be able to retrieve it after closing this terminal.');
    
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await sequelize.close();
    rl.close();
  }
}

// Ask if user wants to provide a custom password or use a generated one
rl.question('Do you want to set a custom password? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    rl.question('Enter new password (min 8 characters): ', async (password) => {
      if (password.length < 8) {
        console.error('Password must be at least 8 characters long.');
        rl.close();
        return;
      }
      await resetAdminPassword(password);
    });
  } else {
    resetAdminPassword();
  }
});
