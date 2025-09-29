import * as fs from 'fs';
import * as path from 'path';
import { dirname, join } from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
// Configure PDF.js worker
import { fileURLToPath } from 'url';

import { sortTextItems } from '../sortTextItems';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
pdfjsLib.GlobalWorkerOptions.workerSrc = join(__dirname, '../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');

/**
 * 
 * @param filePath 
 * @returns 
 */
export async function parse(filePath: string): Promise<string[][]> {
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
    return await sortTextItems(pdf);
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
