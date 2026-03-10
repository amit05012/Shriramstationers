// ==========================================
// 1. YOUR BUSINESS CONFIGURATION
// ==========================================
const siteConfig = {
    // Contact Info
    phone: "9414711702",
    phoneLink: "tel:+919414711702", // Added for clickable call
    email: "shriramstationers05@gmail.com",
    emailLink: "mailto:shriramstationers05@gmail.com", // Added for clickable email
    
    // WhatsApp with Pre-filled Message!
    whatsappLink: "https://wa.me/919414711702?text=Hello%20Shriram%20Stationers!%20I%20have%20a%20printing%20requirement.",
    
    // Social & Messaging Links
    instagram: "https://www.instagram.com/shriramstationers",
    facebook: "https://www.facebook.com/Shriramstationers5/",
    telegram: "https://telegram.me/ShriramStationers",
    
    // Location & Hours
    address: "Opposite S.B.I. Bank, Agra Road, Dausa Rajasthan",
    mapsLink: "https://share.google/fATJWy2Udk4xxdVbc",
    workingHours: "Mon - Sun: 9:00 AM - 8:00 PM",
    
    // Pricing
    pdfPricing: "50 paise",
    doubleSidedPricing: "₹1"
};

// ==========================================
// 2. INJECT VARIABLES INTO THE WEBSITE
// ==========================================
function applyConfig() {
    // Inject Text
    document.querySelectorAll('[data-text]').forEach(el => {
        const key = el.getAttribute('data-text');
        if(siteConfig[key]) el.textContent = siteConfig[key];
    });

    // Inject Links
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
        
        // Match link to current URL
        if (currentPath === linkPath || currentPath === linkPath + '/' || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
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
    // Check if we are in a subfolder like /pdftools/
    const isSubfolder = window.location.pathname.includes('/pdftools/');
    const prefix = isSubfolder ? '../' : '';

    // Load Header and Footer
    loadComponent('header-placeholder', prefix + 'header.html');
    loadComponent('footer-placeholder', prefix + 'footer.html');
    
    // Apply variables to main page immediately
    applyConfig();
});
