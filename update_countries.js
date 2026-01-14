
const fs = require('fs');
const path = require('path');

const filePath = path.join('data', 'shareholders.json');
const shareholders = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const countries = ['India', 'USA', 'UK', 'UAE', 'Canada', 'Singapore', 'Australia', 'Germany', 'France'];

const updated = shareholders.map(s => {
  // Keep some as India, randomize others
  const randomCountry = countries[Math.floor(Math.random() * countries.length)];
  return { ...s, country: randomCountry };
});

fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
console.log('Updated countries for', updated.length, 'shareholders.');

