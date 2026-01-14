
const fs = require('fs');
const path = require('path');

const read = (file) => JSON.parse(fs.readFileSync(path.join('data', file), 'utf8'));

const shareholders = read('shareholders.json');
const shares = read('shares.json');
const installments = read('installments.json');

console.log('Shareholders:', shareholders.length);
console.log('Shares:', shares.length);
console.log('Installments:', installments.length);

// Check sample installment linkage
const sampleInst = installments[0];
if (sampleInst) {
  console.log('Sample Installment ID:', sampleInst.id);
  console.log('  -> Share ID:', sampleInst.shareId);
  
  const share = shares.find(s => s.id === sampleInst.shareId);
  if (share) {
    console.log('  -> Found Share. Shareholder ID:', share.shareholderId);
    
    const shareholder = shareholders.find(s => s.id === share.shareholderId);
    if (shareholder) {
      console.log('  -> Found Shareholder:', shareholder.name, 'Country:', shareholder.country);
    } else {
      console.log('  -> Shareholder NOT FOUND');
    }
  } else {
    console.log('  -> Share NOT FOUND');
  }
}

