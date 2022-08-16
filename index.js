// index.js
const TinyScraper = require('./tiny-scraper');
const scraper = new TinyScraper('http://localhost:8000/url1');
console.log(scraper, "scraper")
scraper.on('scrapeSuccess', (data) => {
    console.log('JSON Data received:', data);
});

scraper.on('scrapeStarted', (data) => {
    console.log('Started Scraping:', data);
});

// scraper.parseUrl('http://localhost:8000/url1')
// scraper.ScapperEvent()


// scraper.on('error', () => {
//     console.log('The URL is not valid.');
// });


scraper.on('timeout', () => {
    console.log('Scraping timed out');
});
// scraper.ScapperEvent('http://localhost:8000/url1')
