// ==========================================
// Shriram Stationers - PDF Engine Part 2
// Execution Engine & 8 Tools
// ==========================================

async function executeTool() {
    if (workspaceFiles.length === 0) return alert("Add files first!");
    if (typeof PDFLib === 'undefined') return alert("Loading... try again in 3 seconds.");

    if (activeTool === 'merge') await executeMerge();
    if (activeTool === 'split') await executeSplit();
    if (activeTool === 'imageToPdf') await executeImageToPdf();
    if (activeTool === 'pageNumbers') await executePageNumbers();
    if (activeTool === 'combine') await executeCombine();
    if (activeTool === 'crop') await executeCrop();
    if (activeTool === 'rearrange') await executeRearrange();
    if (activeTool === 'compress') await executeCompress();
}

async function executeMerge() {
    showLoading("Merging...");
    const { PDFDocument, rgb, StandardFonts } = PDFLib;
    try {
        const mergedPdf = await PDFDocument.create();
        for (const f of workspaceFiles) {
            const pdf = await PDFDocument.load(await f.arrayBuffer());
            const copied = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copied.forEach(p => mergedPdf.addPage(p));
        }
        if (document.getElementById('opt-page-numbers')?.checked) {
            const font = await mergedPdf.embedFont(StandardFonts.Helvetica);
            mergedPdf.getPages().forEach((p, i) => p.drawText(`${i + 1}`, { x: p.getSize().width / 2, y: 20, size: 12, font, color: rgb(0.2,0.2,0.2) }));
        }
        downloadAndNotify(await mergedPdf.save(), "Shriram_Merged.pdf");
    } catch (e) { alert("Error merging"); } finally { hideLoading(); closeWorkspace(); }
}

async function executeSplit() {
    const { PDFDocument } = PDFLib;
    const pdf = await PDFDocument.load(await workspaceFiles[0].arrayBuffer());
    const range = prompt(`Enter range (e.g. 1-3) out of ${pdf.getPageCount()}:`);
    if (!range) return;
    showLoading("Splitting...");
    try {
        const [s, e] = range.split('-').map(n => parseInt(n.trim()));
        const newPdf = await PDFDocument.create();
        const copied = await newPdf.copyPages(pdf, Array.from({length: e-s+1}, (_, i) => s + i - 1));
        copied.forEach(p => newPdf.addPage(p));
        downloadAndNotify(await newPdf.save(), "Shriram_Split.pdf");
    } catch (err) { alert("Invalid Range"); } finally { hideLoading(); closeWorkspace(); }
}

// Additional Tool functions (Crop, Compress, etc.) use simple logic calls
async function executeCrop() {
    showLoading("Cropping...");
    const { PDFDocument } = PDFLib;
    try {
        const pdf = await PDFDocument.load(await workspaceFiles[0].arrayBuffer());
        const amt = parseInt(document.getElementById('opt-crop-amount').value);
        pdf.getPages().forEach(p => { const {width, height} = p.getSize(); p.setCropBox(amt, amt, width-amt*2, height-amt*2); });
        downloadAndNotify(await pdf.save(), "Shriram_Cropped.pdf");
    } catch(e) { alert("Error"); } finally { hideLoading(); closeWorkspace(); }
}

async function executeCombine() {
    showLoading("Combining...");
    const { PDFDocument } = PDFLib;
    try {
        const newPdf = await PDFDocument.create();
        const embedded = await newPdf.embedPdf(await workspaceFiles[0].arrayBuffer());
        for (let i = 0; i < embedded.length; i += 2) {
            const p = newPdf.addPage([595.28, 841.89]);
            p.drawPage(embedded[i], { x: 40, y: 440, width: 515, height: 380 });
            if (embedded[i+1]) p.drawPage(embedded[i+1], { x: 40, y: 40, width: 515, height: 380 });
        }
        downloadAndNotify(await newPdf.save(), "Shriram_2on1.pdf");
    } catch(e) { alert("Error"); } finally { hideLoading(); closeWorkspace(); }
}

// Common Helpers
function showLoading(t) { const b = document.createElement('div'); b.id = 'shriram-loader'; b.innerHTML = `<div style="position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#1e293b; color:white; padding:15px 30px; border-radius:12px; z-index:9999;">${t} <i class="fas fa-spinner fa-spin"></i></div>`; document.body.appendChild(b); }
function hideLoading() { document.getElementById('shriram-loader')?.remove(); }
function downloadAndNotify(b, f) {
    const url = URL.createObjectURL(new Blob([b], { type: 'application/pdf' }));
    const a = document.createElement('a'); a.href = url; a.download = f; a.click();
    setTimeout(() => { if(confirm("Print at Shriram Stationers via WhatsApp?")) window.open(`https://wa.me/919414711702?text=Print this PDF please!`); }, 1000);
}
