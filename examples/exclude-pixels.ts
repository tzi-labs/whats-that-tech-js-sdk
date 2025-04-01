import { findTech } from '../src/index';

async function main() {
  try {
    const results = await findTech({
      url: 'https://shopify.com', // Replace with your target URL
      timeout: 6000, // 6 second timeout
      excludeCategories: ['pixels', 'marketing'], // Exclude pixels
      onProgress: (progress) => {
        console.log('Progress:', progress);
      }
    });

    // Filter and display only pixel results
    const pixelResults = results.filter(result => 
      result.categories.includes('pixel') && result.detected
    );

    console.log('\nDetected Technologies:');
    console.log('----------------');
    pixelResults.forEach(result => {
      console.log(`- ${result.name}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 