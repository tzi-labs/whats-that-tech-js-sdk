import { findTech } from '../src/index';

async function main() {
  try {
    const results = await findTech({
      url: 'https://wordpress.com', // Replace with your target URL
      timeout: 6000, // 6 second timeout
      categories: ['pixel'], // Only detect pixels
      onProgress: (progress) => {
        console.log('Progress:', progress);
      }
    });

    // Filter and display only pixel results
    const pixelResults = results.filter(result => 
      result.categories.includes('pixel') && result.detected
    );

    console.log('\nDetected Pixels:');
    console.log('----------------');
    pixelResults.forEach(result => {
      console.log(`- ${result.name}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 