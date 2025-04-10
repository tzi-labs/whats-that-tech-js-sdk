import puppeteer from 'puppeteer';
import fsPromises, { readdir, readFile } from 'fs/promises';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
async function loadFingerprints(debug = false, customDir) {
  const packagedDistCorePath = resolve(__dirname, "core.json");
  const devDistCorePath = resolve(__dirname, "../../dist/core.json");
  if (debug) {
    console.log(`[Debug Path Def] packagedDistCorePath: ${packagedDistCorePath}`);
    console.log(`[Debug Path Def] devDistCorePath: ${devDistCorePath}`);
  }
  if (customDir && existsSync(customDir)) {
    if (debug) {
      console.log(`Attempting to load fingerprints from custom directory: ${customDir}`);
    }
    try {
      const sourcePath = customDir;
      const techDirs = await readdir(sourcePath);
      const fingerprints = {};
      for (const tech of techDirs) {
        const techPath = join(sourcePath, tech);
        if (!statSync(techPath).isDirectory() || tech.startsWith(".")) continue;
        try {
          const files = await readdir(techPath);
          for (const file of files) {
            if (file.endsWith(".json")) {
              const fingerprintPath = join(techPath, file);
              const content = await readFile(fingerprintPath, "utf-8");
              fingerprints[tech] = JSON.parse(content);
              if (debug) {
                console.log(`Loaded custom fingerprint for ${tech}`);
              }
            }
          }
        } catch (error) {
          if (debug) {
            console.error(`Failed to load fingerprint for ${tech} from custom directory:`, error);
          }
        }
      }
      if (Object.keys(fingerprints).length > 0) {
        if (debug) {
          console.log(`Loaded ${Object.keys(fingerprints).length} fingerprints from custom directory: ${customDir}`);
        }
        return fingerprints;
      } else {
        if (debug) {
          console.warn(`Custom directory specified (${customDir}), but no fingerprints were loaded from it.`);
        }
      }
    } catch (error) {
      if (debug) {
        console.error(`Error accessing custom directory ${customDir}:`, error);
      }
    }
  } else if (customDir && !existsSync(customDir)) {
    if (debug) {
      console.warn(`Custom directory specified (${customDir}), but it does not exist. Falling back to default paths.`);
    }
  }
  let corePathToTry = null;
  let loadedFingerprints = null;
  if (existsSync(packagedDistCorePath)) {
    corePathToTry = packagedDistCorePath;
    if (debug) console.log(`[Debug] Found potential core.json at packaged path: ${corePathToTry}`);
  } else if (existsSync(devDistCorePath)) {
    corePathToTry = devDistCorePath;
    if (debug) console.log(`[Debug] Found potential core.json at dev->dist path: ${corePathToTry}`);
  } else {
    if (debug) {
      console.log(`[Debug] Neither packaged path (${packagedDistCorePath}) nor dev->dist path (${devDistCorePath}) exists.`);
    }
  }
  if (corePathToTry) {
    if (debug) console.log(`Attempting to load fingerprints from: ${corePathToTry}`);
    try {
      const content = await fsPromises.readFile(corePathToTry, "utf-8");
      loadedFingerprints = JSON.parse(content);
      if (loadedFingerprints && debug) {
        console.log(`Loaded ${Object.keys(loadedFingerprints).length} fingerprints from ${corePathToTry}`);
      }
      if (loadedFingerprints) {
        return loadedFingerprints;
      }
    } catch (error) {
      if (debug) {
        console.error(`Failed to load/parse core.json from ${corePathToTry}:`, error);
      }
    }
  }
  if (debug) {
    console.error("No fingerprints could be loaded from any source (Custom Dir or dist/core.json)");
  }
  return {};
}

