// ==========================================
// Shriram Stationers - Merge Logic
// ==========================================

async function executeMerge() {
    if (workspaceFiles.length < 2) return alert("Select at least 2 files!");
    
    const addNumbers = document.getElementById('opt-page-numbers').checked;
    const addBlanks = document.getElementById('opt-smart-blanks').checked;
    
    showLoading("Creating Shriram Premium PDF...");
    const { PDFDocument, rgb, StandardFonts } = PDFLib;

    try {
        const mergedPdf = await PDFDocument.create();
        const watermark = "Shriramstationers.in"; // Your branding

        for (const item of workspaceFiles) {
            const pdf = await PDFDocument.load(await item.file.arrayBuffer());
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(p => mergedPdf.addPage(p));

            // Logic: Add blank page if current PDF is odd for perfect 2-side printing
            if (addBlanks && pdf.getPageCount() % 2 !== 0) {
                mergedPdf.addPage(); 
            }
        }

        const font = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
        const allPages = mergedPdf.getPages();

        allPages.forEach((page, i) => {
            const { width, height } = page.getSize();
            
            // Add Shriram Watermark to every page
            page.drawText(watermark, {
                x: width / 2 - 60, y: height - 25, size: 10, font, 
                color: rgb(0.7, 0.7, 0.7), opacity: 0.4
            });

            // Add Page Numbers
            if (addNumbers) {
                page.drawText(`Page ${i + 1}`, { 
                    x: width / 2 - 15, y: 15, size: 10, font, color: rgb(0.3, 0.3, 0.3) 
                });
            }
        });

        const bytes = await mergedPdf.save();
        hideLoading();
        closeWorkspace();
        downloadAndNotify(bytes, "Shriram_Merged_Notes.pdf");

    } catch (err) {
        console.error(err);
        hideLoading();
        alert("Error merging files. Ensure they aren't password protected.");
    }
}

function downloadAndNotify(bytes, filename) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    setTimeout(() => {
        if (confirm("✅ PDF Ready! Send to Shriram Stationers (Dausa) WhatsApp for printing?")) {
            window.open(`https://wa.me/919414711702?text=नमस्ते श्रीराम स्टेशनर्स, मैंने आपकी वेबसाइट से नोट्स तैयार किए हैं। कृपया इन्हें प्रिंट कर दीजिए।`, '_blank');
        }
    }, 1000);
}
