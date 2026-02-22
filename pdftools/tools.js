// ==========================================
// Shriram Stationers - Master PDF Toolkit Engine
// ==========================================

const SHOP_NUMBER = "919414711702";
let activeTool = '';
let workspaceFiles = []; 
let draggedItemIndex = null; 

// ==========================================
// 1. WORKSPACE UI LOGIC
// ==========================================

function openWorkspace(tool) {
    activeTool = tool;
    workspaceFiles = [];
    renderFileList();
    
    const modal = document.getElementById('workspace-modal');
    const card = document.getElementById('workspace-card');
    const title = document.getElementById('workspace-title');
    const icon = document.getElementById('workspace-icon');
    const fileInput = document.getElementById('file-input');
    const optionsDiv = document.getElementById('tool-options');
    const btnText = document.getElementById('process-btn-text');

    // Reset UI
    optionsDiv.classList.add('hidden');
    optionsDiv.innerHTML = ''; 

    // Configure Workspace based on clicked Tool
    if (tool === 'merge') {
        title.innerText = "Merge PDFs in Sequence";
        icon.innerHTML = '<i class="fas fa-layer-group"></i>';
        fileInput.multiple = true;
        fileInput.accept = 'application/pdf';
        optionsDiv.classList.remove('hidden');
        optionsDiv.innerHTML = `
            <label class="flex items-center gap-3 cursor-pointer p-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500 transition">
                <input type="checkbox" id="opt-page-numbers" class="w-5 h-5 rounded border-slate-600 text-blue-500 bg-slate-700">
                <span class="text-slate-200 font-medium">Add Page Numbers to merged document</span>
            </label>
        `;
        btnText.innerText = "Merge & Download";
    } 
    else if (tool === 'split') {
        title.innerText = "Split / Extract PDF";
        icon.innerHTML = '<i class="fas fa-cut"></i>';
        fileInput.multiple = false;
        fileInput.accept = 'application/pdf';
        btnText.innerText = "Extract Pages";
    }
    else if (tool === 'imageToPdf') {
        title.innerText = "Images to PDF";
        icon.innerHTML = '<i class="fas fa-images"></i>';
        fileInput.multiple = true;
        fileInput.accept = 'image/png, image/jpeg, image/jpg';
        btnText.innerText = "Convert to PDF";
    }
    else if (tool === 'pageNumbers') {
        title.innerText = "Add Page Numbers";
        icon.innerHTML = '<i class="fas fa-sort-numeric-down"></i>';
        fileInput.multiple = false;
        fileInput.accept = 'application/pdf';
        btnText.innerText = "Add Numbers";
    }
    else if (tool === 'combine') {
        title.innerText = "Combine Slides (2-on-1)";
        icon.innerHTML = '<i class="fas fa-th-large"></i>';
        fileInput.multiple = false;
        fileInput.accept = 'application/pdf';
        btnText.innerText = "Combine & Save Paper";
    }
    else if (tool === 'crop') {
        title.innerText = "Crop Margins";
        icon.innerHTML = '<i class="fas fa-crop-alt"></i>';
        fileInput.multiple = false;
        fileInput.accept = 'application/pdf';
        optionsDiv.classList.remove('hidden');
        optionsDiv.innerHTML = `
            <div class="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <label class="block text-slate-200 font-medium mb-2">Crop Amount (Points from edges):</label>
                <input type="number" id="opt-crop-amount" value="36" class="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                <p class="text-xs text-slate-400 mt-1">Hint: 72 points = 1 inch. 36 points removes standard textbook margins.</p>
            </div>
        `;
        btnText.innerText = "Crop Document";
    }
    else if (tool === 'rearrange') {
        title.innerText = "Rearrange Pages";
        icon.innerHTML = '<i class="fas fa-random"></i>';
        fileInput.multiple = false;
        fileInput.accept = 'application/pdf';
        btnText.innerText = "Set New Order";
    }
    else if (tool === 'compress') {
        title.innerText = "Compress PDF (Basic)";
        icon.innerHTML = '<i class="fas fa-compress-arrows-alt"></i>';
        fileInput.multiple = false;
        fileInput.accept = 'application/pdf';
        optionsDiv.classList.remove('hidden');
        optionsDiv.innerHTML = `
            <div class="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <label class="block text-slate-200 font-medium mb-2">Target File Size (KB):</label>
                <input type="number" id="opt-target-kb" placeholder="e.g., 500" class="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                <p class="text-xs text-yellow-500 mt-2"><i class="fas fa-exclamation-triangle"></i> Browser limit: We compress file structure. Hitting exact KB sizes requires backend servers.</p>
            </div>
        `;
        btnText.innerText = "Optimize & Compress";
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        card.classList.remove('scale-95');
    }, 10);
}

