import { findTech } from '../src/index';

async function main() {
  try {
    const results = await findTech({
      url: 'https://wordpress.com',
      timeout: 6000, // 6 second timeout
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