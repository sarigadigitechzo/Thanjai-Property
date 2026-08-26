const fs = require('fs');

const sql = fs.readFileSync('thanjaiportal_db.sql', 'utf8');
const users = [];
const lines = sql.split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('INSERT INTO `tbl_register`')) {
    let insertBlock = '';
    for (let j = i; j < lines.length; j++) {
      insertBlock += lines[j] + '\n';
      if (lines[j].trim().endsWith(';')) break; 
    }
    
    const vals = insertBlock.split('),');
    for (let k = vals.length - 1; k >= 0; k--) {
      users.push(vals[k]);
      if (users.length >= 10) break;
    }
  }
  if (users.length >= 10) break;
}

fs.writeFileSync('recent_users.txt', users.join('\n\n'));
console.log('Extracted 10 recent users');
