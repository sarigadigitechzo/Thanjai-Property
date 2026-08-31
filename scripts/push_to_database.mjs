#!/usr/bin/env node
/**
 * Thanjai Property - Push Legacy Properties to Server Database
 * 
 * Reads scripts/imported_properties.json
 * POSTs each property to https://thanjaiproperty.com/api.php?resource=properties
 * Skips any that already exist (409 Conflict).
 * 
 * Run: node scripts/push_to_database.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_URL = 'https://thanjaiproperty.com/api.php?resource=properties';
const PROPERTIES_FILE = path.join(__dirname, 'imported_properties.json');

if (!fs.existsSync(PROPERTIES_FILE)) {
  console.error('ERROR: imported_properties.json not found. Run import_legacy_data.mjs first!');
  process.exit(1);
}

const properties = JSON.parse(fs.readFileSync(PROPERTIES_FILE, 'utf8'));
console.log(`=== Pushing ${properties.length} legacy properties to server database ===\n`);
console.log(`API: ${API_URL}\n`);

let successCount = 0;
let skipCount = 0;
let errorCount = 0;

// First, fetch existing IDs from the database to avoid duplicates
let existingIds = new Set();
try {
  console.log('Fetching existing properties from database...');
  const res = await fetch('https://thanjaiproperty.com/api.php?resource=properties&t=' + Date.now());
  if (res.ok) {
    const existing = await res.json();
    if (Array.isArray(existing)) {
      existing.forEach(p => { if (p.id) existingIds.add(p.id); });
      console.log(`Found ${existingIds.size} existing properties in database.\n`);
    }
  }
} catch (e) {
  console.warn('Could not fetch existing properties, will attempt insert for all.\n');
}

// Push each property one by one
for (let i = 0; i < properties.length; i++) {
  const prop = properties[i];
  
  if (existingIds.has(prop.id)) {
    console.log(`[${i+1}/${properties.length}] SKIP  ${prop.id} - already in database`);
    skipCount++;
    continue;
  }

  // Clean up the property object for the API
  const payload = {
    id: prop.id,
    title: prop.title || 'Untitled Property',
    type: prop.type || 'Plot',
    category: prop.category || 'plots',
    categoryRaw: prop.categoryRaw || 'Sale',
    categoryLabel: prop.categoryLabel || 'Plots for Sale',
    purpose: prop.purpose || 'buy',
    price: prop.price || 0,
    priceFormatted: prop.priceFormatted || 'Contact for pricing',
    location: prop.location || 'Thanjavur',
    district: prop.district || 'Thanjavur',
    address: prop.address || 'Thanjavur',
    size: prop.size || '',
    bedrooms: prop.bedrooms || null,
    bathrooms: prop.bathrooms || null,
    furnishing: prop.furnishing || 'Not specified',
    status: prop.status || 'Inactive',
    availability: prop.availability || 'Inactive',
    latitude: prop.latitude || '',
    longitude: prop.longitude || '',
    videoUrl: prop.videoUrl || '',
    ownerName: prop.ownerName || 'Thanjai Property',
    ownerPhone: prop.ownerPhone || '8489996852',
    listedBy: prop.listedBy || 'Thanjai Property',
    adType: 'free',
    userId: null,
    userEmail: null,
    actualOwnerName: null,
    actualOwnerPhone: null,
    images: prop.images || [],
    description: prop.description || '',
    features: prop.features || []
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    
    if (response.ok) {
      console.log(`[${i+1}/${properties.length}] ✅ OK    ${prop.id} - ${prop.title?.substring(0, 50)}`);
      successCount++;
    } else if (response.status === 409) {
      console.log(`[${i+1}/${properties.length}] SKIP  ${prop.id} - duplicate (409)`);
      skipCount++;
    } else {
      console.log(`[${i+1}/${properties.length}] ❌ FAIL  ${prop.id} - ${response.status}: ${responseText.substring(0, 100)}`);
      errorCount++;
    }
  } catch (err) {
    console.log(`[${i+1}/${properties.length}] ❌ ERROR ${prop.id} - ${err.message}`);
    errorCount++;
  }

  // Small delay to avoid overwhelming the server
  await new Promise(r => setTimeout(r, 100));
}

console.log('\n=== DONE ===');
console.log(`✅ Inserted: ${successCount}`);
console.log(`⏭  Skipped:  ${skipCount}`);
console.log(`❌ Errors:   ${errorCount}`);
