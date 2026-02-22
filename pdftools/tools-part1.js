// ==========================================
// Shriram Stationers - PDF Engine Part 1
// Workspace UI & File Handling
// ==========================================

const SHOP_NUMBER = "919414711702";
let activeTool = '';
let workspaceFiles = []; 
let draggedItemIndex = null; 

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

    optionsDiv.classList.add('hidden');
    optionsDiv.innerHTML = ''; 

    if (tool === 'merge') {
        title.innerText = "Merge PDFs in Sequence";
        icon.innerHTML = '<i class="fas fa-layer-group"></i>';
        fileInput.multiple = true;
        fileInput.accept = 'application/pdf';
        optionsDiv.classList.remove('hidden');
        optionsDiv.innerHTML = `<label class="flex items-center gap-3 cursor-pointer p-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500 transition"><input type="checkbox" id="opt-page-numbers" class="w-5 h-5 rounded border-slate-600 text-blue-500 bg-slate-700"><span class="text-slate-200 font-medium">Add Page Numbers to merged document</span></label>`;
        btnText.innerText = "Merge & Download";
    } 
    else if (tool === 'split') { title.innerText = "Split / Extract PDF"; icon.innerHTML = '<i class="fas fa-cut"></i>'; fileInput.multiple = false; fileInput.accept = 'application/pdf'; btnText.innerText = "Extract Pages"; }
    else if (tool === 'imageToPdf') { title.innerText = "Images to PDF"; icon.innerHTML = '<i class="fas fa-images"></i>'; fileInput.multiple = true; fileInput.accept = 'image/png, image/jpeg, image/jpg'; btnText.innerText = "Convert to PDF"; }
    else if (tool === 'pageNumbers') { title.innerText = "Add Page Numbers"; icon.innerHTML = '<i class="fas fa-sort-numeric-down"></i>'; fileInput.multiple = false; fileInput.accept = 'application/pdf'; btnText.innerText = "Add Numbers"; }
    else if (tool === 'combine') { title.innerText = "Combine Slides (2-on-1)"; icon.innerHTML = '<i class="fas fa-th-large"></i>'; fileInput.multiple = false; fileInput.accept = 'application/pdf'; btnText.innerText = "Combine & Save Paper"; }
    else if (tool === 'crop') {
        title.innerText = "Crop Margins";
        icon.innerHTML = '<i class="fas fa-crop-alt"></i>';
        fileInput.multiple = false;
        fileInput.accept = 'application/pdf';
        optionsDiv.classList.remove('hidden');
        optionsDiv.innerHTML = `<div class="p-3 bg-slate-800 rounded-xl border border-slate-700"><label class="block text-slate-200 font-medium mb-2">Crop Amount (Points):</label><input type="number" id="opt-crop-amount" value="36" class="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none"></div>`;
        btnText.innerText = "Crop Document";
    }
    else if (tool === 'rearrange') { title.innerText = "Rearrange Pages"; icon.innerHTML = '<i class="fas fa-random"></i>'; fileInput.multiple = false; fileInput.accept = 'application/pdf'; btnText.innerText = "Set New Order"; }
    else if (tool === 'compress') {
        title.innerText = "Compress PDF";
        icon.innerHTML = '<i class="fas fa-compress-arrows-alt"></i>';
        fileInput.multiple = false;
        fileInput.accept = 'application/pdf';
        optionsDiv.classList.remove('hidden');
        optionsDiv.innerHTML = `<div class="p-3 bg-slate-800 rounded-xl border border-slate-700"><label class="block text-slate-200 font-medium mb-2">Target Size (KB):</label><input type="number" id="opt-target-kb" placeholder="e.g., 500" class="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none"></div>`;
        btnText.innerText = "Optimize & Compress";
    }

    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); card.classList.remove('scale-95'); }, 10);
}

function closeWorkspace() {
    const modal = document.getElementById('workspace-modal');
    const card = document.getElementById('workspace-card');
    modal.classList.add('opacity-0');
    card.classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}

document.getElementById('file-input').addEventListener('change', function(e) { addFilesToWorkspace(Array.from(e.target.files)); });

function addFilesToWorkspace(files) {
    if (activeTool !== 'merge' && activeTool !== 'imageToPdf' && workspaceFiles.length >= 1) { alert("One PDF at a time for this tool."); return; }
    workspaceFiles = workspaceFiles.concat(files);
    renderFileList();
}

function renderFileList() {
    const list = document.getElementById('file-list');
    list.innerHTML = '';
    workspaceFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = "flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-xl cursor-move";
        item.draggable = true;
        item.addEventListener('dragstart', () => { draggedItemIndex = index; });
        item.addEventListener('drop', (e) => {
            const draggedFile = workspaceFiles.splice(draggedItemIndex, 1)[0];
            workspaceFiles.splice(index, 0, draggedFile);
            renderFileList();
        });
        item.innerHTML = `<div class="flex items-center gap-4"><i class="fas fa-grip-vertical text-slate-500"></i><p class="text-white truncate">${file.name}</p></div><button onclick="workspaceFiles.splice(${index}, 1); renderFileList();" class="text-slate-500 hover:text-red-400"><i class="fas fa-trash"></i></button>`;
        list.appendChild(item);
    });
}
