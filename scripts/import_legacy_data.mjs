#!/usr/bin/env node
/**
 * Thanjai Property - Legacy Data Import Script
 * 
 * Reads thanjaiportal_db.sql and All_Report_19_07_26_ (4).xls
 * Converts data to CRM-compatible JSON format.
 * 
 * Run: node scripts/import_legacy_data.mjs
 * Output: scripts/imported_properties.json, scripts/imported_leads.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// -----------------------------------------------------------------
// STEP 1: DISTRICT MAP (SQL uses numeric IDs -> human name)
// -----------------------------------------------------------------
const DISTRICT_MAP = {
  '1': 'Thanjavur', '2': 'Trichy', '3': 'Madurai', '4': 'Chennai',
  '5': 'Coimbatore', '6': 'Kumbakonam', '7': 'Salem', '8': 'Erode',
  '9': 'Tirunelveli', '10': 'Vellore', '11': 'Puducherry',
  '12': 'Dindigul', '13': 'Tirupur', '14': 'Karur', '15': 'Nagapattinam',
  '16': 'Ariyalur', '17': 'Cuddalore', '18': 'Dharmapuri', '19': 'Kancheepuram',
  '20': 'Krishnagiri', '21': 'Namakkal', '22': 'Nilgiris', '23': 'Perambalur',
  '24': 'Ramanathapuram', '25': 'Sivaganga', '26': 'Theni',
  '27': 'Thoothukudi', '28': 'Tiruvallur', '29': 'Tiruvannamalai',
  '30': 'Tiruvarur', '31': 'Virudhunagar'
};

// -----------------------------------------------------------------
// STEP 2: STATUS MAP (SQL pro_status -> CRM status)
// -----------------------------------------------------------------
const STATUS_MAP = {
  'A': 'Available', 'Y': 'Available', 'Active': 'Available',
  'B': 'Booked', 'S': 'Sold', 'D': 'Inactive',
  'Inactive': 'Inactive', 'Sold': 'Sold', 'Booked': 'Booked',
  'R': 'Rented', 'P': 'Pending Approval', 'Block': 'Inactive'
};

// -----------------------------------------------------------------
// STEP 3: PROPERTY TYPE MAP
// -----------------------------------------------------------------
const PROP_TYPE_MAP = {
  'Residential Plot / Land': { type: 'Plot', category: 'plots' },
  'Residential Plot': { type: 'Plot', category: 'plots' },
  'Plot': { type: 'Plot', category: 'plots' },
  'Agricultural Land': { type: 'Plot', category: 'agricultural' },
  'Agricultural': { type: 'Plot', category: 'agricultural' },
  'Farm Land': { type: 'Plot', category: 'agricultural' },
  'Farm House': { type: 'Villa', category: 'villas' },
  'Villa': { type: 'Villa', category: 'villas' },
  'Independent House / Villa': { type: 'Villa', category: 'houses' },
  'Independent House': { type: 'Villa', category: 'houses' },
  'House': { type: 'Villa', category: 'houses' },
  'Apartment': { type: 'Apartment', category: 'apartments' },
  'Flat': { type: 'Apartment', category: 'apartments' },
  'Flats': { type: 'Apartment', category: 'apartments' },
  'Office Space': { type: 'Office', category: 'commercial' },
  'Office': { type: 'Office', category: 'commercial' },
  'Commercial': { type: 'Office', category: 'commercial' },
  'Shop': { type: 'Retail', category: 'commercial' },
  'Showroom': { type: 'Retail', category: 'commercial' },
  'Warehouse': { type: 'Warehouse', category: 'commercial' },
  'Industrial': { type: 'Warehouse', category: 'commercial' },
  'Penthouse': { type: 'Penthouse', category: 'apartments' },
  'Studio': { type: 'Studio', category: 'apartments' },
  'Townhouse': { type: 'Townhouse', category: 'houses' }
};

// -----------------------------------------------------------------
// STEP 3b: Parse AREA MAP from SQL (area_id -> area_name)
// -----------------------------------------------------------------
function parseAreaMap(sqlContent) {
  const areaMap = {};
  const insertStart = sqlContent.indexOf('INSERT INTO `tbl_area`');
  if (insertStart === -1) return areaMap;
  const insertEnd = sqlContent.indexOf(';\n', insertStart);
  const block = sqlContent.substring(insertStart, insertEnd + 1);
  const rows = block.match(/\(\d+,[^)]+\)/g) || [];
  rows.forEach(row => {
    const parts = row.replace(/^\(|\)$/g, '').split(',');
    const id = parts[0]?.trim();
    const name = parts[3]?.trim().replace(/^'|'$/g, '');
    if (id && name) areaMap[id] = name;
  });
  console.log(`Built area map with ${Object.keys(areaMap).length} entries`);
  return areaMap;
}

// -----------------------------------------------------------------
// UTIL: Strip HTML tags & clean messy text
// -----------------------------------------------------------------
function stripHtml(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]*>/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ').replace(/[<>]+/g, '')
    .replace(/\s+/g, ' ').trim();
}

// -----------------------------------------------------------------
// UTIL: Format price (using ASCII to avoid encoding issues)
// -----------------------------------------------------------------
function formatPrice(val) {
  if (!val) return 'Contact for pricing';
  const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
  if (isNaN(num) || num <= 0) return 'Contact for pricing';
  // Using Rs. prefix instead of rupee symbol to avoid latin1 encoding mismatch
  if (num >= 10000000) return 'Rs. ' + (num / 10000000).toFixed(2).replace(/\.00$/, '') + ' Crore';
  if (num >= 100000) return 'Rs. ' + (num / 100000).toFixed(2).replace(/\.00$/, '') + ' Lakhs';
  return 'Rs. ' + num.toLocaleString('en-IN');
}

// -----------------------------------------------------------------
// UTIL: Resolve property type
// -----------------------------------------------------------------
function resolveType(proPropertyType) {
  const input = (proPropertyType || '').trim();
  for (const [key, val] of Object.entries(PROP_TYPE_MAP)) {
    if (input.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { type: 'Other', category: 'plots' };
}

// -----------------------------------------------------------------
// STEP 4: PARSE SQL - Extract tbl_property INSERT rows
// -----------------------------------------------------------------
function parseSQLProperties(sqlContent, areaMap = {}) {
  console.log('Parsing SQL properties...');
  
  // Find the INSERT statement for tbl_property
  const insertStart = sqlContent.indexOf("INSERT INTO `tbl_property`");
  if (insertStart === -1) {
    console.error('ERROR: Could not find INSERT INTO tbl_property in SQL file!');
    return [];
  }
  
  // Find end of this INSERT block (ends with ;)
  let insertEnd = sqlContent.indexOf(';\n', insertStart);
  if (insertEnd === -1) insertEnd = sqlContent.indexOf(';', insertStart);
  
  const insertBlock = sqlContent.substring(insertStart, insertEnd + 1);
  
  // Parse the column names from the header
  const colMatch = insertBlock.match(/INSERT INTO `tbl_property` \(([^)]+)\)/);
  if (!colMatch) { console.error('No column names found'); return []; }
  const columns = colMatch[1].split(',').map(c => c.trim().replace(/`/g, ''));
  console.log(`Found ${columns.length} columns`);
  
  // Extract the VALUES portion
  const valuesStart = insertBlock.indexOf('VALUES\n') + 7;
  const valuesBlock = insertBlock.substring(valuesStart).trim();
  
  // Parse each row - they're multi-value INSERTs
  const properties = [];
  let i = 0;
  let rowCount = 0;
  
  while (i < valuesBlock.length) {
    if (valuesBlock[i] !== '(') { i++; continue; }
    
    // Extract one complete row
    let depth = 0;
    let inStr = false;
    let strChar = '';
    let escaped = false;
    let start = i;
    
    for (; i < valuesBlock.length; i++) {
      const ch = valuesBlock[i];
      if (escaped) { escaped = false; continue; }
      if (ch === '\\') { escaped = true; continue; }
      if (!inStr && (ch === "'" || ch === '"')) { inStr = true; strChar = ch; continue; }
      if (inStr && ch === strChar) { inStr = false; continue; }
      if (!inStr && ch === '(') depth++;
      if (!inStr && ch === ')') {
        depth--;
        if (depth === 0) { i++; break; }
      }
    }
    
    const rowStr = valuesBlock.substring(start + 1, i - 1);
    
    // Parse values from row
    const values = parseRowValues(rowStr);
    
    if (values.length < columns.length) {
      continue;
    }
    
    // Map to column object
    const row = {};
    columns.forEach((col, idx) => { row[col] = values[idx] || ''; });
    
    // Convert to CRM property format
    const prop = mapPropertyRow(row, areaMap);
    if (prop) {
      properties.push(prop);
      rowCount++;
    }
  }
  
  console.log(`Parsed ${rowCount} properties from SQL.`);
  return properties;
}

// -----------------------------------------------------------------
// UTIL: Parse a single SQL row string into array of values
// -----------------------------------------------------------------
function parseRowValues(rowStr) {
  const values = [];
  let i = 0;
  
  while (i <= rowStr.length) {
    // Skip whitespace
    while (i < rowStr.length && rowStr[i] === ' ') i++;
    if (i >= rowStr.length) break;
    
    if (rowStr[i] === "'") {
      // String value
      i++;
      let val = '';
      let escaped = false;
      while (i < rowStr.length) {
        const ch = rowStr[i];
        if (escaped) {
          if (ch === 'n') val += '\n';
          else if (ch === 'r') val += '\r';
          else if (ch === 't') val += '\t';
          else val += ch;
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === "'") {
          i++;
          // Check for escaped quote ('')
          if (i < rowStr.length && rowStr[i] === "'") {
            val += "'";
          } else {
            break;
          }
        } else {
          val += ch;
        }
        i++;
      }
      values.push(val);
    } else if (rowStr.substring(i, i + 4) === 'NULL') {
      values.push(null);
      i += 4;
    } else {
      // Numeric value
      let val = '';
      while (i < rowStr.length && rowStr[i] !== ',') {
        val += rowStr[i]; i++;
      }
      values.push(val.trim() || null);
    }
    
    // Skip comma
    if (i < rowStr.length && rowStr[i] === ',') i++;
  }
  
  return values;
}

// -----------------------------------------------------------------
// STEP 5: MAP ONE SQL PROPERTY ROW -> CRM PropertyRecord
// -----------------------------------------------------------------
function mapPropertyRow(row, areaMap = {}) {
  const genId = (row.pro_gen_id || '').trim();
  if (!genId) return null;
  
  const rawStatus = row.pro_status || 'A';
  const status = STATUS_MAP[rawStatus] || STATUS_MAP[rawStatus.toUpperCase()] || 'Available';
  
  const { type, category } = resolveType(row.pro_property_type);
  
  const transType = (row.pro_transaction_type || 'Sale').toLowerCase();
  const purpose = transType.includes('rent') || transType.includes('lease') ? 'rent' : 'buy';
  
  const districtName = DISTRICT_MAP[row.pro_district] || row.pro_district || 'Thanjavur';
  // Use area map to resolve numeric area ID to a readable area name
  const areaId = (row.pro_area || '').trim();
  const areaName = areaMap[areaId] || (isNaN(areaId) ? areaId : '');
  const location = areaName ? `${areaName}, ${districtName}` : districtName;
  
  // Size
  const covArea = row.pro_coveredarea || '';
  const plotArea = row.pro_plot_landarea || '';
  const covSize = row.pro_coveredarea_size || 'Sq.Ft';
  const plotSize = row.pro_plot_landarea_size || 'Sq.Ft';
  let size = '';
  if (covArea && covArea !== '0') size = `${covArea} ${covSize}`;
  else if (plotArea && plotArea !== '0') size = `${plotArea} ${plotSize}`;
  
  // Bedrooms/Bathrooms - only for residential
  const isResidential = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio'].includes(type);
  const bedrooms = isResidential && row.pro_no_of_bedrooms && row.pro_no_of_bedrooms !== '0'
    ? parseInt(row.pro_no_of_bedrooms) : null;
  const bathrooms = isResidential && row.pro_no_of_bathrooms && row.pro_no_of_bathrooms !== '0'
    ? parseInt(row.pro_no_of_bathrooms) : null;
  
  // Price
  const priceRaw = row.pro_total_price || '';
  const price = parseFloat(String(priceRaw).replace(/[^0-9.]/g, '')) || 0;
  const priceFormatted = price > 0 ? formatPrice(price) : (row.pro_price_display || 'Contact for pricing');
  
  // Description & features
  const description = stripHtml(row.pro_brief_description || row.pro_specification_short || row.pro_specification_full || '');
  const amenitiesRaw = stripHtml(row.pro_amenities || '');
  const features = amenitiesRaw ? amenitiesRaw.split(/[,\n|]/).map(f => f.trim()).filter(f => f.length > 2 && f.length < 60) : [];
  
  // Owner contact
  const ownerName = row.pro_con_name || 'Thanjai Property';
  const ownerPhone = row.pro_con_mobileno || '8489996852';
  
  // Furnishing
  const furnishMap = {
    'Full': 'Fully Furnished', 'Fully': 'Fully Furnished',
    'Semi': 'Semi-Furnished', 'Un': 'Unfurnished', 'Bare': 'Unfurnished', '': 'Not specified'
  };
  let furnishing = 'Not specified';
  const furnRaw = (row.pro_furnished || '').trim();
  for (const [key, val] of Object.entries(furnishMap)) {
    if (key && furnRaw.toLowerCase().startsWith(key.toLowerCase())) { furnishing = val; break; }
  }
  
  // Availability based on status
  const availability = status;
  
  // Category label
  const categoryLabelMap = {
    'villas': 'Luxury Villa', 'houses': 'Independent House', 'apartments': 'Apartment',
    'plots': purpose === 'rent' ? 'Plots for Rent' : 'Plots for Sale',
    'agricultural': 'Agricultural Land', 'commercial': 'Commercial Space'
  };
  const categoryLabel = categoryLabelMap[category] || type;
  
  return {
    id: genId,
    title: stripHtml(row.pro_name || `${type} in ${districtName}`),
    type,
    category,
    categoryRaw: row.pro_transaction_type || 'Sale',
    categoryLabel,
    purpose,
    price,
    priceFormatted,
    location,
    district: districtName,
    address: stripHtml(row.pro_address || location),
    size,
    bedrooms,
    bathrooms,
    furnishing,
    status,
    availability,
    latitude: '',
    longitude: '',
    videoUrl: row.pro_video_url || '',
    ownerName,
    ownerPhone,
    listedBy: row.pro_postby || 'Thanjai Property',
    images: [],
    description: description.substring(0, 1000),
    features: features.slice(0, 10),
    createdAt: new Date().toISOString(),
    _legacy: true
  };
}

// -----------------------------------------------------------------
// STEP 6: PARSE XLS (HTML) - Extract user rows
// -----------------------------------------------------------------
function parseXLSUsers(xlsContent) {
  console.log('Parsing XLS users...');
  
  // Extract all TR rows
  const trMatches = xlsContent.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
  const users = [];
  let rowNum = 0;
  
  for (const tr of trMatches) {
    rowNum++;
    if (rowNum <= 2) continue; // skip header rows
    
    // Extract TD/TH values
    const tds = tr.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) || [];
    const cells = tds.map(td => {
      return td.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    });
    
    if (cells.length < 4) continue;
    
    const sno = cells[0];
    const userId = cells[1] || '';
    const name = cells[2] || '';
    const mobile = cells[3] || '';
    const email = cells[4] || '';
    const userType = cells[5] || 'Individual';
    const date = cells[6] || '';
    
    if (!name || !mobile || name === 'Customer Name') continue;
    
    // Create a lead from this user
    const leadId = `LEGACY-USER-${userId || rowNum}`;
    users.push({
      id: leadId,
      name: name.trim(),
      mobile: mobile.trim().replace(/\D/g, '').slice(-10),
      phone: mobile.trim().replace(/\D/g, '').slice(-10),
      whatsapp: mobile.trim().replace(/\D/g, '').slice(-10),
      email: (email || '').trim(),
      location: 'Thanjavur',
      city: 'Thanjavur',
      area: 'Thanjavur',
      country: 'India',
      budgetMin: '',
      budgetMax: '',
      budget: '',
      bedrooms: '',
      notes: `Legacy customer imported from portal. Type: ${userType}`,
      type: 'Residential Plot',
      propertyType: 'Residential Plot',
      requirement: 'Residential Plot',
      source: 'Legacy Import',
      assignTo: 'Unassigned',
      assignedTo: 'Unassigned',
      status: 'New',
      followup: '—',
      createdAt: date ? new Date(date).getTime() : Date.now(),
      timeline: [{
        type: 'note',
        text: `Legacy customer imported from portal. Original registration: ${date || 'Unknown'}`,
        by: 'System',
        at: new Date().toISOString()
      }]
    });
  }
  
  console.log(`Parsed ${users.length} users from XLS.`);
  return users;
}

// -----------------------------------------------------------------
// STEP 7: DEDUP - Remove entries with duplicate IDs
// -----------------------------------------------------------------
function dedup(arr, idKey = 'id') {
  const seen = new Set();
  return arr.filter(item => {
    const id = item[idKey];
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

// -----------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------
console.log('=== Thanjai Property - Legacy Data Import ===\n');

const sqlPath = path.join(ROOT, 'thanjaiportal_db.sql');
const xlsPath = path.join(ROOT, 'All_Report_19_07_26_ (4).xls');

if (!fs.existsSync(sqlPath)) {
  console.error(`ERROR: SQL file not found: ${sqlPath}`);
  process.exit(1);
}

console.log('Reading SQL file...');
const sqlContent = fs.readFileSync(sqlPath, 'latin1');
console.log(`SQL file size: ${(sqlContent.length / 1024 / 1024).toFixed(1)} MB`);

// Build area lookup map
const AREA_MAP = parseAreaMap(sqlContent);

const properties = parseSQLProperties(sqlContent, AREA_MAP);
const dedupedProperties = dedup(properties, 'id');
console.log(`After dedup: ${dedupedProperties.length} unique properties`);

let leads = [];
if (fs.existsSync(xlsPath)) {
  console.log('\nReading XLS file...');
  const xlsContent = fs.readFileSync(xlsPath, 'utf8');
  leads = parseXLSUsers(xlsContent);
  leads = dedup(leads, 'id');
  console.log(`After dedup: ${leads.length} unique leads`);
} else {
  console.warn(`WARNING: XLS file not found: ${xlsPath}`);
}

// Save output files
const propsOut = path.join(__dirname, 'imported_properties.json');
const leadsOut = path.join(__dirname, 'imported_leads.json');

fs.writeFileSync(propsOut, JSON.stringify(dedupedProperties, null, 2), 'utf8');
fs.writeFileSync(leadsOut, JSON.stringify(leads, null, 2), 'utf8');

console.log(`\n✅ Done!`);
console.log(`   Properties: ${dedupedProperties.length} → ${propsOut}`);
console.log(`   Leads:      ${leads.length} → ${leadsOut}`);

// Print status breakdown
const statusCounts = {};
dedupedProperties.forEach(p => {
  statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
});
console.log('\nProperty Status Breakdown:');
Object.entries(statusCounts).forEach(([s, c]) => console.log(`  ${s}: ${c}`));