async function findTech(options) {
  const { url, headless = true, timeout = 3e4, categories, excludeCategories, customFingerprintsDir, debug = false, onProgress } = options;
  onProgress?.({
    current: 1,
    total: 1,
    currentUrl: url,
    status: "processing"
  });
  try {
    if (debug) {
      if (customFingerprintsDir) {
        console.log(`Debug: Attempting to load fingerprints from custom directory specified: ${customFingerprintsDir}`);
      } else {
        console.log("Debug: No custom fingerprint directory specified. Using default path resolution (Dev -> Node Modules -> Dist -> Root).");
      }
    }
    const fingerprints = await loadFingerprints(debug, customFingerprintsDir);
    if (Object.keys(fingerprints).length === 0) {
      throw new Error("No fingerprints loaded");
    }
    if (debug) {
      console.log("Current working directory:", process.cwd());
      console.log("Available fingerprints:", Object.keys(fingerprints));
    }
    const browser = await puppeteer.launch({ headless });
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle0", timeout });
      const results = [];
      for (const [tech, fingerprint] of Object.entries(fingerprints)) {
        if (categories && fingerprint.categories) {
          const hasMatchingCategory = fingerprint.categories.some((cat) => categories.includes(cat));
          if (!hasMatchingCategory) continue;
        }
        if (excludeCategories && fingerprint.categories) {
          const hasExcludedCategory = fingerprint.categories.some((cat) => excludeCategories.includes(cat));
          if (hasExcludedCategory) continue;
        }
        const detected = await detectTechnology(page, fingerprint);
        if (debug && detected) {
          console.log(`Detected ${tech} with categories:`, fingerprint.categories);
        }
        results.push({
          name: tech,
          categories: fingerprint.categories || ["unidentified"],
          detected
        });
      }
      onProgress?.({
        current: 1,
        total: 1,
        currentUrl: url,
        status: "completed"
      });
      return results;
    } finally {
      await browser.close();
    }
  } catch (error) {
    onProgress?.({
      current: 1,
      total: 1,
      currentUrl: url,
      status: "error",
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}
async function detectTechnology(page, fingerprint) {
  const { detectors } = fingerprint;
  if (detectors.htmlContains) {
    const html = await page.content();
    if (detectors.htmlContains.some((text) => html.includes(text))) {
      return true;
    }
  }
  if (detectors.htmlRegex) {
    const html = await page.content();
    if (new RegExp(detectors.htmlRegex).test(html)) {
      return true;
    }
  }
  if (detectors.requestUrlRegex) {
    const requests = await page.evaluate(() => {
      return globalThis.performance.getEntriesByType("resource").map((entry) => entry.name);
    });
    const regexes = Array.isArray(detectors.requestUrlRegex) ? detectors.requestUrlRegex : [detectors.requestUrlRegex];
    if (requests.some(
      (url) => regexes.some((regex) => new RegExp(regex).test(url))
    )) {
      return true;
    }
  }
  if (detectors.selectorExists) {
    for (const selector of detectors.selectorExists) {
      if (await page.$(selector)) {
        return true;
      }
    }
  }
  if (detectors.globalVariables) {
    const globals = await page.evaluate((vars) => {
      return vars.map((v) => globalThis[v] !== void 0);
    }, detectors.globalVariables);
    if (globals.some((exists) => exists)) {
      return true;
    }
  }
  if (detectors.cssCommentRegex) {
    const styles = await page.evaluate(() => {
      return Array.from(globalThis.document.styleSheets).map((sheet) => {
        try {
          return Array.from(sheet.cssRules).map((rule) => rule.cssText).join("\n");
        } catch {
          return "";
        }
      }).join("\n");
    });
    if (new RegExp(detectors.cssCommentRegex).test(styles)) {
      return true;
    }
  }
  return false;
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Please provide URLs as arguments");
    process.exit(1);
  }
  const options = {
    url: args[0],
    headless: true,
    onProgress: (progress) => {
      console.log(JSON.stringify(progress));
    }
  };
  findTech(options).then((results) => {
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  }).catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
}

export { findTech };
