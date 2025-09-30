#!/usr/bin/env node
/* eslint-disable no-console */
import * as fs from 'fs';
import * as path from 'path';
import { dirname, join } from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
pdfjsLib.GlobalWorkerOptions.workerSrc = join(__dirname, '../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');

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
    // Check if file exists:
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Check if file is a PDF:
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.pdf') {
      throw new Error(`File must be a PDF: ${filePath}`);
    }
    
    // Read PDF file:
    const dataBuffer = fs.readFileSync(filePath);
        
    // Convert Buffer to Uint8Array for PDF.js:
    const uint8Array = new Uint8Array(dataBuffer);
        
    // Load & parse PDF document:
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;
    const list = await parse(pdf).then((data) => build(data));
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
