import { launch, Page } from 'puppeteer';
import { analyze } from '../src/analyzer';
import fs from 'fs';
import path from 'path';
import { Fingerprint } from '../src/types/tech-detection';

const fingerprintsRoot = path.resolve('./fingerprints');

async function runTests(): Promise<void> {
  const browser = await launch();
  const page = await browser.newPage();

  const fingerprintDirs = fs.readdirSync(fingerprintsRoot).filter(name =>
    fs.existsSync(path.join(fingerprintsRoot, name, `${name}.json`))
  );

  for (const tech of fingerprintDirs) {
    const base = path.join(fingerprintsRoot, tech);
    const fingerprintPath = path.join(base, `${tech}.json`);
    const testDir = path.join(base, 'tests');

    console.log(`\n🧪 Testing: ${tech}`);

    if (!fs.existsSync(testDir)) {
      console.warn(`  ⚠️ No tests found for ${tech}`);
      continue;
    }

    const testFiles = fs.readdirSync(testDir);
    const passTests = testFiles.filter(file => file.endsWith('.pass.html'));
    const failTests = testFiles.filter(file => file.endsWith('.fail.html'));

    for (const testFile of passTests) {
      const testPath = path.join(testDir, testFile);
      const fileURL = `file://${testPath}`;
      await page.goto(fileURL, { waitUntil: 'load' });

      const result = await analyze({ 
        page, 
        data: { 
          html: await page.content(), 
          requests: [],
          cookies: [],
          url: fileURL
        } 
      }, fingerprintPath);
      const passed = result.detected === true;
      console.log(`  ${passed ? '✅' : '❌'} PASS test: ${testFile} → Detected=${result.detected}`);
      
      if (!passed) {
        // Diagnostics for failing pass tests
        console.log('    Diagnostics for failed PASS test:');
        console.log('    Expected: detection=true, Actual: detection=false');
        
        // Get the fingerprint to check which criteria didn't match
        const fingerprint: Fingerprint = JSON.parse(fs.readFileSync(fingerprintPath, 'utf-8'));
        
        if (fingerprint.detectors.htmlContains) {
          console.log('    htmlContains checks:');
          for (const pattern of fingerprint.detectors.htmlContains) {
            const html = await page.content();
            const found = html.includes(pattern);
            console.log(`      "${pattern}": ${found ? '✓' : '✗'}`);
          }
        }
        
        if (fingerprint.detectors.globalVariables) {
          console.log('    globalVariables checks:');
          for (const varName of fingerprint.detectors.globalVariables) {
            const exists = await page.evaluate((name: string) => 
              typeof (window as any)[name] !== 'undefined', 
              varName
            );
            console.log(`      "${varName}": ${exists ? '✓' : '✗'}`);
          }
        }
        
        if (fingerprint.detectors.metaTagCheck) {
          console.log('    metaTagCheck:');
          const { name, contentRegex } = fingerprint.detectors.metaTagCheck;
          const found = await page.evaluate((metaName: string, contentPattern: string) => {
            const meta = document.querySelector(`meta[name="${metaName}"]`);
            if (!meta) return false;
            const content = meta.getAttribute('content');
            return content && new RegExp(contentPattern).test(content);
          }, name, contentRegex);
          console.log(`      "name=${name}, contentRegex=${contentRegex}": ${found ? '✓' : '✗'}`);
        }
        
        if (fingerprint.detectors.selectorExists) {
          console.log('    selectorExists checks:');
          for (const selector of fingerprint.detectors.selectorExists) {
            const exists = await page.evaluate((sel: string) => 
              document.querySelector(sel) !== null, 
              selector
            );
            console.log(`      "${selector}": ${exists ? '✓' : '✗'}`);
          }
        }
      }
    }

    for (const testFile of failTests) {
      const testPath = path.join(testDir, testFile);
      const fileURL = `file://${testPath}`;
      await page.goto(fileURL, { waitUntil: 'load' });

      const result = await analyze({ 
        page, 
        data: { 
          html: await page.content(), 
          requests: [],
          cookies: [],
          url: fileURL
        } 
      }, fingerprintPath);
      const passed = result.detected === false;
      console.log(`  ${passed ? '✅' : '❌'} FAIL test: ${testFile} → Detected=${result.detected}`);
      
      if (!passed) {
        // Diagnostics for failing fail tests
        console.log('    Diagnostics for failed FAIL test:');
        console.log('    Expected: detection=false, Actual: detection=true');
        console.log('    The following detector criteria incorrectly matched:');
        
        // Check which detectors matched when they shouldn't have
        if (!result.details || Object.keys(result.details).length === 0) {
          console.log('      No details available - detection happened but details were not included');
        } else {
          for (const [key, value] of Object.entries(result.details)) {
            if (value === true) {
              console.log(`      ✗ ${key}`);
            }
          }
        }
      }
    }
  }

  await browser.close();
}

// Run the tests
runTests().catch(console.error); 