function closeWorkspace() {
    const modal = document.getElementById('workspace-modal');
    const card = document.getElementById('workspace-card');
    modal.classList.add('opacity-0');
    card.classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}

// ==========================================
// 2. DRAG AND DROP FILE HANDLING
// ==========================================

document.getElementById('file-input').addEventListener('change', function(e) {
    addFilesToWorkspace(Array.from(e.target.files));
});

const dropzone = document.getElementById('dropzone');
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('border-blue-500', 'bg-slate-800');
});
dropzone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-blue-500', 'bg-slate-800');
});
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-blue-500', 'bg-slate-800');
    addFilesToWorkspace(Array.from(e.dataTransfer.files));
});

function addFilesToWorkspace(files) {
    if (activeTool !== 'merge' && activeTool !== 'imageToPdf' && workspaceFiles.length >= 1) {
        alert("This tool only processes one PDF at a time.");
        return;
    }
    workspaceFiles = workspaceFiles.concat(files);
    renderFileList();
}

function removeFile(index) {
    workspaceFiles.splice(index, 1);
    renderFileList();
}

function renderFileList() {
    const list = document.getElementById('file-list');
    list.innerHTML = '';

    if (workspaceFiles.length === 0) return;

    workspaceFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = "flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-xl cursor-move hover:border-blue-500 transition group";
        item.draggable = true;
        
        item.addEventListener('dragstart', () => { draggedItemIndex = index; item.classList.add('opacity-50'); });
        item.addEventListener('dragend', () => { item.classList.remove('opacity-50'); });
        item.addEventListener('dragover', (e) => { e.preventDefault(); });
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedFile = workspaceFiles.splice(draggedItemIndex, 1)[0];
            workspaceFiles.splice(index, 0, draggedFile);
            renderFileList();
        });

        const sizeKB = (file.size / 1024).toFixed(1);
        item.innerHTML = `
            <div class="flex items-center gap-4 overflow-hidden">
                <i class="fas fa-grip-vertical text-slate-500 group-hover:text-blue-400 cursor-grab"></i>
                <i class="fas ${file.type.includes('image') ? 'fa-image text-green-400' : 'fa-file-pdf text-red-400'} text-2xl"></i>
                <div class="truncate">
                    <p class="text-white font-medium truncate">${file.name}</p>
                    <p class="text-slate-400 text-xs">${sizeKB} KB</p>
                </div>
            </div>
            <button onclick="removeFile(${index})" class="text-slate-500 hover:text-red-400 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 transition"><i class="fas fa-trash"></i></button>
        `;
        list.appendChild(item);
    });
}

// ==========================================
// 3. EXECUTION ENGINE (The 8 Tools)
// ==========================================

async function executeTool() {
    if (workspaceFiles.length === 0) return alert("Please add files first!");
    if (!checkLibrary()) return;

    if (activeTool === 'merge') await executeMerge();
    if (activeTool === 'split') await executeSplit();
    if (activeTool === 'imageToPdf') await executeImageToPdf();
    if (activeTool === 'pageNumbers') await executePageNumbers();
    if (activeTool === 'combine') await executeCombine();
    if (activeTool === 'crop') await executeCrop();
    if (activeTool === 'rearrange') await executeRearrange();
    if (activeTool === 'compress') await executeCompress();
}

