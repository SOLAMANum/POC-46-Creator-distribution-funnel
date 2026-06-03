const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');
const chrome = require('selenium-webdriver/chrome');

async function capture() {
  console.log("Setting up headless Chrome driver...");
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.addArguments('--window-size=1600,2800');

  const service = new chrome.ServiceBuilder(require('chromedriver').path);

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(service)
    .build();

  try {
    console.log("Navigating to http://localhost:3000...");
    await driver.get('http://localhost:3000');

    console.log("Waiting for page load...");
    await new Promise(resolve => setTimeout(resolve, 3500));

    console.log("Waiting 2 seconds for visual stabilization...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Capturing comparison screenshot...");
    const screenshot = await driver.takeScreenshot();
    
    const targetDir = path.join('C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\751d5fb6-9ed9-4a98-bd46-8170531dfd12');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetPath = path.join(targetDir, 'border_dashboard_compare_capture.png');
    
    fs.writeFileSync(targetPath, Buffer.from(screenshot, 'base64'));
    console.log(`Comparison screenshot saved successfully to ${targetPath}`);
  } catch (err) {
    console.error("Error during capture:", err);
  } finally {
    await driver.quit();
    console.log("Driver terminated.");
  }
}

capture();
