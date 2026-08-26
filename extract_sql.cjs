const fs = require('fs');

const sql = fs.readFileSync('thanjaiportal_db.sql', 'utf8');

const properties = [];
const lines = sql.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('INSERT INTO `tbl_property`')) {
    // The next line contains the VALUES
    let valuesLine = lines[i+1] || '';
    if (valuesLine.trim().startsWith('(')) {
      properties.push(valuesLine.trim());
    }
    if (properties.length >= 10) break;
  }
}

fs.writeFileSync('extracted_properties.txt', properties.join('\n'));
console.log('Extracted 10 properties');
