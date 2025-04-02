import { findTech } from '../src/index';
import fs from 'fs';
import path from 'path';

async function runTests(): Promise<void> {
  // Get the core module's directory
  const coreDir = path.resolve(__dirname, '../node_modules/whats-that-tech-core');
  
  // Find all tech directories
  const techDirs = fs.readdirSync(coreDir).filter(name => 
    fs.existsSync(path.join(coreDir, name, `${name}.json`))
  );

  for (const tech of techDirs) {
    const techDir = path.join(coreDir, tech);
    const testDir = path.join(techDir, 'tests');

    console.log(`\n🧪 Testing ${tech}`);

    if (!fs.existsSync(testDir)) {
      console.warn(`  ⚠️ No tests found for ${tech}`);
      continue;
    }

    const testFiles = fs.readdirSync(testDir);
    const passTests = testFiles.filter(file => file.endsWith('.pass.html'));
    const failTests = testFiles.filter(file => file.endsWith('.fail.html'));

    // Run pass tests
    for (const testFile of passTests) {
      const testPath = path.join(testDir, testFile);
      const fileURL = `file://${testPath}`;

      const result = await findTech({ 
        url: fileURL,
        headless: true,
        timeout: 30000
      });

      const techResult = result.find(r => r.name === tech);
      const passed = techResult?.detected === true;
      console.log(`  ${passed ? '✅' : '❌'} PASS test: ${testFile} → Detected=${techResult?.detected}`);
      
      if (!passed) {
        console.log('    Diagnostics for failed PASS test:');
        console.log('    Expected: detection=true, Actual: detection=false');
        if (techResult) {
          console.log('    Details:', techResult.details);
        }
      }
    }

    // Run fail tests
    for (const testFile of failTests) {
      const testPath = path.join(testDir, testFile);
      const fileURL = `file://${testPath}`;

      const result = await findTech({ 
        url: fileURL,
        headless: true,
        timeout: 30000
      });

      const techResult = result.find(r => r.name === tech);
      const passed = techResult?.detected === false;
      console.log(`  ${passed ? '✅' : '❌'} FAIL test: ${testFile} → Detected=${techResult?.detected}`);
      
      if (!passed) {
        console.log('    Diagnostics for failed FAIL test:');
        console.log('    Expected: detection=false, Actual: detection=true');
        if (techResult) {
          console.log('    Details:', techResult.details);
        }
      }
    }
  }
}

// Run the tests
runTests().catch(console.error); 