import { launch, Browser, Page } from 'puppeteer';
import { CrawlData } from './types/tech-detection';

export interface CrawlResult {
  browser: Browser;
  page: Page;
  data: CrawlData;
}

export async function crawl(url: string): Promise<CrawlResult> {
  const browser = await launch();
  const page = await browser.newPage();

  const requests: { url: string; method: string; resourceType: string }[] = [];

  page.on('request', req => {
    requests.push({
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType()
    });
  });

  await page.goto(url, { waitUntil: 'networkidle2' });

  const html = await page.content();
  const cookies = await page.cookies();

  return {
    browser,
    page,
    data: {
      html,
      requests,
      cookies,
      url
    }
  };
} 