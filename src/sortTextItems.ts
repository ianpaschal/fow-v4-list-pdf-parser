import { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { TextItem, TextMarkedContent } from 'pdfjs-dist/types/src/display/api';

function isTextItem(item: TextItem | TextMarkedContent): item is TextItem {
  return 'str' in item && 'transform' in item;
}

/**
 * 
 * @param pdf - PDF.js document proxy
 * @returns - Array of string arrays representing lines down and across the page
 */
export async function sortTextItems(pdf: PDFDocumentProxy): Promise<string[][]> {
  const page = await pdf.getPage(1); // Starts at 1, not 0
  const content = await page.getTextContent();

  // Sort items by Y position, then X position:
  const sortedItems = Object.values(content.items.reduce((acc, item) => {
    if (isTextItem(item) && item.str.trim().length > 0) {
      if (!acc[item.transform[5]]) {
        acc[item.transform[5]] = [];
      }
      acc[item.transform[5]] = [
        ...acc[item.transform[5]],
        item,
      ].sort((a, b) => (
        a.transform[4] - b.transform[4]
      ));
    }
    return acc;
  }, {} as Record<number, TextItem[]>)).sort((a, b) => (
    b[0].transform[5] - a[0].transform[5]
  ));
  
  return sortedItems.map((line) => line.map((item) => item.str));
}
