import puppeteer from 'puppeteer';
import fs, { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const isDevelopment = process.env.NODE_ENV === "development";
async function loadFingerprints() {
  const localCorePath = join(process.cwd(), "core");
  const nodeModulesCorePath = join(process.cwd(), "node_modules/whats-that-tech-core");
  const distCorePath = join(process.cwd(), "dist/core.json");
  const rootCorePath = join(process.cwd(), "core.json");
  if (existsSync(localCorePath) || existsSync(nodeModulesCorePath)) {
    const sourcePath = existsSync(localCorePath) ? localCorePath : nodeModulesCorePath;
    if (isDevelopment) {
      console.log("Loading fingerprints from:", sourcePath);
    }
    const techDirs = await readdir(sourcePath);
    const fingerprints = {};
    for (const tech of techDirs) {
      const techPath = join(sourcePath, tech);
      const stat = await fs.stat(techPath);
      if (!stat.isDirectory() || tech.startsWith(".")) continue;
      try {
        const files = await readdir(techPath);
        for (const file of files) {
          if (file.endsWith(".json")) {
            const fingerprintPath = join(techPath, file);
            const content = await readFile(fingerprintPath, "utf-8");
            fingerprints[tech] = JSON.parse(content);
            if (isDevelopment) {
              console.log(`Loaded fingerprint for ${tech}`);
            }
          }
        }
      } catch (error) {
        if (isDevelopment) {
          console.error(`Failed to load fingerprint for ${tech}:`, error);
        }
      }
    }
    if (isDevelopment) {
      if (Object.keys(fingerprints).length === 0) {
        console.warn("No fingerprints loaded from development mode");
      } else {
        console.log(`Loaded ${Object.keys(fingerprints).length} fingerprints from development mode`);
      }
    }
    return fingerprints;
  }
  try {
    const corePath = existsSync(distCorePath) ? distCorePath : rootCorePath;
    if (existsSync(corePath)) {
      if (isDevelopment) {
        console.log("Loading fingerprints from:", corePath);
      }
      const content = await readFile(corePath, "utf-8");
      const fingerprints = JSON.parse(content);
      if (isDevelopment) {
        console.log(`Loaded ${Object.keys(fingerprints).length} fingerprints from core.json`);
      }
      return fingerprints;
    }
  } catch (error) {
    if (isDevelopment) {
      console.error("Failed to load core.json:", error);
    }
  }
  if (isDevelopment) {
    console.error("No fingerprints could be loaded from any source");
  }
  return {};
}

async function findTech(options) {
  const { url, headless = true, timeout = 3e4, categories, excludeCategories, onProgress } = options;
  onProgress?.({
    current: 1,
    total: 1,
    currentUrl: url,
    status: "processing"
  });
  try {
    const fingerprints = await loadFingerprints();
    if (Object.keys(fingerprints).length === 0) {
      throw new Error("No fingerprints loaded");
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
