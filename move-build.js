const fs = require('fs-extra');
const path = require('path');

// Define source and destination paths
const source = path.join(__dirname, 'build');
const destination = path.join(__dirname, 'server', 'build');

// Ensure the destination directory exists and move the build folder
fs.ensureDirSync(destination);  // Ensure the destination directory exists
fs.move(source, destination, { overwrite: true }, err => {
  if (err) {
    console.error('Error moving build folder:', err);
  } else {
    console.log('Build folder moved successfully to', destination);
  }
});
