const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');
const chrome = require('selenium-webdriver/chrome');

describe('Dashboard E2E', () => {
  let driver;

  beforeAll(async () => {
    // Setup ChromeDriver with options
    const options = new chrome.Options();
    options.addArguments('--headless=new'); // Run in headless mode for CI/CD
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');

    const service = new chrome.ServiceBuilder(require('chromedriver').path);

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(service)
      .build();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('should load the dashboard and display the main title', async () => {
    // Navigate to the local dev server or production URL
    const url = process.env.TEST_URL || 'http://localhost:3000';
    await driver.get(url);

    // Wait for the main dashboard container to load
    // It should have a heading with 'Creator Distribution Funnel'
    const heading = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'Creator Distribution Funnel')]")),
      10000
    );

    const text = await heading.getText();
    expect(text).toContain('Creator Distribution Funnel');
  });

  it('should have the Funnel Chart component rendered', async () => {
    // The Funnel Chart is wrapped in a Card with a specific title.
    // Let's check for the "Audience Journey" title or the recharts container.
    const funnelTitle = await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Distribution & Demand Funnel')]")),
      10000
    );

    const text = await funnelTitle.getText();
    expect(text).toContain('Distribution & Demand Funnel');
    
    // Check if recharts-wrapper exists (indicating the chart rendered)
    const chart = await driver.wait(
      until.elementLocated(By.className('recharts-wrapper')),
      5000
    );
    expect(chart).toBeDefined();
  });
});
