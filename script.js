// ==========================================
// 1. YOUR BUSINESS CONFIGURATION
// ==========================================
const siteConfig = {
    phone: "9414711702",
    phoneLink: "tel:+919414711702",
    email: "shriramstationers05@gmail.com",
    emailLink: "mailto:shriramstationers05@gmail.com",
    facebook: "https://www.facebook.com/Shriramstationers5/",
    instagram: "https://www.instagram.com/shriramstationers",
    telegram: "https://telegram.me/ShriramStationers",
    whatsappLink: "https://wa.me/919414711702?text=Hello%20Shriram%20Stationers!",
    address: "Opposite S.B.I. Bank, Near BG Mart, Agra Road, Dausa Rajasthan",
    mapsLink: "https://share.google/fATJWy2Udk4xxdVbc",
    pdfPricing: "50 paise",
    doubleSidedPricing: "₹1"
};

// ==========================================
// 2. THE INJECTION ENGINE
// ==========================================
function applyConfig() {
    // Update Text
    document.querySelectorAll('[data-text]').forEach(el => {
        const key = el.getAttribute('data-text');
        if (siteConfig[key]) el.textContent = siteConfig[key];
    });

    // Update Links
    document.querySelectorAll('[data-link]').forEach(el => {
        const key = el.getAttribute('data-link');
        if (siteConfig[key]) el.href = siteConfig[key];
    });

    // Update Year
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => el.textContent = currentYear);
}

// ==========================================
// 3. ROBUST COMPONENT LOADER
// ==========================================
function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    // We add ?v= + time to the URL to force the browser to download the NEWEST version
    fetch(file + "?v=" + new Date().getTime())
        .then(response => {
            if (!response.ok) throw new Error("Could not find " + file);
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
            // Run injection AFTER the HTML is loaded
            applyConfig(); 
        })
        .catch(err => console.error(err));
}

// Start everything
document.addEventListener("DOMContentLoaded", () => {
    // Better way to check if we are inside a specific subfolder
    const pathParts = window.location.pathname.split('/');
    const isSubfolder = pathParts.includes('pdftools');
    const prefix = isSubfolder ? '../' : '';

    loadComponent('header-placeholder', prefix + 'header.html');
    loadComponent('footer-placeholder', prefix + 'footer.html');
    
    applyConfig(); // Apply to index.html elements
});
