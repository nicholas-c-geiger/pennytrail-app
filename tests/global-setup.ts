import { chromium } from '@playwright/test';
import fs from 'fs';

const storageStatePath = 'tests/.auth/state.json';
const GITHUB_USER = process.env.GITHUB_USER;
const GITHUB_PASS = process.env.GITHUB_PASS;

async function isSessionValid() {
  if (!fs.existsSync(storageStatePath)) return false;
  const stats = fs.statSync(storageStatePath);
  // Consider session expired if older than 1 day
  const maxAgeMs = 24 * 60 * 60 * 1000;
  return Date.now() - stats.mtimeMs < maxAgeMs;
}

async function globalSetup() {
  if (await isSessionValid()) return;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  console.log('Navigated to /');
  await page.click('text=Log In');
  console.log('Clicked Log In button, waiting for popup or redirect...');

  // Wait for either a popup or a redirect to GitHub using waitForEvent and waitForURL
  const [popup] = await Promise.all([
    page.waitForEvent('popup').catch(() => null),
    page.waitForURL(/github.com\/login/).catch(() => null),
    page.waitForTimeout(2000), // Give time for popup/redirect
  ]);

  const githubPage = popup || page;
  if (githubPage.url().includes('github.com/login')) {
    console.log('On GitHub login page, filling credentials...');
    if (!GITHUB_USER || !GITHUB_PASS) {
      throw new Error('GITHUB_USER and GITHUB_PASS env vars must be set for automated login.');
    }
    await githubPage.fill('input[name="login"]', GITHUB_USER);
    await githubPage.fill('input[name="password"]', GITHUB_PASS);
    await githubPage.click('input[type="submit"]');
    // Wait for possible "Authorize" screen
    try {
      await githubPage.waitForSelector('button[name="authorize"]', { timeout: 5000 });
      await githubPage.click('button[name="authorize"]');
      console.log('Clicked authorize.');
    } catch {
      // Ignore if authorize button is not present
    }
  }

  // Wait for redirect back to app using waitForURL
  await githubPage.waitForURL(/localhost:3000/);
  console.log('Redirected back to app.');

  // If popup was used, copy cookies/state to main page
  if (popup) {
    const state = await githubPage.context().storageState();
    await page.context().addCookies(state.cookies);
  }

  await page.context().storageState({ path: storageStatePath });
  await browser.close();
}

export default globalSetup;
