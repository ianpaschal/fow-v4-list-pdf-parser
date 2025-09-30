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

// Function to get all PDF files from input directory
function getPdfFiles(inputDir: string): string[] {
  if (!fs.existsSync(inputDir)) {
    throw new Error(`Input directory not found: ${inputDir}`);
  }
  
  const files = fs.readdirSync(inputDir);
  return files.filter((file) => path.extname(file).toLowerCase() === '.pdf');
}

// Function to ensure output directory exists
function ensureOutputDir(outputDir: string): void {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

// Function to process a single PDF file
async function processPdfFile(filePath: string): Promise<unknown> {
  console.log(`Processing PDF file: ${filePath}`);
  
  // Read PDF file:
  const dataBuffer = fs.readFileSync(filePath);
      
  // Convert Buffer to Uint8Array for PDF.js:
  const uint8Array = new Uint8Array(dataBuffer);
      
  // Load & parse PDF document:
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;
  const list = await parse(pdf).then((data) => build(data));

  return list;
}

// Function to save JSON to output directory
function saveJsonOutput(list: unknown, inputFileName: string, outputDir: string): void {
  const baseName = path.basename(inputFileName, '.pdf');
  const outputFileName = `${baseName}.json`;
  const outputPath = path.join(outputDir, outputFileName);
  
  fs.writeFileSync(outputPath, JSON.stringify(list, null, 2));
  console.log(`Saved: ${outputPath}`);
}

// Main execution
async function main(): Promise<void> {
  const inputDir = './input';
  const outputDir = './output';
  
  try {
    // Ensure output directory exists
    ensureOutputDir(outputDir);
    
    // Get all PDF files from input directory
    const pdfFiles = getPdfFiles(inputDir);
    
    if (pdfFiles.length === 0) {
      console.log('No PDF files found in input directory');
      return;
    }
    
    console.log(`Found ${pdfFiles.length} PDF file(s) to process`);
    
    // Process each PDF file
    for (const pdfFile of pdfFiles) {
      const filePath = path.join(inputDir, pdfFile);
      
      try {
        const list = await processPdfFile(filePath);
        saveJsonOutput(list, pdfFile, outputDir);
        console.log(`Successfully processed: ${pdfFile}\n`);
      } catch (error) {
        console.error(`Error processing ${pdfFile}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Continue processing other files even if one fails
      }
    }
    
    console.log('All files processed successfully!');
    
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

// Run the main function
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
