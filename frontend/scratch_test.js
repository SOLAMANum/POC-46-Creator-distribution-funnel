const { Builder } = require('selenium-webdriver');
require('chromedriver');
const chrome = require('selenium-webdriver/chrome');

async function test() {
  console.log("Starting chrome...");
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');

  try {
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    console.log("Chrome started successfully.");
    await driver.quit();
  } catch (e) {
    console.error("Error starting chrome:", e);
  }
}

test();
