/**
 * Pure TypeScript client-side PDF synthesizer
 * Generates lightweight, compliant PDF documents for sample novels
 * so users can view and download genuine PDF files immediately without external server dependencies.
 */

export function generateNovelPdfBlob(novel: {
  title: string;
  author: string;
  genre: string;
  description: string;
  contentPages?: string[];
}): Blob {
  const pages = novel.contentPages && novel.contentPages.length > 0 
    ? novel.contentPages 
    : [
        `${novel.title}\n\nOleh: ${novel.author}\nGenre: ${novel.genre}\n\n${novel.description}`
      ];

  // Helper to escape PDF strings
  const sanitize = (text: string) => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/[^\x20-\x7E\n]/g, ' '); // Keep standard printable ASCII
  };

  // Build standard PDF structure
  const pdfObjects: string[] = [];
  const pageObjectIds: number[] = [];

  // Object 1: Catalog
  // Object 2: Outlines
  // Object 3: Pages Root
  // Objects 4+: Font, and for each page: Page Object + Content Stream

  let currentObjId = 4;
  const fontObjId = currentObjId++;

  // We will build Page objects and Stream objects
  const pageEntries: { pageObjId: number; streamObjId: number; content: string }[] = [];

  pages.forEach((pageText, idx) => {
    const pageObjId = currentObjId++;
    const streamObjId = currentObjId++;
    pageObjectIds.push(pageObjId);

    // Format text into PDF stream commands
    const lines = pageText.split('\n');
    let streamBody = 'BT\n/F1 14 Tf\n50 750 Td\n';
    
    // Header
    const safeTitle = sanitize(novel.title).slice(0, 40);
    streamBody += `(${safeTitle} - Halaman ${idx + 1}) Tj\n0 -28 Td\n/F1 11 Tf\n`;

    let yOffset = 700;
    for (const rawLine of lines) {
      if (!rawLine.trim()) {
        streamBody += '0 -16 Td\n';
        yOffset -= 16;
        continue;
      }
      // Word wrap roughly 65 characters per line
      const words = rawLine.split(' ');
      let lineBuf = '';
      for (const word of words) {
        if ((lineBuf + ' ' + word).length > 65) {
          streamBody += `(${sanitize(lineBuf.trim())}) Tj\n0 -16 Td\n`;
          yOffset -= 16;
          lineBuf = word;
        } else {
          lineBuf += (lineBuf ? ' ' : '') + word;
        }
        if (yOffset < 60) break; // page bounds
      }
      if (lineBuf.trim() && yOffset >= 60) {
        streamBody += `(${sanitize(lineBuf.trim())}) Tj\n0 -16 Td\n`;
        yOffset -= 16;
      }
      if (yOffset < 60) break;
    }

    streamBody += 'ET';
    pageEntries.push({ pageObjId, streamObjId, content: streamBody });
  });

  // Now assemble object index
  const objects: { [id: number]: string } = {};

  // 1: Catalog
  objects[1] = `1 0 obj\n<< /Type /Catalog /Pages 3 0 R >>\nendobj`;

  // 2: Outlines
  objects[2] = `2 0 obj\n<< /Type /Outlines /Count 0 >>\nendobj`;

  // 3: Pages
  const kidsStr = pageObjectIds.map(id => `${id} 0 R`).join(' ');
  objects[3] = `3 0 obj\n<< /Type /Pages /Kids [ ${kidsStr} ] /Count ${pageObjectIds.length} >>\nendobj`;

  // Font
  objects[fontObjId] = `${fontObjId} 0 obj\n<< /Type /Font /Subtype /Type1 /Name /F1 /BaseFont /Helvetica >>\nendobj`;

  // Pages & Content streams
  pageEntries.forEach(entry => {
    objects[entry.pageObjId] = `${entry.pageObjId} 0 obj\n<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842] /Contents ${entry.streamObjId} 0 R /Resources << /Font << /F1 ${fontObjId} 0 R >> >> >>\nendobj`;
    
    const streamLen = entry.content.length;
    objects[entry.streamObjId] = `${entry.streamObjId} 0 obj\n<< /Length ${streamLen} >>\nstream\n${entry.content}\nendstream\nendobj`;
  });

  // Construct PDF buffer
  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const xref: number[] = [0];

  const totalObjs = currentObjId - 1;
  for (let i = 1; i <= totalObjs; i++) {
    xref.push(pdf.length);
    pdf += objects[i] + '\n';
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${totalObjs + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= totalObjs; i++) {
    const offsetStr = xref[i].toString().padStart(10, '0');
    pdf += `${offsetStr} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${totalObjs + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}