// Tool 1: Merge PDFs
async function executeMerge() {
    if (workspaceFiles.length < 2) return alert("Please add at least 2 PDFs.");
    const addNumbers = document.getElementById('opt-page-numbers').checked;
    
    showLoading("Merging your PDFs...");
    const { PDFDocument, rgb, StandardFonts } = PDFLib;
    
    try {
        const mergedPdf = await PDFDocument.create();
        for (let i = 0; i < workspaceFiles.length; i++) {
            await new Promise(r => setTimeout(r, 20));
            const pdfBytes = await workspaceFiles[i].arrayBuffer();
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        if (addNumbers) {
            const font = await mergedPdf.embedFont(StandardFonts.Helvetica);
            const pages = mergedPdf.getPages();
            pages.forEach((page, index) => {
                const { width } = page.getSize();
                page.drawText(`${index + 1}`, {
                    x: width / 2, y: 20, size: 12, font: font, color: rgb(0.2, 0.2, 0.2),
                });
            });
        }

        hideLoading();
        closeWorkspace();
        downloadAndNotify(await mergedPdf.save(), "Shriram_Merged_Notes.pdf");
    } catch (err) { handleError(err); }
}

// Tool 2: Split PDF
async function executeSplit() {
    showLoading("Extracting Pages...");
    const { PDFDocument } = PDFLib;

    try {
        const originalPdf = await PDFDocument.load(await workspaceFiles[0].arrayBuffer());
        const totalPages = originalPdf.getPageCount();
        
        hideLoading(); 
        const range = prompt(`This PDF has ${totalPages} pages.\nEnter the pages to extract (e.g., 1-5):`);
        if (!range || !range.includes('-')) return;

        showLoading("Creating new PDF...");
        const [start, end] = range.split('-').map(num => parseInt(num.trim()));
        
        if (start >= 1 && end <= totalPages && start <= end) {
            const newPdf = await PDFDocument.create();
            const indicesToCopy = [];
            for (let i = start - 1; i < end; i++) indicesToCopy.push(i);

            const copiedPages = await newPdf.copyPages(originalPdf, indicesToCopy);
            copiedPages.forEach(page => newPdf.addPage(page));
            
            hideLoading();
            closeWorkspace();
            downloadAndNotify(await newPdf.save(), `Shriram_Extract_${start}-${end}.pdf`);
        } else {
            hideLoading();
            alert("Invalid page range.");
        }
    } catch (err) { handleError(err); }
}

// Tool 3: Image to PDF
async function executeImageToPdf() {
    showLoading("Converting Images...");
    const { PDFDocument } = PDFLib;

    try {
        const pdfDoc = await PDFDocument.create();
        for (let i = 0; i < workspaceFiles.length; i++) {
            await new Promise(r => setTimeout(r, 20));
            const imageBytes = await workspaceFiles[i].arrayBuffer();
            
            let image;
            if (workspaceFiles[i].type === 'image/jpeg' || workspaceFiles[i].type === 'image/jpg') {
                image = await pdfDoc.embedJpg(imageBytes);
            } else if (workspaceFiles[i].type === 'image/png') {
                image = await pdfDoc.embedPng(imageBytes);
            }
            
            const page = pdfDoc.addPage([595.28, 841.89]); 
            const { width, height } = page.getSize();
            const dims = image.scaleToFit(width - 40, height - 40); 
            
            page.drawImage(image, {
                x: width / 2 - dims.width / 2, y: height / 2 - dims.height / 2,
                width: dims.width, height: dims.height,
            });
        }
        hideLoading();
        closeWorkspace();
        downloadAndNotify(await pdfDoc.save(), "Shriram_Image_Notes.pdf");
    } catch (err) { handleError(err); }
}

// Tool 4: Dedicated Page Numbers Tool
async function executePageNumbers() {
    showLoading("Adding Page Numbers...");
    const { PDFDocument, rgb, StandardFonts } = PDFLib;

    try {
        const pdf = await PDFDocument.load(await workspaceFiles[0].arrayBuffer());
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const pages = pdf.getPages();

        pages.forEach((page, index) => {
            const { width } = page.getSize();
            page.drawText(`${index + 1} of ${pages.length}`, {
                x: width / 2 - 20, y: 20, size: 12, font: font, color: rgb(0.2, 0.2, 0.2),
            });
        });

        hideLoading();
        closeWorkspace();
        downloadAndNotify(await pdf.save(), "Shriram_Numbered_Notes.pdf");
    } catch (err) { handleError(err); }
}

// Tool 5: Combine Slides (2 pages onto 1)
async function executeCombine() {
    showLoading("Combining Slides...");
    const { PDFDocument } = PDFLib;

    try {
        const pdfBytes = await workspaceFiles[0].arrayBuffer();
        const newPdf = await PDFDocument.create();
        const embeddedPages = await newPdf.embedPdf(pdfBytes);
        
        // A4 Dimensions Portrait
        const a4Width = 595.28;
        const a4Height = 841.89;

        for (let i = 0; i < embeddedPages.length; i += 2) {
            const newPage = newPdf.addPage([a4Width, a4Height]);
            
            // Draw First Slide (Top Half)
            const slide1 = embeddedPages[i];
            const dims1 = slide1.scaleToFit(a4Width - 40, (a4Height / 2) - 40);
            newPage.drawPage(slide1, {
                x: a4Width / 2 - dims1.width / 2,
                y: a4Height - dims1.height - 20,
                width: dims1.width, height: dims1.height,
            });

            // Draw Second Slide (Bottom Half) if it exists
            if (i + 1 < embeddedPages.length) {
                const slide2 = embeddedPages[i + 1];
                const dims2 = slide2.scaleToFit(a4Width - 40, (a4Height / 2) - 40);
                newPage.drawPage(slide2, {
                    x: a4Width / 2 - dims2.width / 2,
                    y: (a4Height / 2) - dims2.height - 20,
                    width: dims2.width, height: dims2.height,
                });
            }
        }

        hideLoading();
        closeWorkspace();
        downloadAndNotify(await newPdf.save(), "Shriram_Combined_Slides.pdf");
    } catch (err) { handleError(err); }
}

// Tool 6: Crop PDF Margins
async function executeCrop() {
    const cropPoints = parseInt(document.getElementById('opt-crop-amount').value) || 36;
    showLoading("Cropping margins...");
    const { PDFDocument } = PDFLib;

    try {
        const pdf = await PDFDocument.load(await workspaceFiles[0].arrayBuffer());
        const pages = pdf.getPages();

        pages.forEach(page => {
            const { width, height } = page.getSize();
            page.setCropBox(cropPoints, cropPoints, width - (cropPoints * 2), height - (cropPoints * 2));
        });

        hideLoading();
        closeWorkspace();
        downloadAndNotify(await pdf.save(), "Shriram_Cropped_Notes.pdf");
    } catch (err) { handleError(err); }
}

// Tool 7: Rearrange Pages
async function executeRearrange() {
    showLoading("Preparing Document...");
    const { PDFDocument } = PDFLib;

    try {
        const originalPdf = await PDFDocument.load(await workspaceFiles[0].arrayBuffer());
        const totalPages = originalPdf.getPageCount();
        
        hideLoading();
        const input = prompt(`This PDF has ${totalPages} pages.\nEnter the exact new order separated by commas (e.g., 3, 1, 2, 4):`);
        if (!input) return;

        showLoading("Rearranging...");
        const newOrder = input.split(',').map(n => parseInt(n.trim()) - 1);
        
        // Validate
        if (newOrder.some(n => isNaN(n) || n < 0 || n >= totalPages)) {
            hideLoading();
            return alert("Invalid page numbers entered. Process canceled.");
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(originalPdf, newOrder);
        copiedPages.forEach(page => newPdf.addPage(page));

        hideLoading();
        closeWorkspace();
        downloadAndNotify(await newPdf.save(), "Shriram_Rearranged.pdf");
    } catch (err) { handleError(err); }
}

// Tool 8: Compress / Optimize PDF
async function executeCompress() {
    const targetKB = document.getElementById('opt-target-kb').value;
    if (!targetKB) return alert("Please enter a target KB size.");

    showLoading("Optimizing document structure...");
    const { PDFDocument } = PDFLib;

    try {
        const originalBytes = await workspaceFiles[0].arrayBuffer();
        const pdf = await PDFDocument.load(originalBytes, { updateMetadata: false });
        
        const freshPdf = await PDFDocument.create();
        const copiedPages = await freshPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => freshPdf.addPage(page));

        const optimizedBytes = await freshPdf.save({ useObjectStreams: true });
        
        hideLoading();
        closeWorkspace();
        
        const originalKB = (originalBytes.byteLength / 1024).toFixed(0);
        const newKB = (optimizedBytes.byteLength / 1024).toFixed(0);
        
        alert(`Compression finished!\n\nOriginal Size: ${originalKB} KB\nOptimized Size: ${newKB} KB\n\n(Note: Text-heavy PDFs cannot compress much further without losing print quality.)`);
        
        downloadAndNotify(optimizedBytes, "Shriram_Optimized_Notes.pdf");
    } catch (err) { handleError(err); }
}

// ==========================================
// 4. CORE HELPERS & NOTIFICATIONS
// ==========================================
function checkLibrary() {
    if (typeof PDFLib === 'undefined') {
        alert("System is loading. Please try again in a few seconds.");
        return false;
    }
    return true;
}

function showLoading(text) {
    const box = document.createElement('div');
    box.id = 'shriram-loader';
    box.innerHTML = `<div style="position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#1e293b; border:1px solid #334155; color:white; padding:15px 30px; border-radius:12px; z-index:9999; box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);">
        <h3 style="margin:0; font-size:16px; font-weight:bold; display:flex; gap:10px; align-items:center;">
            <i class="fas fa-spinner fa-spin text-blue-500"></i> ${text}
        </h3>
    </div>`;
    document.body.appendChild(box);
}

function hideLoading() {
    const loader = document.getElementById('shriram-loader');
   
