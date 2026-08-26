const fs = require('fs');

const sql = fs.readFileSync('thanjaiportal_db.sql', 'utf8');
const properties = [];
const lines = sql.split('\n');

// Search from bottom up for INSERT INTO `tbl_property`
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('INSERT INTO `tbl_property`')) {
    // Collect all VALUES following this insert
    // Since phpMyAdmin groups them, let's just parse the VALUES block
    let insertBlock = '';
    for (let j = i; j < lines.length; j++) {
      insertBlock += lines[j] + '\n';
      if (lines[j].trim().endsWith(';')) break; // End of statement
    }
    
    // Now split the block by '),'
    const vals = insertBlock.split('),');
    for (let k = vals.length - 1; k >= 0; k--) {
      properties.push(vals[k]);
      if (properties.length >= 10) break;
    }
  }
  if (properties.length >= 10) break;
}

fs.writeFileSync('recent_properties.txt', properties.join('\n\n'));
console.log('Extracted 10 recent properties');
