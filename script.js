// ==========================================
// 1. YOUR BUSINESS CONFIGURATION
// ==========================================
const siteConfig = {
    // Contact Info
    phone: "9414711702",
    phoneLink: "tel:+919414711702",
    email: "shriramstationers05@gmail.com",
    emailLink: "mailto:shriramstationers05@gmail.com",
    
    // WhatsApp (With auto-message)
    whatsappLink: "https://wa.me/919414711702?text=Hello%20Shriram%20Stationers!%20I%20have%20a%20printing%20requirement.",
    
    // Social & Messaging Links
    instagram: "https://www.instagram.com/shriramstationers",
    facebook: "https://www.facebook.com/Shriramstationers5/",
    telegram: "https://telegram.me/ShriramStationers",
    
    // Location
    address: "Opposite S.B.I. Bank, Near BG Mart Agra Road, Dausa Rajasthan",
    mapsLink: "https://share.google/fATJWy2Udk4xxdVbc",
    
    // Pricing
    pdfPricing: "50 paise",
    doubleSidedPricing: "₹1"
};

// ==========================================
// 2. INJECT VARIABLES & AUTO-YEAR
// ==========================================
function applyConfig() {
    // Inject Text (Updates any tag with data-text="key")
    document.querySelectorAll('[data-text]').forEach(el => {
        const key = el.getAttribute('data-text');
        if(siteConfig[key]) el.textContent = siteConfig[key];
    });

    // Inject Links (Updates any tag with data-link="key")
    document.querySelectorAll('[data-link]').forEach(el => {
        const key = el.getAttribute('data-link');
        if(siteConfig[key]) el.href = siteConfig[key];
    });

    // Auto-update Copyright Year
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => el.textContent = currentYear);
}

// ==========================================
// 3. HIGHLIGHT ACTIVE MENU LINK
// ==========================================
function highlightActiveNav() {
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('nav a').forEach(link => {
        const linkPath = link.getAttribute('href');
        // This checks if the link matches the current URL or folder
        if (currentPath === linkPath || currentPath === linkPath + '/' || (linkPath !== '/' && currentPath.includes(linkPath))) {
            link.classList.add('text-white', 'border-b-2', 'border-blue-500');
            link.classList.remove('text-slate-300');
        }
    });
}

// ==========================================
// 4. LOAD HEADER & FOOTER DYNAMICALLY
// ==========================================
function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Could not load ${file}`);
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
            // Apply config AND highlight nav after header/footer load
            applyConfig(); 
            if (id === 'header-placeholder') highlightActiveNav();
        })
        .catch(error => console.error(error));
}

// ==========================================
// 5. RUN EVERYTHING WHEN PAGE LOADS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const isSubfolder = window.location.pathname.includes('/pdftools/');
    const prefix = isSubfolder ? '../' : '';

    loadComponent('header-placeholder', prefix + 'header.html');
    loadComponent('footer-placeholder', prefix + 'footer.html');
    
    applyConfig(); // Apply to main page content
});
