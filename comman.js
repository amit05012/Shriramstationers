const SHOP_NUMBER = "919414711702"; //
let activeTool = '';
let workspaceFiles = [];
let draggedItemIndex = null;

const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

function openWorkspace(tool) {
    activeTool = tool;
    workspaceFiles = [];
    renderFileList();
    document.getElementById('workspace-modal').classList.remove('hidden');
    // Configure specific tool UI logic here...
    setupToolOptions(tool);
}

function closeWorkspace() {
    document.getElementById('workspace-modal').classList.add('hidden');
}

// Global Helpers
function showLoading(t) { /* Existing loading logic */ }
function hideLoading() { /* Existing hide logic */ }
