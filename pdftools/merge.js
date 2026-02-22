// ==========================================
// Shriram Stationers - Smart Merge Engine
// ==========================================

async function executeMerge() {
    if (workspaceFiles.length < 2) return alert("Please select at least 2 PDF files to merge.");
    
    const addNumbers = document.getElementById('opt-page-numbers').checked;
    const addBlanks = document.getElementById('opt-smart-blanks').checked;
    
    showLoading("Merging & Watermarking...");
    const { PDFDocument, rgb, StandardFonts } = PDFLib;

    try {
        const mergedPdf = await PDFDocument.create();
        const watermark = "Shriramstationers.in";

        for (const item of workspaceFiles) {
            const pdf = await PDFDocument.load(await item.file.arrayBuffer());
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(p => mergedPdf.addPage(p));

            // SMART BLANK PAGE: If page count is odd, add blank to keep next file starting on new sheet
            if (addBlanks && pdf.getPageCount() % 2 !== 0) {
                mergedPdf.addPage(); 
            }
        }

        const font = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
        const allPages = mergedPdf.getPages();

        allPages.forEach((page, i) => {
            const { width, height } = page.getSize();
            
            // Automatic Watermark at the top of every page
            page.drawText(watermark, {
                x: width / 2 - 60, y: height - 25, size: 10, font, 
                color: rgb(0.7, 0.7, 0.7), opacity: 0.4
            });

            // Optional Page Numbers
            if (addNumbers) {
                page.drawText(`Page ${i + 1}`, { 
                    x: width / 2 - 15, y: 15, size: 10, font, color: rgb(0.3, 0.3, 0.3) 
                });
            }
        });

        const bytes = await mergedPdf.save();
        hideLoading();
        closeWorkspace();
        
        // Final download and WhatsApp prompt
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "Shriram_Merged_Notes.pdf";
        link.click();
        
        setTimeout(() => {
            if (confirm("✅ Your Merged PDF is ready!\n\nक्या आप इसे प्रिंट के लिए Shriram Stationers WhatsApp पर भेजना चाहते हैं?")) {
                window.open(`https://wa.me/919414711702?text=नमस्ते श्रीराम स्टेशनर्स, मैंने आपकी वेबसाइट से नोट्स तैयार किए हैं। कृपया इन्हें प्रिंट कर दीजिए।`, '_blank');
            }
        }, 1200);

    } catch (err) {
        console.error(err);
        hideLoading();
        alert("Error merging files. Make sure they are not password protected.");
    }
}
