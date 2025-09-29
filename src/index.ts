#!/usr/bin/env node
/* eslint-disable no-console */

import { build } from './operations/build';
import { parse } from './operations/parse';

console.log('FOW v4 List Parser starting...');

// Main execution
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm start <pdf-file>');
    console.log('Example: npm start my-list.pdf');
    process.exit(1);
  }
  
  const filePath = args[0];
  console.log(`Processing PDF file: ${filePath}`);
  
  try {
    const data = await parse(filePath);
    const list = build(data);
    console.log('\n=== PDF Parsing Results ===');
    console.log(JSON.stringify(list, null, 2));    
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

// Run the main function
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
