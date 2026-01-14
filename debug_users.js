
const fs = require('fs');
const path = require('path');

const read = (file) => JSON.parse(fs.readFileSync(path.join('data', file), 'utf8'));

const shareholders = read('shareholders.json');

const targets = ['Lakshmi Iyer', 'Arjun Patel'];

targets.forEach(name => {
  const user = shareholders.find(s => s.name === name);
  console.log('User:', name);
  if (user) {
    console.log('  -> Stored Country:', user.country);
  } else {
    console.log('  -> Not found in DB');
  }
});

