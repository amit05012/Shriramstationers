// ==========================================
// 1. THE ONLY PLACE TO MAKE EDITS
// ==========================================
const siteConfig = {
    // Contact Details
    phone: "9414711702",
    phoneLink: "tel:+919414711702",
    email: "shriramstationers05@gmail.com",
    emailLink: "mailto:shriramstationers05@gmail.com",
    
    // Social Media Links
    facebook: "https://www.facebook.com/Shriramstationers5/",
    instagram: "https://www.instagram.com/shriramstationers",
    telegram: "https://telegram.me/ShriramStationers",
    whatsappLink: "https://wa.me/919414711702?text=Hello%20Shriram%20Stationers!",
    
    // Shop Details
    address: "Opposite S.B.I. Bank, Near BG Mart Agra Road, Dausa Rajasthan",
    mapsLink: "https://share.google/fATJWy2Udk4xxdVbc"
};

// ==========================================
// 2. THE INJECTION ENGINE
// ==========================================
function applyConfig() {
    // This function finds all "labels" and fills them with data from the config above
    
    // Update all text (data-text)
    document.querySelectorAll('[data-text]').forEach(el => {
        const key = el.getAttribute('data-text');
        if (siteConfig[key]) el.textContent = siteConfig[key];
    });

    // Update all links (data-link)
    document.querySelectorAll('[data-link]').forEach(el => {
        const key = el.getAttribute('data-link');
        if (siteConfig[key]) el.href = siteConfig[key];
    });

    // Update the Year automatically
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.current-year').forEach(el => el.textContent = currentYear);
}

// ==========================================
// 3. COMPONENT LOADER
// ==========================================
function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    fetch(file)
        .then(response => response.text())
        .then(data => {
            element.innerHTML = data;
            // IMPORTANT: We run the injection AFTER the HTML is loaded into the page
            applyConfig(); 
        })
        .catch(err => console.error("Error loading component:", err));
}

// Start everything when the page opens
document.addEventListener("DOMContentLoaded", () => {
    const isSubfolder = window.location.pathname.includes('/pdftools/');
    const prefix = isSubfolder ? '../' : '';

    loadComponent('header-placeholder', prefix + 'header.html');
    loadComponent('footer-placeholder', prefix + 'footer.html');
    
    // Also apply to any variables already on the main page (like hero section)
    applyConfig();
});
