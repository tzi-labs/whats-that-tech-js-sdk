import { findTech } from '../src';
import fs from 'fs';
import { DetectionResult } from '../src/types/tech-detection';

const sites = [
  'https://www.nytimes.com',
  'https://www.nuxtjs.org',
  'https://www.tailwindcss.com',
  'https://www.framer.com'
];

interface BatchResult {
  url: string;
  results: DetectionResult[];
  error?: string;
}

async function runBatchCrawl() {
  console.log('🚀 Starting batch crawl of', sites.length, 'sites');
  console.log('⚙️  Concurrent limit:', 2);
  console.log('⏳ This may take a while...\n');

  const startTime = Date.now();
  const results: BatchResult[] = [];
  let processedCount = 0;

  // Process sites in chunks of 2
  for (let i = 0; i < sites.length; i += 2) {
    const chunk = sites.slice(i, i + 2);
    console.log(`\n🔄 Processing batch ${Math.floor(i/2) + 1}/${Math.ceil(sites.length/2)}`);
    
    const chunkResults = await Promise.all(
      chunk.map(async (url) => {
        console.log(`\n🌐 Crawling: ${url}`);
        try {
          const techResults = await findTech({
            url,
            headless: true,
            timeout: 15000 // 15 second timeout
          }) as DetectionResult[];
          processedCount++;
          const detectedCount = techResults.filter(r => r.detected).length;
          console.log(`✅ ${url}: ${detectedCount} technologies detected`);
          return { url, results: techResults } as BatchResult;
        } catch (error) {
          processedCount++;
          console.error(`❌ ${url}: Error - ${error instanceof Error ? error.message : String(error)}`);
          return { 
            url, 
            results: [], 
            error: error instanceof Error ? error.message : String(error)
          } as BatchResult;
        }
      })
    );

    results.push(...chunkResults);
    
    // Show progress
    const progress = (processedCount / sites.length) * 100;
    console.log(`\n📊 Progress: ${progress.toFixed(1)}% (${processedCount}/${sites.length} sites)`);
  }

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  console.log('\n✨ Batch crawl completed!');
  console.log(`⏱️  Total duration: ${duration.toFixed(2)} seconds`);
  console.log(`📊 Sites processed: ${sites.length}`);
  
  // Print final results summary
  console.log('\n📝 Final Results Summary:');
  results.forEach((result: BatchResult) => {
    const detectedCount = result.results.filter(r => r.detected).length;
    console.log(`\n${result.url}: ${detectedCount} technologies detected${result.error ? ` (Error: ${result.error})` : ''}`);
    
    if (!result.error) {
      const detectedTechs = result.results.filter(r => r.detected);
      if (detectedTechs.length > 0) {
        console.log('\nDetected Technologies:');
        detectedTechs.forEach(tech => {
          console.log(`  • ${tech.name} (${tech.categories.join(', ')})`);
        });
      }
    }
  });

  // Save detailed results to a file
  const outputPath = './batch-crawl-results.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Detailed results saved to: ${outputPath}`);
}

// Run the batch crawl
runBatchCrawl().catch(console.error); 