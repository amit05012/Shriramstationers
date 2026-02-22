// Feature: Smart Merge with Thumbnails & Watermarking
async function executeMerge() {
    const addNumbers = document.getElementById('opt-page-numbers')?.checked;
    const addSmartBlanks = document.getElementById('opt-smart-blanks')?.checked;
    
    showLoading("Generating Shriram Premium PDF...");
    const { PDFDocument, rgb, StandardFonts } = PDFLib;
    
    try {
        const mergedPdf = await PDFDocument.create();
        const watermarkText = "Shriramstationers.in"; // Your branding

        for (const file of workspaceFiles) {
            const pdf = await PDFDocument.load(await file.arrayBuffer());
            const pageCount = pdf.getPageCount();
            
            // Copy pages
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));

            // Feature: Add Blank Page if pages are odd (For Double-Side Printing)
            // Logic: Total pages % 2 !== 0
            if (addSmartBlanks && pageCount % 2 !== 0) {
                mergedPdf.addPage(); 
            }
        }

        // Feature: Auto-Watermark and Page Numbers
        const pages = mergedPdf.getPages();
        const font = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
        
        pages.forEach((page, index) => {
            const { width, height } = page.getSize();
            // Watermark
            page.drawText(watermarkText, {
                x: width / 2 - 50, y: height - 30, size: 10, font, color: rgb(0.8, 0.8, 0.8), opacity: 0.5
            });
            // Page Numbering
            if (addNumbers) {
                page.drawText(`${index + 1}`, { x: width / 2, y: 15, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
            }
        });

        downloadAndNotify(await mergedPdf.save(), "Shriram_Merged_Notes.pdf");
    } catch (e) { console.error(e); } finally { hideLoading(); closeWorkspace(); }
}

// Feature: Sort Files by Name
function sortFilesByName() {
    workspaceFiles.sort((a, b) => a.name.localeCompare(b.name));
    renderFileList();
}

// Feature: Visual Thumbnails in Drag & Drop List
async function generateThumbnail(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 0.2 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    return canvas.toDataURL();
}
