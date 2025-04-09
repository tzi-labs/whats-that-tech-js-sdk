'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const path = require('path');
const url = require('url');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const puppeteer__default = /*#__PURE__*/_interopDefaultCompat(puppeteer);
const fs__default = /*#__PURE__*/_interopDefaultCompat(fs);
const path__default = /*#__PURE__*/_interopDefaultCompat(path);

async function findTech(options) {
  const { url: url$1, headless = true, timeout = 3e4, categories, excludeCategories, customFingerprintsDir, onProgress } = options;
  let fingerprintDir = customFingerprintsDir;
  if (!fingerprintDir) {
    const localCore = path__default.join(process.cwd(), "core");
    if (await fs__default.access(localCore).then(() => true).catch(() => false)) {
      fingerprintDir = localCore;
    } else {
      fingerprintDir = path__default.join(process.cwd(), "node_modules/whats-that-tech-core");
      if (!await fs__default.access(fingerprintDir).then(() => true).catch(() => false)) {
        fingerprintDir = path__default.join(path.dirname(url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('index.cjs', document.baseURI).href)))), "core");
      }
    }
  }
  const availableCategories = await getCategories(fingerprintDir);
  onProgress?.({
    current: 1,
    total: 1,
    currentUrl: url$1,
    status: "processing"
  });
  try {
    const results = await processSingleUrl(url$1, fingerprintDir, availableCategories, headless, timeout, categories, excludeCategories, onProgress);
    onProgress?.({
      current: 1,
      total: 1,
      currentUrl: url$1,
      status: "completed"
    });
    return results;
  } catch (error) {
    onProgress?.({
      current: 1,
      total: 1,
      currentUrl: url$1,
      status: "error",
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}
async function processSingleUrl(url, fingerprintDir, availableCategories, headless, timeout, categories, excludeCategories, onProgress) {
  const browser = await puppeteer__default.launch({ headless });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle0", timeout });
    const results = [];
    const allFiles = await fs.readdir(fingerprintDir);
    for (const item of allFiles) {
      const fullPath = path__default.join(fingerprintDir, item);
      const stats = await fs__default.stat(fullPath);
      if (stats.isDirectory()) {
        const files = await fs.readdir(fullPath);
        for (const file of files) {
          if (!file.endsWith(".json")) continue;
          const fingerprintPath = path__default.join(fullPath, file);
          const fingerprintContent = await fs.readFile(fingerprintPath, "utf-8");
          const fingerprint = JSON.parse(fingerprintContent);
          if (categories && fingerprint.categories) {
            const hasMatchingCategory = fingerprint.categories.some((cat) => categories.includes(cat));
            if (!hasMatchingCategory) continue;
          }
          if (excludeCategories && fingerprint.categories) {
            const hasExcludedCategory = fingerprint.categories.some((cat) => excludeCategories.includes(cat));
            if (hasExcludedCategory) continue;
          }
          const detected = await detectTechnology(page, fingerprint);
          results.push({
            name: fingerprint.name,
            categories: fingerprint.categories || ["unidentified"],
            detected
          });
        }
      }
    }
    return results;
  } finally {
    await browser.close();
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
      return window.performance.getEntriesByType("resource").map((entry) => entry.name);
    });
    if (requests.some((url) => new RegExp(detectors.requestUrlRegex).test(url))) {
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
      return vars.map((v) => window[v] !== void 0);
    }, detectors.globalVariables);
    if (globals.some((exists) => exists)) {
      return true;
    }
  }
  if (detectors.cssCommentRegex) {
    const styles = await page.evaluate(() => {
      return Array.from(document.styleSheets).map((sheet) => {
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
async function getCategories(fingerprintDir) {
  try {
    const items = await fs.readdir(fingerprintDir);
    const categories = await Promise.all(
      items.map(async (item) => {
        const fullPath = path__default.join(fingerprintDir, item);
        const stats = await fs__default.stat(fullPath);
        return stats.isDirectory() && !item.startsWith(".") ? item : null;
      })
    );
    return categories.filter((category) => category !== null);
  } catch (error) {
    console.error("Error reading fingerprint directory:", error);
    return [];
  }
}
if ((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('index.cjs', document.baseURI).href)) === `file://${process.argv[1]}`) {
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

exports.findTech = findTech;
