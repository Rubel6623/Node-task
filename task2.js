const puppeteer = require('puppeteer');

async function getFlightPrices(source, destination, date) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url = `https://www.makemytrip.com/flight/search?tripType=O&itinerary=${source}-${destination}-${date}&paxType=A-1_C-0_I-0&cabinClass=E`;
  
  await page.goto(url, { waitUntil: 'networkidle2' });

  const flightSelector = '.appendBottom5.blackText.fontSize18';
  await page.waitForSelector(flightSelector);

  const flightNames = await page.evaluate(selector => {
    const elements = Array.from(document.querySelectorAll(selector));
    return elements.map(element => element.innerText.trim());
  }, flightSelector);

  const flightPriceSelector = '.actual-price';
  await page.waitForSelector(flightPriceSelector);

  const flightPrices = await page.evaluate(selector => {
    const elements = Array.from(document.querySelectorAll(selector));
    return elements.map(element => element.innerText.trim());
  }, flightPriceSelector);

  const flightData = {};
  for (let i = 0; i < flightNames.length; i++) {
    flightData[flightNames[i]] = flightPrices[i];
  }

  await browser.close();
  return flightData;
}

const source = 'Delhi';
const destination = 'Jaipur';
const date = '15 April 2023';

getFlightPrices(source, destination, date)
  .then(flightPrices => {
    console.log(flightPrices);
  })
  .catch(error => {
    console.error('Error:', error);
  });
