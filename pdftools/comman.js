// ==========================================
// Shriram Stationers - UI & Thumbnail Engine
// ==========================================

const SHOP_NUMBER = "919414711702";
let workspaceFiles = []; 
let draggedItemIndex = null;

const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

function openWorkspace(tool) {
    workspaceFiles = [];
    renderFileList();
    document.getElementById('workspace-modal').classList.remove('hidden');
}

function closeWorkspace() {
    document.getElementById('workspace-modal').classList.add('hidden');
}

// Visual Thumbnail Generation
async function generateThumbnail(file) {
    try {
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
    } catch (e) { return null; }
}

document.getElementById('file-input').addEventListener('change', async function(e) {
    const files = Array.from(e.target.files);
    showLoading("Generating thumbnails...");
    for (const file of files) {
        const thumb = await generateThumbnail(file);
        workspaceFiles.push({ file, thumb, name: file.name });
    }
    hideLoading();
    renderFileList();
});

function sortFilesByName() {
    workspaceFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'}));
    renderFileList();
}

function renderFileList() {
    const list = document.getElementById('file-list');
    list.innerHTML = '';
    workspaceFiles.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = "flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded-xl cursor-move group hover:border-blue-500 transition";
        div.draggable = true;
        
        div.ondragstart = () => { draggedItemIndex = index; };
        div.ondrop = (e) => {
            const draggedFile = workspaceFiles.splice(draggedItemIndex, 1)[0];
            workspaceFiles.splice(index, 0, draggedFile);
            renderFileList();
        };
        div.ondragover = (e) => e.preventDefault();

        div.innerHTML = `
            <div class="flex items-center gap-3 truncate">
                <i class="fas fa-grip-vertical text-slate-600 group-hover:text-blue-400"></i>
                ${item.thumb ? `<img src="${item.thumb}" class="pdf-thumb shadow-md">` : `<div class="pdf-thumb flex items-center justify-center bg-slate-900"><i class="fas fa-file-pdf text-red-500"></i></div>`}
                <span class="text-white text-sm truncate font-medium">${item.name}</span>
            </div>
            <button onclick="workspaceFiles.splice(${index}, 1); renderFileList();" class="text-slate-500 hover:text-red-400 p-2 transition"><i class="fas fa-trash"></i></button>
        `;
        list.appendChild(div);
    });
}

function showLoading(text) {
    const loader = document.createElement('div');
    loader.id = 'shriram-loader';
    loader.className = "fixed top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full z-[9999] shadow-2xl font-bold flex items-center gap-3 animate-bounce";
    loader.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    document.body.appendChild(loader);
}
function hideLoading() { document.getElementById('shriram-loader')?.remove(); }
