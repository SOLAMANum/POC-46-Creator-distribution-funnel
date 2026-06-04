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

    // Wait for the loader spinner to disappear (data has loaded from API)
    await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'INFORCREON')]"
      )),
      35000 // Allow up to 35s for Render.com cold start
    );

    // Heading should now be visible
    const heading = await driver.findElement(By.xpath("//h1[contains(text(), 'INFORCREON')]"));
    const text = await heading.getText();
    expect(text).toContain('INFORCREON');

    // Also verify the subtitle exists
    const subtitle = await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Border Crossing Trade')]")),
      10000
    );
    const subtitleText = await subtitle.getText();
    expect(subtitleText).toContain('Border Crossing Trade');
  });

  it('should have the Interactive Border Corridor Map and chart component rendered', async () => {
    // Check for the "Interactive Border Corridor Map" title
    const mapTitle = await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Interactive Border Corridor Map')]")),
      10000
    );

    const text = await mapTitle.getText();
    expect(text).toContain('Interactive Border Corridor Map');
    
    // Check if recharts-wrapper exists (indicating the chart rendered)
    const chart = await driver.wait(
      until.elementLocated(By.className('recharts-wrapper')),
      5000
    );
    expect(chart).toBeDefined();
  });
});
