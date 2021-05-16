const chromium = require('chrome-aws-lambda');

const mailAddress = process.env.MAIL;
const password = process.env.PASSWORD;

exports.handler = async (event, context) => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  let page = await browser.newPage();

  await login(page);
  const sleep = await getSleep(page);
  await browser.close();
  return sleep;
};

const login = async (page) => {
  const url = 'https://connect.garmin.com/signin/';
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForSelector('iframe.gauth-iframe');
  const frame = page.frames().find((f) => f.url().match(/sso/));
  if (!frame) {
    throw new Error('Login form not found');
  }
  await frame.waitForSelector('input#username');
  await frame.type('input#username', mailAddress);
  await frame.type('input#password', password);
  await frame.click('#login-btn-signin');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  return;
};

const getSleep = async (page) => {
  const today = new Date().toISOString().substr(0, 10);
  const dt = new Date();
  dt.setDate(dt.getDate() - 1);
  const yesterday = dt.toISOString().substr(0, 10);
  await page.goto(`https://connect.garmin.com/modern/sleep/${yesterday}`);
  await page.waitForTimeout(1000);
  const totalSleep = await page.$('.SleepGauge_mainText__1Jbim');
  const totalSleepText = await page.evaluate(
    (element) => element.textContent,
    totalSleep
  );
  const sleepData = await page.$$eval('.DataBlock_dataField__2ZuKE', (list) => {
    return list.map((data) => data.textContent);
  });
  return {
    date: yesterday,
    totalSleepTime: totalSleepText,
    deepSleepTime: sleepData[0],
    shallowSleepTime: sleepData[1],
    remSleepTime: sleepData[2],
    awakeTime: sleepData[3],
  };
};
