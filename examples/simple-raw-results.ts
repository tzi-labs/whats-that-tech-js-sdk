// import { findTech } from '../src/index';
import { findTech } from '../dist/index.cjs';
import path, { dirname } from 'node:path'; // Import the path module and dirname
import { fileURLToPath } from 'node:url'; // Import fileURLToPath

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  try {
    // Debug fingerprints loading
    const customDir = path.join(__dirname, '../core');
    console.log('Attempting to use custom fingerprints from:', customDir); // Log the path
    
    const results = await findTech({
      url: 'https://www.thelinehotel.com/',
      timeout: 60000, // 6 second timeout
      debug: true,
      headless: false,
      // customFingerprintsDir: customDir, // Use the variable
      onProgress: (progress) => {
        console.log('Progress:', progress);
      }
    });

    console.log('\nRaw Detection Results:');
    console.log('----------------------');
    console.log(JSON.stringify(results, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 