#!/usr/bin/env node

/**
 * Generate secure random keys for Strapi configuration
 * Run: node scripts/generate-keys.js
 */

const crypto = require('crypto');

function generateKey(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64');
}

console.log('\n=== Strapi Security Keys ===\n');
console.log('Copy these values to your .env file:\n');
console.log('# Generate 4 keys for STRAPI_APP_KEYS (comma-separated)');
console.log(`STRAPI_APP_KEYS=${generateKey()},${generateKey()},${generateKey()},${generateKey()}`);
console.log('');
console.log(`STRAPI_API_TOKEN_SALT=${generateKey(16)}`);
console.log(`STRAPI_ADMIN_JWT_SECRET=${generateKey(32)}`);
console.log(`STRAPI_JWT_SECRET=${generateKey(32)}`);
console.log(`STRAPI_TRANSFER_TOKEN_SALT=${generateKey(16)}`);
console.log('\n=== Keys Generated Successfully ===\n');
