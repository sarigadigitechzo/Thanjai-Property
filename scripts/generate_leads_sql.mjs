#!/usr/bin/env node
/**
 * Generate bulk SQL INSERT file for leads table
 * Output: scripts/leads_import.sql (for phpMyAdmin import)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const leadsFile = path.join(__dirname, 'imported_leads.json');
const outputFile = path.join(__dirname, 'leads_import.sql');

const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
console.log(`Generating SQL for ${leads.length} leads...`);

// SQL escape function
function esc(val) {
  if (val === null || val === undefined || val === '') return 'NULL';
  const str = String(val)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\x00/g, '\\0');
  return `'${str}'`;
}

const lines = [];
lines.push('-- Thanjai Property CRM - Legacy Leads Import');
lines.push('-- Generated: ' + new Date().toISOString());
lines.push('-- Total records: ' + leads.length);
lines.push('-- Table: leads (in thanjaiproperty_crm database)');
lines.push('-- Safe: Uses INSERT IGNORE to skip duplicates');
lines.push('');
lines.push('SET NAMES utf8mb4;');
lines.push('SET FOREIGN_KEY_CHECKS=0;');
lines.push('');

// Generate INSERT IGNORE statements in batches of 200 rows per statement
const BATCH = 200;
let insertedCount = 0;

for (let i = 0; i < leads.length; i += BATCH) {
  const batch = leads.slice(i, i + BATCH);
  const values = batch.map(l => {
    const id = esc(l.id);
    const name = esc(l.name);
    const phone = esc((l.mobile || l.phone || '').toString().slice(-10));
    const whatsapp = esc((l.whatsapp || l.mobile || l.phone || '').toString().slice(-10));
    const email = esc(l.email || '');
    const source = esc('Legacy Import');
    const status = esc('New');
    const budget = esc('');
    const requirement = esc('Residential Plot');
    const location = esc('Thanjavur');
    const timeline = esc('[]');
    const assignedTo = esc('Unassigned');
    const notes = esc(`Legacy portal user. Imported on ${new Date().toLocaleDateString('en-IN')}.`);
    const followup = esc('');
    
    return `(${id},${name},${phone},${whatsapp},${email},${source},${status},${budget},${requirement},${location},${timeline},${assignedTo},${notes},${followup})`;
  });
  
  lines.push(`INSERT IGNORE INTO \`leads\` (\`id\`,\`name\`,\`phone\`,\`whatsapp\`,\`email\`,\`source\`,\`status\`,\`budget\`,\`requirement\`,\`location\`,\`timeline\`,\`assignedTo\`,\`notes\`,\`followup\`) VALUES`);
  lines.push(values.join(',\n') + ';');
  lines.push('');
  
  insertedCount += batch.length;
  if (insertedCount % 2000 === 0 || insertedCount >= leads.length) {
    console.log(`  Processed ${insertedCount}/${leads.length}...`);
  }
}

lines.push('SET FOREIGN_KEY_CHECKS=1;');
lines.push('');
lines.push(`-- End of import. Total: ${leads.length} records.`);

const sqlContent = lines.join('\n');
fs.writeFileSync(outputFile, sqlContent, 'utf8');

const fileSizeKB = Math.round(fs.statSync(outputFile).size / 1024);
console.log(`\n✅ Done!`);
console.log(`   File: ${outputFile}`);
console.log(`   Size: ${fileSizeKB} KB`);
console.log(`   Records: ${leads.length}`);
console.log(`\nNow import this file via cPanel phpMyAdmin:`);
console.log(`  1. Open phpMyAdmin → thanjaiproperty_crm database`);
console.log(`  2. Click on "leads" table in left sidebar`);
console.log(`  3. Click "Import" tab at top`);
console.log(`  4. Choose file → select leads_import.sql`);
console.log(`  5. Click "Go" — done!`);
