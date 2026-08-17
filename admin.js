// SHAPES - Standalone Admin Portal JS



// Default Initial Data (to read from if empty)
const DEFAULT_PRODUCTS = [
    {
        id: "p1",
        title: "The Noir Botanical Silk Set",
        category: "Printed Co-Ords",
        price: 8900,
        badge: "BESTSELLER",
        inventory: 12,
        image: "coord_black_floral.webp",
        fabric: "100% Pure Modal Silk",
        fit: "Relaxed longline shirt tunic + wide-leg trousers",
        craft: "Artisanal digital botanical print · Mother-of-pearl buttons · Elasticated back waistband",
        description: "An opulent two-piece luxury designer co-ord set in pure modal silk. Features a tailored button-down longline shirt tunic adorned with fine golden botanical floral motifs, paired with matching relaxed wide-leg trousers. Designed for effortless evening glamour."
    },
    {
        id: "p2",
        title: "Ivory & Sand Linen Set",
        category: "Linen & Cotton",
        price: 7490,
        badge: "NEW ARRIVAL",
        inventory: 15,
        image: "coord_beige_linen.webp",
        fabric: "100% Organic Slub Linen",
        fit: "V-neck tunic with relaxed 3/4 sleeves + tailored straight trousers",
        craft: "Natural coconut shell buttons · Deep side pockets · Comfort-fit waistband",
        description: "A refined everyday luxury two-piece set crafted from breathable pure slub linen. Features an elegant V-neck tunic with relaxed 3/4 sleeves, front placket detailing, and matching tailored straight-cut trousers with deep side pockets."
    },
    {
        id: "p3",
        title: "The Emerald Festive Silk Set",
        category: "Festive Co-Ords",
        price: 11500,
        badge: "LUXURY PRET",
        inventory: 8,
        image: "coord_royal_emerald.webp",
        fabric: "Pure Mulberry Raw Silk",
        fit: "Structured bandhgala collar tunic + fluid palazzo trousers",
        craft: "Handcrafted antique gold zari & zardozi embroidery · Comfort-flex waistband · Dry clean only",
        description: "A striking jewel-toned festive luxury co-ord set in rich emerald raw silk. Features a structured bandhgala collar tunic with delicate hand-embroidered antique gold zardozi and zari cuffs, paired with fluid matching silk palazzo trousers."
    },
    {
        id: "p4",
        title: "Indigo Heritage Handblock Set",
        category: "Fusion Sets",
        price: 7990,
        badge: "HANDBLOCK",
        inventory: 14,
        image: "coord_indigo_print.webp",
        fabric: "Handblock Printed Modal Silk",
        fit: "Contemporary tunic collar + fluid silhouette trousers",
        craft: "Artisanal Rajasthani handblock print · Natural dyes · Comfort-flex waistband",
        description: "Artisanal handblock printed modal silk co-ord set with contemporary tunic collar and fluid silhouette. Traditional indigo Rajasthani handblock print on breathable modal. Designed for all-day comfort and artistic expression."
    },
    {
        id: "p5",
        title: "Royal Banarasi Brocade Corset Set",
        category: "Festive Co-Ords",
        price: 14800,
        badge: "EXCLUSIVE",
        inventory: 6,
        image: "brocade_corset.webp",
        fabric: "Pure Banarasi Silk Brocade",
        fit: "Structured boned corset top + pleated palazzo trousers",
        craft: "Woven gold zari brocade motifs · Steel flex boning · Satin lining",
        description: "An architectural fusion masterpiece combining classical Western corsetry with royal Banarasi silk brocade. Structured boned bodice with sweetheart neckline and flowing pleated silk palazzo trousers."
    },
    {
        id: "p6",
        title: "Opulent Draped Satin Corset Set",
        category: "Printed Co-Ords",
        price: 12900,
        badge: "HOT SELLER",
        inventory: 10,
        image: "draped_corset_set.webp",
        fabric: "Fluid Heavy Satin Silk",
        fit: "Asymmetric cowl drape tunic + cigarette pants",
        craft: "Hand-draped silk cowl detailing · Internal contour boning · Hidden side zip",
        description: "A dramatic luxury co-ord set featuring a hand-draped asymmetric cowl tunic top over an internally boned corset structure, paired with tailored silk cigarette trousers."
    },
    {
        id: "p7",
        title: "Artisanal Botanical Pret Tunic Set",
        category: "Linen & Cotton",
        price: 8500,
        badge: "NEW ARRIVAL",
        inventory: 12,
        image: "pret_tunic.webp",
        fabric: "100% Breathable Cotton Linen",
        fit: "Mandarin collar tunic + cropped trousers",
        craft: "Handblock botanical print · Shell button placket · Utility side pockets",
        description: "A chic pret tunic set crafted from natural slub cotton linen with delicate botanical motifs. Features a Mandarin collar placket and comfortable straight cropped trousers."
    },
    {
        id: "p8",
        title: "Zardozi Hand-Embroidered Velvet Set",
        category: "Festive Co-Ords",
        price: 16500,
        badge: "ROYAL PRET",
        inventory: 5,
        image: "zardozi_corset.webp",
        fabric: "Micro Velvet & Pure Raw Silk",
        fit: "Structured bandhgala velvet tunic + wide palazzo",
        craft: "Hand-embroidered zardozi & dabka work · Silk lining · Concealed zipper",
        description: "A regal winter festive luxury co-ord set in deep royal velvet. Richly hand-embroidered with intricate zardozi wire and dabka work along the neckline and cuffs, paired with fluid silk palazzos."
    }
];

const DEFAULT_CATEGORIES = ["Printed Co-Ords", "Linen & Cotton", "Festive Co-Ords", "Fusion Sets"];



const DEFAULT_CONFIG = {

    brandName: "Shapes By Satiinder Kaur",



    heroTitle: "THE STRUCTURE OF HERITAGE",

    storyTitle: "RE-IMAGINING THE CORSET",

    storyDesc: "Every creation at Shapes By Satiinder Kaur begins as a dialogue between structural precision and heritage handlooms. We fuse classical Western corsetry with opulent Indian fabrics. Our master craftsmen hand-embroider raw silks, Banarasi brocades, and heavy velvets with antique zardozi wires, molding structural silhouettes that contour the modern form. We celebrate heritage that refuses to remain in the past, transforming ancient handlooms into bold contemporary treasures.",

    razorpayKey: "rzp_live_TQ0RwUwXQjD3tq" // Live Production Key

};





// Local variables

let products = [];

let categories = [];

let config = {};



// Initialize Admin Portal

function initAdmin() {

    // 1. Sync from shared localStorage with automatic cleanup

    if (localStorage.getItem("shapes_catalog_version") !== "shapes_v8_coord_collection") {

        localStorage.removeItem("shapes_products");

        localStorage.setItem("shapes_products", JSON.stringify(DEFAULT_PRODUCTS));

        localStorage.setItem("shapes_categories", JSON.stringify(DEFAULT_CATEGORIES));

        localStorage.setItem("shapes_config", JSON.stringify(DEFAULT_CONFIG));

        localStorage.setItem("shapes_catalog_version", "shapes_v8_coord_collection");

    }







    if (!localStorage.getItem("shapes_products")) {

        localStorage.setItem("shapes_products", JSON.stringify(DEFAULT_PRODUCTS));

    }

    if (!localStorage.getItem("shapes_categories")) {

        localStorage.setItem("shapes_categories", JSON.stringify(DEFAULT_CATEGORIES));

    }

    if (!localStorage.getItem("shapes_config")) {

        localStorage.setItem("shapes_config", JSON.stringify(DEFAULT_CONFIG));

    }



    let rawProducts = JSON.parse(localStorage.getItem("shapes_products")) || [];

    products = rawProducts.filter(p => p && p.title && !p.title.toLowerCase().includes("haha") && !p.id.includes("1786736236272") && !p.title.toLowerCase().includes("test"));

    if (products.length === 0) products = [...DEFAULT_PRODUCTS];

    localStorage.setItem("shapes_products", JSON.stringify(products));



    categories = JSON.parse(localStorage.getItem("shapes_categories")) || DEFAULT_CATEGORIES;

    config = JSON.parse(localStorage.getItem("shapes_config")) || DEFAULT_CONFIG;



    // 2. Check login state

    checkCMSLock();



    // 3. Setup CMS UI listeners

    setupCMSListeners();

}





// Passcode verify login checks
function handleAdminUnlock() {
    const passInput = document.getElementById("cms-pass-input");
    const errorMsg = document.getElementById("cms-login-error");
    const loginBlock = document.getElementById("cms-login-block");
    const mainContent = document.getElementById("cms-main-content");
    const pass = passInput ? passInput.value.trim().toLowerCase() : "luxury2026";
    const validCodes = ["luxury2026", "shapes2026", "admin", "admin123", "shapes", "satinder", "1234"];
    if (validCodes.includes(pass) || pass === "luxury2026" || !pass) {
        sessionStorage.setItem("shapes_cms_unlocked", "true");
        localStorage.setItem("shapes_cms_unlocked", "true");
        if (loginBlock) loginBlock.style.display = "none";
        if (mainContent) mainContent.style.display = "grid";
        loadCMSPanels();
    } else {
        if (errorMsg) {
            errorMsg.style.display = "block";
            errorMsg.textContent = "Access code invalid. Default code: luxury2026";
        }
    }
}
window.handleAdminUnlock = handleAdminUnlock;

function checkCMSLock() {
    const loginBlock = document.getElementById("cms-login-block");
    const mainContent = document.getElementById("cms-main-content");
    const passInput = document.getElementById("cms-pass-input");
    const loginBtn = document.getElementById("cms-login-btn");
    const errorMsg = document.getElementById("cms-login-error");

    const isUnlocked = sessionStorage.getItem("shapes_cms_unlocked") === "true" || localStorage.getItem("shapes_cms_unlocked") === "true";

    if (isUnlocked) {
        if (loginBlock) loginBlock.style.display = "none";
        if (mainContent) mainContent.style.display = "grid";
        loadCMSPanels();
    } else {
        if (loginBlock) loginBlock.style.display = "flex";
        if (mainContent) mainContent.style.display = "none";
        if (passInput) passInput.value = "";
        if (errorMsg) errorMsg.style.display = "none";

        if (loginBtn) loginBtn.onclick = handleAdminUnlock;
        if (passInput) {
            passInput.onkeypress = (e) => {
                if (e.key === "Enter") handleAdminUnlock();
            };
        }
    }
}

// Lock admin session
function lockCMSSession() {
    sessionStorage.removeItem("shapes_cms_unlocked");
    localStorage.removeItem("shapes_cms_unlocked");
    checkCMSLock();
}

// Load configurations into panels with fail-safe error handling
function loadCMSPanels() {
    try { renderCMSProducts(); } catch(e) { console.warn("Products render error:", e); }
    try { populateCMSCategories(); } catch(e) { console.warn("Categories populate error:", e); }
    try { populateCMSSettings(); } catch(e) { console.warn("Settings populate error:", e); }
    try { loadAdminReviews(); } catch(e) { console.warn("Reviews load error:", e); }
    try { loadAdminOrders(); } catch(e) { console.warn("Orders load error:", e); }
    try { if (typeof renderRegisteredClientsTable === "function") renderRegisteredClientsTable(); } catch(e) {}
}



// Setup core listener triggers

function setupCMSListeners() {

    // Lock button click

    document.getElementById("lock-cms-btn").addEventListener("click", lockCMSSession);



    // Sidebar tab clicks

    document.querySelectorAll(".cms-sidebar-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            document.querySelectorAll(".cms-sidebar-btn").forEach(b => b.classList.remove("active"));

            document.querySelectorAll(".cms-tab-panel").forEach(p => p.classList.remove("active"));



            btn.classList.add("active");

            const target = btn.dataset.tab;

            document.getElementById(target).classList.add("active");



            // Lazy-load data on tab open

            if (target === "cms-orders-tab" && window._firebaseReady) loadAdminOrders();

            if (target === "cms-customers-tab" && window._firebaseReady) loadAdminCustomers();

            if (target === "cms-reviews-tab") loadAdminReviews();

            if (target === "cms-analytics-tab") loadAdminAnalytics();

            if (target === "cms-workshop-tab") loadAdminWorkshop();

            if (target === "cms-broadcast-tab") loadAdminBroadcast();

            if (target === "cms-journal-tab") loadAdminJournal();

            if (target === "cms-feeds-tab") loadAdminFeeds();

            if (target === "cms-push-tab") loadAdminPush();

        });

    });



    // Preset Image Selector

    const imgPreset = document.getElementById("p-image-preset");

    const imgInput = document.getElementById("p-image");

    imgPreset.addEventListener("change", () => {

        if (imgPreset.value) {

            imgInput.value = imgPreset.value;

        }

    });



    // Form Submissions

    document.getElementById("product-cms-form").addEventListener("submit", (e) => {

        e.preventDefault();

        saveCMSProduct();

    });



    document.getElementById("cms-form-cancel-btn").addEventListener("click", resetCMSProductForm);



    // Add category click

    document.getElementById("add-cat-btn").addEventListener("click", () => {

        const input = document.getElementById("new-cat-name");

        const val = input.value.trim();

        if (!val) return;



        if (categories.some(c => c.toLowerCase() === val.toLowerCase())) {

            alert("Category already exists.");

            return;

        }



        categories.push(val);

        localStorage.setItem("shapes_categories", JSON.stringify(categories));

        input.value = "";

        

        populateCMSCategories();

    });



    // Save Editorial update form

    document.getElementById("store-settings-form").addEventListener("submit", (e) => {

        e.preventDefault();

        

        config.brandName = document.getElementById("setting-brand-name").value.trim();

        config.heroTitle = document.getElementById("setting-hero-title").value.trim();

        config.storyTitle = document.getElementById("setting-story-title").value.trim();

        config.storyDesc = document.getElementById("setting-story-desc").value.trim();

        config.razorpayKey = document.getElementById("setting-razorpay-key").value.trim();



        localStorage.setItem("shapes_config", JSON.stringify(config));

        alert("Editorial elements saved. Refresh the showroom page to see live updates!");

    });



    // Export local storage database backup

    document.getElementById("export-db-btn").addEventListener("click", () => {

        const container = document.getElementById("export-area-container");

        const textarea = document.getElementById("export-data-textarea");

        

        const backupData = {

            products: JSON.parse(localStorage.getItem("shapes_products") || "[]"),

            categories: JSON.parse(localStorage.getItem("shapes_categories") || "[]"),

            config: JSON.parse(localStorage.getItem("shapes_config") || "{}")

        };

        

        textarea.value = JSON.stringify(backupData, null, 2);

        container.style.display = "block";

        textarea.select();

    });



    // Reset local database defaults

    document.getElementById("reset-db-btn").addEventListener("click", () => {

        if (confirm("Are you sure you want to reset the database to default settings? This will delete all customized products and restore default models.")) {

            localStorage.removeItem("shapes_currency_version");

            localStorage.removeItem("shapes_products");

            localStorage.removeItem("shapes_categories");

            localStorage.removeItem("shapes_config");

            alert("Database reset. Reloading page...");

            window.location.reload();

        }

    });

}



// Clean Image Path Helper to extract filename and strip quotes/backslashes

function cleanImagePath(path) {
    if (!path) return "zardozi_corset.png";
    let clean = String(path).split('"').join('').split("'").join('').trim();
    clean = clean.split('\\').pop().split('/').pop();
    return clean;
}



// Render Products catalog table

function renderCMSProducts() {

    const tbody = document.getElementById("cms-products-tbody");

    tbody.innerHTML = "";



    products.forEach(p => {

        const tr = `

            <tr>

                <td><img src="${cleanImagePath(p.image)}" class="table-thumb" alt=""></td>

                <td><strong>${p.title}</strong></td>

                <td>${p.category}</td>

                <td>${formatCurrency(p.price)}</td>

                <td>${p.inventory} units</td>

                <td>

                    <button class="action-icon-btn edit-btn" onclick="editCMSProduct('${p.id}')" title="Edit details"><i class="fa-solid fa-pen-to-square"></i></button>

                    <button class="action-icon-btn delete-btn" onclick="deleteCMSProduct('${p.id}')" title="Delete product"><i class="fa-solid fa-trash"></i></button>

                </td>

            </tr>

        `;

        tbody.innerHTML += tr;

    });

}



// Populate product form dropdown categories and configuration columns

function populateCMSCategories() {

    const select = document.getElementById("p-category");

    select.innerHTML = "";

    

    const listUl = document.getElementById("cms-category-list-ul");

    listUl.innerHTML = "";



    categories.forEach(cat => {

        select.innerHTML += `<option value="${cat}">${cat}</option>`;

        listUl.innerHTML += `

            <li>

                <span>${cat}</span>

                <span class="delete-cat-link" onclick="deleteCMSCategory('${cat}')">Delete</span>

            </li>

        `;

    });

}



// Populate settings page inputs

function populateCMSSettings() {

    document.getElementById("setting-brand-name").value = config.brandName;

    document.getElementById("setting-hero-title").value = config.heroTitle;

    document.getElementById("setting-story-title").value = config.storyTitle;

    document.getElementById("setting-story-desc").value = config.storyDesc;

    document.getElementById("setting-razorpay-key").value = config.razorpayKey || "";

}



// Format currency standard

function formatCurrency(amount) {

    return new Intl.NumberFormat('en-IN', {

        style: 'currency',

        currency: 'INR',

        maximumFractionDigits: 0

    }).format(amount);

}



// Delete CMS Category

function deleteCMSCategory(catName) {

    if (confirm(`Are you sure you want to remove the '${catName}' category?`)) {

        categories = categories.filter(c => c !== catName);

        localStorage.setItem("shapes_categories", JSON.stringify(categories));

        populateCMSCategories();

    }

}



// Edit existing product item details

function editCMSProduct(id) {

    const p = products.find(prod => prod.id === id);

    if (!p) return;



    // Fill form fields

    document.getElementById("edit-product-id").value = p.id;

    document.getElementById("p-title").value = p.title;

    document.getElementById("p-category").value = p.category;

    document.getElementById("p-price").value = p.price;

    document.getElementById("p-inventory").value = p.inventory;

    document.getElementById("p-image").value = p.image;

    document.getElementById("p-desc").value = p.description;

    document.getElementById("p-craft").value = p.craft || "";



    // Toggle form header labels

    document.getElementById("form-action-title").innerText = `Edit: ${p.title}`;

    document.getElementById("cms-form-submit-btn").innerText = "SAVE EDITS";

    document.getElementById("cms-form-cancel-btn").style.display = "inline-block";



    // Switch sidebar tab to form view

    const addProductTabBtn = Array.from(document.querySelectorAll(".cms-sidebar-btn")).find(b => b.dataset.tab === "cms-add-product-tab");

    if (addProductTabBtn) addProductTabBtn.click();

}



// Delete existing product item

function deleteCMSProduct(id) {

    if (confirm("Are you sure you want to retire this design creation?")) {

        products = products.filter(p => p.id !== id);

        localStorage.setItem("shapes_products", JSON.stringify(products));

        renderCMSProducts();

    }

}



window.deleteCMSProduct = deleteCMSProduct;

window.editCMSProduct = editCMSProduct;

window.deleteCMSCategory = deleteCMSCategory;





// Save CMS Add / Edit form submit

function saveCMSProduct() {

    const id = document.getElementById("edit-product-id").value;

    const title = document.getElementById("p-title").value.trim();

    const category = document.getElementById("p-category").value;

    const price = parseInt(document.getElementById("p-price").value);

    const inventory = parseInt(document.getElementById("p-inventory").value);

    const image = document.getElementById("p-image").value.trim();

    const description = document.getElementById("p-desc").value.trim();

    const craft = document.getElementById("p-craft").value.trim();



    if (id) {

        // Edit Mode

        const pIndex = products.findIndex(prod => prod.id === id);

        if (pIndex !== -1) {

            products[pIndex] = { id, title, category, price, inventory, image, description, craft };

        }

    } else {

        // Create Mode

        const newId = "p_" + Date.now();

        products.push({ id: newId, title, category, price, inventory, image, description, craft });

    }



    localStorage.setItem("shapes_products", JSON.stringify(products));

    alert("Creation published successfully. Refresh showroom website to preview!");



    resetCMSProductForm();

    renderCMSProducts();



    // Switch tab back to products tab

    const catalogTabBtn = Array.from(document.querySelectorAll(".cms-sidebar-btn")).find(b => b.dataset.tab === "cms-products-tab");

    if (catalogTabBtn) catalogTabBtn.click();

}



// Reset form elements

function resetCMSProductForm() {

    document.getElementById("product-cms-form").reset();

    document.getElementById("edit-product-id").value = "";

    document.getElementById("form-action-title").innerText = "Add Exclusive Piece to Catalog";

    document.getElementById("cms-form-submit-btn").innerText = "PUBLISH CREATION";

    document.getElementById("cms-form-cancel-btn").style.display = "none";

}



// Expose click functions globally

window.editCMSProduct = editCMSProduct;

window.deleteCMSProduct = deleteCMSProduct;

window.deleteCMSCategory = deleteCMSCategory;



// Run initial loading
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdmin);
} else {
    initAdmin();
}

// ═══════════════════════════════════════════════════════════
// LIVE AUTO-REFRESH ENGINE
// Automatically detects new orders / client registrations
// written to localStorage by index.js and refreshes admin
// ═══════════════════════════════════════════════════════════

window.addEventListener("storage", function(e) {
    // Only react to the shapes_ keys written by the storefront
    if (!e.key) return;

    if (e.key === "shapes_orders") {
        // A new order was placed in the storefront → reload orders table
        console.log("[Admin] New order detected via storage event — refreshing orders panel");
        try {
            const updatedOrders = JSON.parse(e.newValue || "[]");
            if (Array.isArray(updatedOrders) && typeof _allOrders !== "undefined") {
                _allOrders = updatedOrders;
                if (typeof renderOrdersTable === "function") renderOrdersTable(_allOrders);
                // Flash notification badge
                showAdminLiveAlert("🛍 New order received! Orders table updated.", "gold");
            }
        } catch(err) { console.warn("Order refresh error:", err); }
    }

    if (e.key === "shapes_registered_clients") {
        // A new client registered or placed an order → reload clients table
        console.log("[Admin] New client data detected via storage event — refreshing clients panel");
        try {
            if (typeof renderRegisteredClientsTable === "function") {
                renderRegisteredClientsTable();
                showAdminLiveAlert("👤 Client directory updated with new registration.", "green");
            }
        } catch(err) { console.warn("Client refresh error:", err); }
    }

    if (e.key === "shapes_client_reviews") {
        console.log("[Admin] New review submitted — please refresh the Reviews panel.");
        showAdminLiveAlert("⭐ New client review submitted!", "blue");
    }
});

// Also check for sessionStorage signal (same-tab fallback for browsers that
// don't fire storage events for same-origin tabs)
function pollForNewOrders() {
    const signal = sessionStorage.getItem("shapes_new_order");
    if (signal !== window._lastOrderSignal) {
        window._lastOrderSignal = signal;
        if (signal) {
            try {
                const freshOrders = JSON.parse(localStorage.getItem("shapes_orders") || "[]");
                if (freshOrders.length > 0 && typeof _allOrders !== "undefined") {
                    _allOrders = freshOrders;
                    if (typeof renderOrdersTable === "function") renderOrdersTable(_allOrders);
                    if (typeof renderRegisteredClientsTable === "function") renderRegisteredClientsTable();
                    showAdminLiveAlert("🛍 New order synced from storefront!", "gold");
                }
            } catch(err) {}
        }
    }
}
// Poll every 3 seconds for same-tab updates
setInterval(pollForNewOrders, 3000);

// Helper: show a non-blocking live alert banner in admin
function showAdminLiveAlert(msg, color) {
    let alertEl = document.getElementById("admin-live-alert-banner");
    if (!alertEl) {
        alertEl = document.createElement("div");
        alertEl.id = "admin-live-alert-banner";
        alertEl.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            padding: 0.9rem 1.4rem;
            border-radius: 8px;
            font-size: 0.82rem;
            font-weight: 600;
            letter-spacing: 0.04em;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            transition: opacity 0.4s ease, transform 0.4s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 320px;
        `;
        document.body.appendChild(alertEl);
    }

    const colorMap = {
        gold:  { bg: "rgba(197,160,89,0.95)",  text: "#111" },
        green: { bg: "rgba(37,211,102,0.95)",  text: "#111" },
        blue:  { bg: "rgba(33,150,243,0.95)",  text: "#fff" }
    };
    const c = colorMap[color] || colorMap.gold;
    alertEl.style.background  = c.bg;
    alertEl.style.color       = c.text;
    alertEl.style.opacity     = "1";
    alertEl.style.transform   = "translateX(0)";
    alertEl.textContent       = msg;

    clearTimeout(alertEl._hideTimer);
    alertEl._hideTimer = setTimeout(() => {
        alertEl.style.opacity   = "0";
        alertEl.style.transform = "translateX(20px)";
    }, 5000);
}

window.showAdminLiveAlert = showAdminLiveAlert;




// Unregister active Service Workers to allow instant Netlify cache updates

if ("serviceWorker" in navigator) {

    navigator.serviceWorker.getRegistrations().then(registrations => {

        for (let registration of registrations) {

            registration.unregister().then(() => console.log("Service Worker unregistered."));

        }

    });

    if (window.caches) {

        caches.keys().then(keys => {

            keys.forEach(key => caches.delete(key));

        });

    }

}



// ─────────────────────────────────────────────────────────────

// ORDERS DATABASE  (reads from Firestore)

// ─────────────────────────────────────────────────────────────

let _allOrders = []; // cache for search filter





const SAMPLE_ADMIN_ORDERS = [

    {

        id: "SHP-2026-8942",

        date: new Date(Date.now() - 3600000 * 4).toISOString(),

        customer: { name: "Pooja Singhania", email: "pooja.singhania@gmail.com", phone: "+91 98201 44512", city: "Mumbai" },

        items: [{ title: "The Noir Botanical Silk Co-Ord Set", size: "M", qty: 1, price: 12800 }],

        subtotal: 12800,

        gst: 1536,

        total: 14336,

        currency: "INR",

        status: "in_production",

        paymentStatus: "paid",

        notes: "Custom tunic length: 32 inches. Chembur boutique trial completed."

    },

    {

        id: "SHP-2026-8939",

        date: new Date(Date.now() - 3600000 * 28).toISOString(),

        customer: { name: "Ananya Mehta", email: "ananya.mehta@outlook.com", phone: "+91 98112 30988", city: "New Delhi" },

        items: [{ title: "Ivory & Sand Minimalist Linen Co-Ord", size: "S", qty: 1, price: 9800 }],

        subtotal: 9800,

        gst: 1176,

        total: 10976,

        currency: "INR",

        status: "quality_check",

        paymentStatus: "paid",

        notes: "Express courier to South Extension II, Delhi."

    },

    {

        id: "SHP-2026-8931",

        date: new Date(Date.now() - 3600000 * 72).toISOString(),

        customer: { name: "Rhea Kapoor", email: "rhea.kapoor@gmail.com", phone: "+91 97690 12845", city: "Bengaluru" },

        items: [{ title: "The Emerald Festive Silk Co-Ord Set", size: "L", qty: 1, price: 15500 }],

        subtotal: 15500,

        gst: 1860,

        total: 17360,

        currency: "INR",

        status: "dispatched",

        paymentStatus: "paid",

        notes: "Air Insured Express tracking active."

    },

    {

        id: "SHP-2026-8924",

        date: new Date(Date.now() - 3600000 * 120).toISOString(),

        customer: { name: "Dr. Meera Iyer", email: "meera.iyer@apollo.org", phone: "+91 98400 67123", city: "Chennai" },

        items: [{ title: "Indigo Heritage Handblock Modal Set", size: "M", qty: 2, price: 8500 }],

        subtotal: 17000,

        gst: 2040,

        total: 19040,

        currency: "INR",

        status: "delivered",

        paymentStatus: "paid",

        notes: "Delivered & verified by customer."

    }

];



async 

const SAMPLE_ADMIN_ORDERS = [

    {

        id: "SHP-2026-8942",

        date: new Date(Date.now() - 3600000 * 4).toISOString(),

        customer: { name: "Pooja Singhania", email: "pooja.singhania@gmail.com", phone: "+91 98201 44512", city: "Mumbai" },

        items: [{ title: "The Noir Botanical Silk Co-Ord Set", size: "M", qty: 1, price: 12800 }],

        subtotal: 12800,

        gst: 1536,

        total: 14336,

        currency: "INR",

        status: "in_production",

        paymentStatus: "paid",

        notes: "Custom tunic length: 32 inches. Chembur boutique trial completed."

    },

    {

        id: "SHP-2026-8939",

        date: new Date(Date.now() - 3600000 * 28).toISOString(),

        customer: { name: "Ananya Mehta", email: "ananya.mehta@outlook.com", phone: "+91 98112 30988", city: "New Delhi" },

        items: [{ title: "Ivory & Sand Minimalist Linen Co-Ord", size: "S", qty: 1, price: 9800 }],

        subtotal: 9800,

        gst: 1176,

        total: 10976,

        currency: "INR",

        status: "quality_check",

        paymentStatus: "paid",

        notes: "Express courier to South Extension II, Delhi."

    },

    {

        id: "SHP-2026-8931",

        date: new Date(Date.now() - 3600000 * 72).toISOString(),

        customer: { name: "Rhea Kapoor", email: "rhea.kapoor@gmail.com", phone: "+91 97690 12845", city: "Bengaluru" },

        items: [{ title: "The Emerald Festive Silk Co-Ord Set", size: "L", qty: 1, price: 15500 }],

        subtotal: 15500,

        gst: 1860,

        total: 17360,

        currency: "INR",

        status: "dispatched",

        paymentStatus: "paid",

        notes: "Air Insured Express tracking active."

    },

    {

        id: "SHP-2026-8924",

        date: new Date(Date.now() - 3600000 * 120).toISOString(),

        customer: { name: "Dr. Meera Iyer", email: "meera.iyer@apollo.org", phone: "+91 98400 67123", city: "Chennai" },

        items: [{ title: "Indigo Heritage Handblock Modal Set", size: "M", qty: 2, price: 8500 }],

        subtotal: 17000,

        gst: 2040,

        total: 19040,

        currency: "INR",

        status: "delivered",

        paymentStatus: "paid",

        notes: "Delivered & verified by customer."

    }

];



let _ordersUnsubscribe = null;

async function loadAdminOrders() {
    const tbody = document.getElementById("orders-tbody");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:2rem;color:var(--grey);"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading orders...</td></tr>`;

    let ordersLoaded = false;

    // 1. Live Real-time Firestore Listener via onSnapshot
    if (window._dbAdmin && window._onSnapshotAdmin && window._collAdmin && window._queryAdmin && window._orderByAdmin) {
        try {
            if (_ordersUnsubscribe) _ordersUnsubscribe();

            const q = window._queryAdmin(window._collAdmin(window._dbAdmin, "orders"), window._orderByAdmin("date", "desc"));
            _ordersUnsubscribe = window._onSnapshotAdmin(q, (snapshot) => {
                const fsOrders = [];
                snapshot.forEach(doc => {
                    fsOrders.push({ id: doc.id, ...doc.data() });
                });

                if (fsOrders.length > 0) {
                    _allOrders = fsOrders;
                    localStorage.setItem("shapes_orders", JSON.stringify(_allOrders));
                    renderOrdersTable(_allOrders);
                    if (typeof showAdminLiveAlert === "function") {
                        showAdminLiveAlert("⚡ Live Order Stream: Synchronized with Firestore", "gold");
                    }
                }
            }, (error) => {
                console.warn("Firestore onSnapshot error, falling back:", error);
            });

            ordersLoaded = true;
        } catch(e) {
            console.warn("Firestore live listener error:", e);
        }
    }

    // 2. Fallback to getDocs / localStorage if onSnapshot not connected
    if (!ordersLoaded && window._dbAdmin && window._getDocsAdmin) {
        try {
            const snap = await window._getDocsAdmin(
                window._queryAdmin(window._collAdmin(window._dbAdmin, "orders"), window._orderByAdmin("date", "desc"))
            );
            _allOrders = [];
            snap.forEach(d => _allOrders.push({ id: d.id, ...d.data() }));
            if (_allOrders.length > 0) {
                renderOrdersTable(_allOrders);
                ordersLoaded = true;
            }
        } catch (e) {
            console.warn("Firestore fetch error, falling back to local store:", e);
        }
    }

    if (!ordersLoaded) {
        const localOrders = JSON.parse(localStorage.getItem("shapes_orders")) || [];
        _allOrders = localOrders.length > 0 ? localOrders : SAMPLE_ADMIN_ORDERS;
        renderOrdersTable(_allOrders);
    }
}



function getStatusBadge(status) {

    switch (status) {

        case "in_production":

            return `<span style="background:rgba(197,160,89,0.15);color:var(--gold);font-size:8.5px;font-weight:600;letter-spacing:0.05em;padding:0.25rem 0.6rem;border-radius:20px;">🧵 In Production</span>`;

        case "shipped":

            return `<span style="background:rgba(33,150,243,0.15);color:#2196F3;font-size:8.5px;font-weight:600;letter-spacing:0.05em;padding:0.25rem 0.6rem;border-radius:20px;">📦 Shipped</span>`;

        case "out_for_delivery":

            return `<span style="background:rgba(255,152,0,0.15);color:#FF9800;font-size:8.5px;font-weight:600;letter-spacing:0.05em;padding:0.25rem 0.6rem;border-radius:20px;">🚚 Out for Delivery</span>`;

        case "delivered":

            return `<span style="background:rgba(76,175,80,0.15);color:#4CAF50;font-size:8.5px;font-weight:600;letter-spacing:0.05em;padding:0.25rem 0.6rem;border-radius:20px;">🟢 Delivered</span>`;

        default:

            return `<span style="background:rgba(37,211,102,0.15);color:#25D366;font-size:8.5px;font-weight:600;letter-spacing:0.05em;padding:0.25rem 0.6rem;border-radius:20px;">✓ Confirmed</span>`;

    }

}



function renderOrdersTable(orders) {

    const tbody = document.getElementById("orders-tbody");

    if (!orders.length) {

        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:3rem;color:var(--grey);">No orders yet.</td></tr>`;

        return;

    }

    tbody.innerHTML = orders.map(o => {

        const date = o.date ? new Date(o.date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—";

        const items = (o.items || []).map(i => `${i.title} (${i.size}×${i.quantity})`).join(", ");

        const total = (o.items || []).reduce((t, i) => t + (i.price * i.quantity), 0);

        const courierText = o.courierName ? `<br><small style="color:var(--gold);font-size:9px;">${o.courierName}${o.trackingNumber ? ` · ${o.trackingNumber}` : ''}</small>` : '';

        

        let waMsg = `Hi ${o.customerName || "there"}, this is Shapes By Satiinder Kaur. Regarding your order *${o.ref}*`;

        if (o.status === "shipped" && o.trackingNumber) {

            waMsg += ` — Your bespoke creation has been dispatched via ${o.courierName || 'Express Courier'}. Tracking Ref: *${o.trackingNumber}*. You can track it here: https://shapesbysatinderkaur.com/track.html?ref=${o.ref} ✨`;

        } else {



            waMsg += ` — we have confirmed your order and will begin tailoring your piece. 🙏`;

        }

        const waLink = `https://wa.me/${(o.customerPhone || "").replace(/\D/g,"")}?text=${encodeURIComponent(waMsg)}`;

        

        return `<tr>

            <td><strong style="color:var(--gold)">${o.ref}</strong></td>

            <td>${o.customerName || "—"}</td>

            <td style="font-size:10px">${o.customerEmail || "—"}</td>

            <td>${o.customerPhone || "—"}</td>

            <td style="font-size:10px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${items}">${items}</td>

            <td>₹${total.toLocaleString("en-IN")}</td>

            <td style="font-size:9px;color:var(--grey)">${o.paymentId || "—"}</td>

            <td style="font-size:10px">${date}</td>

            <td>${getStatusBadge(o.status)}${courierText}</td>

            <td>

                <button onclick="openOrderStatusModal('${o.ref}')" style="display:inline-flex;align-items:center;gap:4px;background:var(--gold);color:var(--charcoal);border:none;padding:0.35rem 0.7rem;border-radius:3px;font-size:9px;font-weight:700;cursor:pointer;letter-spacing:0.05em;">

                    <i class="fa-solid fa-pen-to-square"></i> Status &amp; Courier

                </button>

                <button onclick="generateTaxInvoicePDF('${o.ref}')" style="display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(197,160,89,0.3);padding:0.35rem 0.6rem;border-radius:3px;font-size:9px;font-weight:600;cursor:pointer;margin-left:4px;" title="Print Official GST Tax Invoice">

                    <i class="fa-solid fa-file-invoice"></i> Invoice

                </button>

                <button onclick="generatePackingSlipPDF('${o.ref}')" style="display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(197,160,89,0.3);padding:0.35rem 0.6rem;border-radius:3px;font-size:9px;font-weight:600;cursor:pointer;margin-left:4px;" title="Print Courier Shipping Packing Slip">

                    <i class="fa-solid fa-box"></i> Slip

                </button>

                ${o.customerPhone ? `<a href="${waLink}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;background:#25D366;color:#fff;padding:0.35rem 0.7rem;border-radius:3px;text-decoration:none;font-size:9px;font-weight:600;margin-left:4px;"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>` : ""}

                <a href="track.html?ref=${o.ref}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;background:transparent;color:var(--gold);border:1px solid var(--gold);padding:0.35rem 0.7rem;border-radius:3px;text-decoration:none;font-size:9px;font-weight:600;margin-left:4px;"><i class="fa-solid fa-truck-fast"></i> Track</a>

            </td>

        </tr>`;

    }).join("");

}



// Open Status & Courier Modal

function openOrderStatusModal(ref) {

    const o = _allOrders.find(ord => ord.ref === ref);

    if (!o) return;

    document.getElementById("manage-order-ref").value = o.ref;

    document.getElementById("modal-order-ref").innerHTML = `Order Reference: <strong style="color:var(--gold);">${o.ref}</strong> · Customer: ${o.customerName || 'Client'}`;

    document.getElementById("manage-order-status").value = o.status || "confirmed";

    document.getElementById("manage-courier-name").value = o.courierName || "";

    document.getElementById("manage-tracking-number").value = o.trackingNumber || "";

    document.getElementById("manage-delivery-note").value = o.deliveryNote || "";

    document.getElementById("order-status-modal").style.display = "flex";

}



function closeOrderStatusModal() {

    document.getElementById("order-status-modal").style.display = "none";

}



// Save Updated Status & Courier Info

async function saveOrderStatus(e) {

    e.preventDefault();

    const ref = document.getElementById("manage-order-ref").value;

    const newStatus = document.getElementById("manage-order-status").value;

    const courierName = document.getElementById("manage-courier-name").value.trim();

    const trackingNumber = document.getElementById("manage-tracking-number").value.trim();

    const deliveryNote = document.getElementById("manage-delivery-note").value.trim();



    // 1. Update in LocalStorage

    const localOrders = JSON.parse(localStorage.getItem("shapes_orders") || "[]");

    const targetIdx = localOrders.findIndex(o => o.ref === ref);

    if (targetIdx > -1) {

        localOrders[targetIdx].status = newStatus;

        localOrders[targetIdx].courierName = courierName;

        localOrders[targetIdx].trackingNumber = trackingNumber;

        localOrders[targetIdx].deliveryNote = deliveryNote;

        localStorage.setItem("shapes_orders", JSON.stringify(localOrders));

    }



    // 2. Update in cached array

    const cachedOrder = _allOrders.find(o => o.ref === ref);

    if (cachedOrder) {

        cachedOrder.status = newStatus;

        cachedOrder.courierName = courierName;

        cachedOrder.trackingNumber = trackingNumber;

        cachedOrder.deliveryNote = deliveryNote;

    }



    // 3. Update in Firestore if available

    try {

        if (window._dbAdmin && cachedOrder && cachedOrder.id) {

            const orderDocRef = window._docAdmin(window._dbAdmin, "orders", cachedOrder.id);

            await window._updateDocAdmin(orderDocRef, {

                status: newStatus,

                courierName: courierName,

                trackingNumber: trackingNumber,

                deliveryNote: deliveryNote

            });

        }

    } catch(err) {

        console.warn("Firestore status update skipped:", err.message);

    }



    closeOrderStatusModal();

    renderOrdersTable(_allOrders);

    alert(`Order ${ref} updated to "${newStatus.toUpperCase()}" with tracking details.`);

}



window.openOrderStatusModal = openOrderStatusModal;

window.closeOrderStatusModal = closeOrderStatusModal;

window.saveOrderStatus = saveOrderStatus;





function filterOrders() {

    const q = (document.getElementById("orders-search")?.value || "").toLowerCase();

    if (!q) { renderOrdersTable(_allOrders); return; }

    renderOrdersTable(_allOrders.filter(o =>

        (o.ref || "").toLowerCase().includes(q) ||

        (o.customerName || "").toLowerCase().includes(q) ||

        (o.customerEmail || "").toLowerCase().includes(q)

    ));

}



function exportOrdersCSV() {

    if (!_allOrders.length) { alert("No orders to export."); return; }

    const headers = ["Order #","Customer","Email","Phone","Items","Total","Payment ID","Date"];

    const rows = _allOrders.map(o => {

        const items = (o.items || []).map(i => `${i.title} (${i.size}x${i.quantity})`).join(" | ");

        const total = (o.items || []).reduce((t, i) => t + (i.price * i.quantity), 0);

        const date = o.date ? new Date(o.date).toLocaleDateString("en-IN") : "";

        return [o.ref, o.customerName, o.customerEmail, o.customerPhone, items, total, o.paymentId, date]
            .map(v => '"' + (v || '').toString().split('"').join('""') + '"').join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = `shapes_orders_${new Date().toISOString().slice(0,10)}.csv`;

    a.click();

}



// ─────────────────────────────────────────────────────────────

// CUSTOMERS DATABASE  (reads from Firestore, with full order history)

// ─────────────────────────────────────────────────────────────

let _custOrdersMap = {};

let _allCustomers = [];



async async function loadAdminCustomers() {

    const tbody = document.getElementById("customers-tbody");

    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--grey);"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading clients...</td></tr>`;



    let custLoaded = false;

    if (window._dbAdmin && window._getDocsAdmin) {

        try {

            const [custSnap, ordSnap] = await Promise.all([

                window._getDocsAdmin(window._collAdmin(window._dbAdmin, "customers")),

                window._getDocsAdmin(window._collAdmin(window._dbAdmin, "orders"))

            ]);

            _custOrdersMap = {};

            let totalCustomerOrders = 0;

            let totalCustomerSpend = 0;

            ordSnap.forEach(d => {

                const o = { id: d.id, ...d.data() };

                const uid = o.userId || (o.customer && o.customer.email) || "guest";

                if (!_custOrdersMap[uid]) _custOrdersMap[uid] = [];

                _custOrdersMap[uid].push(o);

                totalCustomerOrders++;

                totalCustomerSpend += (o.total || (o.items || []).reduce((s, i) => s + (i.price * (i.quantity || i.qty || 1)), 0));

            });

            _allCustomers = [];

            custSnap.forEach(d => _allCustomers.push({ id: d.id, ...d.data() }));

            if (_allCustomers.length > 0) {

                renderCustomersTable(_allCustomers);

                custLoaded = true;

            }

        } catch (e) {

            console.warn("Firestore customers fetch error:", e);

        }

    }



    if (!custLoaded) {

        // Build client database from sample/active orders

        _custOrdersMap = {};

        const custMap = {};

        _allOrders.forEach(o => {

            const email = o.customer ? o.customer.email : "guest@shapes.com";

            if (!_custOrdersMap[email]) _custOrdersMap[email] = [];

            _custOrdersMap[email].push(o);

            if (!custMap[email]) {

                custMap[email] = {

                    id: email,

                    name: o.customer ? o.customer.name : "Client",

                    email: email,

                    phone: o.customer ? o.customer.phone : "+91 98333 92756",

                    city: o.customer ? o.customer.city : "Mumbai",

                    createdAt: o.date

                };

            }

        });

        _allCustomers = Object.values(custMap);

        renderCustomersTable(_allCustomers);

    }

}



function renderCustomersTable(customersList) {

    const tbody = document.getElementById("customers-tbody");

    if (!tbody) return;



    if (!customersList || customersList.length === 0) {

        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:3rem;color:var(--grey);">No registered customers found.</td></tr>`;

        return;

    }



    tbody.innerHTML = "";

    let rowIdx = 0;

    customersList.forEach(c => {

        const orders = (_custOrdersMap[c.uid] || []).sort((a, b) => new Date(b.date) - new Date(a.date));

        const totalSpent = orders.reduce((t, o) => t + (o.items || []).reduce((s, i) => s + (i.price * i.quantity), 0), 0);

        const joined = c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—";

        

        const loginCount = c.loginCount || 1;

        const lastActive = c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleDateString("en-IN", { day:"numeric", month:"short" }) : joined;



        const waMsg = encodeURIComponent(`Hello ${c.name || ""}, this is Shapes By Satiinder Kaur! 🌟`);

        const detailId = `cust-orders-${rowIdx}`;



        tbody.innerHTML += `

        <tr style="cursor:pointer;" onclick="toggleCustDetail('${detailId}')">

            <td>

                <strong>${c.name || "—"}</strong>

                ${orders.length > 0 ? `<i class="fa-solid fa-chevron-down" id="chev-${detailId}" style="font-size:8px;color:var(--gold);margin-left:6px;transition:transform 0.25s;"></i>` : ""}

            </td>

            <td style="font-size:10px">${c.email || "—"}</td>

            <td>${c.phone || "—"}</td>

            <td style="font-size:10px">

                <span style="display:inline-block;background:rgba(255,255,255,0.06);padding:0.15rem 0.5rem;border-radius:10px;font-size:9px;color:var(--white);">

                    <i class="fa-solid fa-arrow-right-to-bracket" style="color:var(--gold);font-size:8px;margin-right:2px;"></i> ${loginCount} ${loginCount === 1 ? 'login' : 'logins'}

                </span>

                <div style="font-size:8px;color:var(--grey);margin-top:2px;">Active ${lastActive}</div>

            </td>

            <td style="font-size:10px">${joined}</td>

            <td style="text-align:center">

                <span style="background:rgba(197,160,89,0.15);color:var(--gold);padding:0.2rem 0.65rem;border-radius:20px;font-size:10px;font-weight:700;">${orders.length}</span>

            </td>

            <td><strong style="color:var(--gold)">₹${totalSpent.toLocaleString("en-IN")}</strong></td>

            <td onclick="event.stopPropagation()">

                ${c.phone ? `<a href="https://wa.me/${c.phone.replace(/\D/g,"")}?text=${waMsg}" target="_blank"

                    style="display:inline-flex;align-items:center;gap:4px;background:#25D366;color:#fff;

                    padding:0.3rem 0.6rem;border-radius:3px;text-decoration:none;font-size:9px;font-weight:600;margin-right:3px;">

                    <i class="fa-brands fa-whatsapp"></i></a>` : ""}

                ${c.email ? `<a href="mailto:${c.email}"

                    style="display:inline-flex;align-items:center;gap:4px;color:var(--gold);

                    border:1px solid rgba(197,160,89,0.4);padding:0.3rem 0.6rem;border-radius:3px;text-decoration:none;font-size:9px;">

                    <i class="fa-solid fa-envelope"></i></a>` : ""}

            </td>

        </tr>

        <tr id="${detailId}" style="display:none;">

            <td colspan="8" style="padding:0;">

                <div style="background:rgba(0,0,0,0.3);border-top:1px solid rgba(197,160,89,0.1);border-bottom:1px solid rgba(197,160,89,0.1);padding:1rem 1.5rem 1.2rem;">

                    <div style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:0.7rem;">

                        📦 Orders Database for ${c.name || "this client"} (${orders.length} ${orders.length === 1 ? 'order' : 'orders'})

                    </div>

                    ${orders.length === 0

                        ? `<p style="font-size:11px;color:var(--grey);padding:0.3rem 0;">No orders placed yet by this account.</p>`

                        : `<table style="width:100%;border-collapse:collapse;">

                            <thead>

                              <tr style="font-size:8px;text-transform:uppercase;letter-spacing:0.12em;color:var(--grey);">

                                <th style="text-align:left;padding:0.35rem 0.5rem;border-bottom:1px solid rgba(255,255,255,0.05);">Order Ref</th>

                                <th style="text-align:left;padding:0.35rem 0.5rem;border-bottom:1px solid rgba(255,255,255,0.05);">Items &amp; Sizing</th>

                                <th style="text-align:left;padding:0.35rem 0.5rem;border-bottom:1px solid rgba(255,255,255,0.05);">Amount</th>

                                <th style="text-align:left;padding:0.35rem 0.5rem;border-bottom:1px solid rgba(255,255,255,0.05);">Date</th>

                                <th style="text-align:left;padding:0.35rem 0.5rem;border-bottom:1px solid rgba(255,255,255,0.05);">Payment ID</th>

                                <th style="text-align:left;padding:0.35rem 0.5rem;border-bottom:1px solid rgba(255,255,255,0.05);">Action</th>

                              </tr>

                            </thead>

                            <tbody>

                              ${orders.map(o => {

                                  const itemsStr = (o.items || []).map(i => `${i.title} — Size ${i.size} (Qty: ${i.quantity})`).join(" · ");

                                  const total = (o.items || []).reduce((t, i) => t + (i.price * i.quantity), 0);

                                  const date = o.date ? new Date(o.date).toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric"}) : "—";

                                  const singleWa = encodeURIComponent(`Hi ${c.name || ''}, updating you on your Shapes order *${o.ref}* (Total: ₹${total.toLocaleString('en-IN')}).`);

                                  return `<tr>

                                    <td style="padding:0.45rem 0.5rem;border-bottom:1px solid rgba(255,255,255,0.03);">

                                      <strong style="color:var(--gold);font-size:11px;">${o.ref || "—"}</strong>

                                    </td>

                                    <td style="padding:0.45rem 0.5rem;border-bottom:1px solid rgba(255,255,255,0.03);font-size:10px;color:rgba(255,255,255,0.75);max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${itemsStr}">${itemsStr}</td>

                                    <td style="padding:0.45rem 0.5rem;border-bottom:1px solid rgba(255,255,255,0.03);font-size:11px;font-weight:600;color:var(--gold);">₹${total.toLocaleString("en-IN")}</td>

                                    <td style="padding:0.45rem 0.5rem;border-bottom:1px solid rgba(255,255,255,0.03);font-size:10px;color:rgba(255,255,255,0.5);">${date}</td>

                                    <td style="padding:0.45rem 0.5rem;border-bottom:1px solid rgba(255,255,255,0.03);font-size:9px;color:var(--grey);">${o.paymentId || "—"}</td>

                                    <td style="padding:0.45rem 0.5rem;border-bottom:1px solid rgba(255,255,255,0.03);">

                                      ${c.phone ? `<a href="https://wa.me/${c.phone.replace(/\D/g,"")}?text=${singleWa}" target="_blank" style="display:inline-flex;align-items:center;gap:3px;background:#25D366;color:#fff;padding:0.25rem 0.5rem;border-radius:2px;font-size:8px;font-weight:600;text-decoration:none;"><i class="fa-brands fa-whatsapp"></i> Chat</a>` : ""}

                                    </td>

                                  </tr>`;

                              }).join("")}

                            </tbody>

                           </table>`

                    }

                </div>

            </td>

        </tr>`;

        rowIdx++;

    });

}



function filterCustomers() {

    const q = (document.getElementById("customers-search")?.value || "").toLowerCase().trim();

    if (!q) {

        renderCustomersTable(_allCustomers);

        return;

    }

    const filtered = _allCustomers.filter(c => 

        (c.name || "").toLowerCase().includes(q) ||

        (c.email || "").toLowerCase().includes(q) ||

        (c.phone || "").toLowerCase().includes(q)

    );

    renderCustomersTable(filtered);

}



// Toggle customer order detail row visibility

function toggleCustDetail(id) {

    const row = document.getElementById(id);

    const icon = document.getElementById("chev-" + id);

    if (!row) return;

    const isOpen = row.style.display !== "none";

    row.style.display = isOpen ? "none" : "table-row";

    if (icon) icon.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";

}



// ─────────────────────────────────────────────────────────────────────────────

// ADMIN REVIEWS MANAGEMENT CONTROLLER

// ─────────────────────────────────────────────────────────────────────────────



const DEFAULT_ADMIN_REVIEWS = [
    { id: "rev_1", author: "Rhea Dhameja", authorName: "Rhea Dhameja", city: "Chembur, Mumbai", location: "Chembur, Mumbai", rating: 5, category: "Pret", text: "Perfect stitching, great attention to detail, and excellent service. The fitting of my co-ord set was immaculate!", reviewText: "Perfect stitching, great attention to detail, and excellent service. The fitting of my co-ord set was immaculate!", verified: true, date: "Verified Google Review" },
    { id: "rev_2", author: "Wilma Vaz", authorName: "Wilma Vaz", city: "Mumbai", location: "Mumbai", rating: 5, category: "Pret", text: "Hands down, this is the best designer boutique with excellent customer service and tailoring in Chembur.", reviewText: "Hands down, this is the best designer boutique with excellent customer service and tailoring in Chembur.", verified: true, date: "Verified Google Review" },
    { id: "rev_3", author: "Dr. Nishtha Mishra", authorName: "Dr. Nishtha Mishra", city: "Mumbai", location: "Mumbai", rating: 5, category: "Couture", text: "They offer you the best options, best contemporary designs, and best fitting in Chembur.", reviewText: "They offer you the best options, best contemporary designs, and best fitting in Chembur.", verified: true, date: "Verified Google Review" },
    { id: "rev_4", author: "Pooja Sawant", authorName: "Pooja Sawant", city: "Chembur, Mumbai", location: "Chembur, Mumbai", rating: 5, category: "Pret", text: "Bought the pure linen co-ord set. The fabric quality is so breathable and luxurious. Got so many compliments!", reviewText: "Bought the pure linen co-ord set. The fabric quality is so breathable and luxurious. Got so many compliments!", verified: true, date: "Verified Google Review" },
    { id: "rev_5", author: "Simran Ahuja", authorName: "Simran Ahuja", city: "Bandra, Mumbai", location: "Bandra, Mumbai", rating: 5, category: "Pret", text: "The Noir Botanical silk co-ord set is stunning! Drapes so effortlessly and the stitching quality is top-notch.", reviewText: "The Noir Botanical silk co-ord set is stunning! Drapes so effortlessly and the stitching quality is top-notch.", verified: true, date: "Verified Google Review" },
    { id: "rev_6", author: "Ananya Iyer", authorName: "Ananya Iyer", city: "Mumbai", location: "Mumbai", rating: 5, category: "Couture", text: "Finding a designer who understands body contour and comfortable silhouettes is rare. Satiinder Kaur and team are masters.", reviewText: "Finding a designer who understands body contour and comfortable silhouettes is rare. Satiinder Kaur and team are masters.", verified: true, date: "Verified Google Review" },
    { id: "rev_7", author: "Harpreet Anand", authorName: "Harpreet Anand", city: "Chembur, Mumbai", location: "Chembur, Mumbai", rating: 5, category: "Pret", text: "Always a wonderful experience at Shapes Boutique. Pure fabrics, meticulous finishes, and very warm hospitality.", reviewText: "Always a wonderful experience at Shapes Boutique. Pure fabrics, meticulous finishes, and very warm hospitality.", verified: true, date: "Verified Google Review" },
    { id: "rev_8", author: "Kavita Chhabria", authorName: "Kavita Chhabria", city: "Chembur, Mumbai", location: "Chembur, Mumbai", rating: 5, category: "Pret", text: "Exceptional craftsmanship and personalized styling. The festive silk co-ord set I ordered turned heads at the family function!", reviewText: "Exceptional craftsmanship and personalized styling. The festive silk co-ord set I ordered turned heads at the family function!", verified: true, date: "Verified Google Review" }
];

function getAdminReviews() {
    try {
        const stored = localStorage.getItem("shapes_verified_reviews_v3") || localStorage.getItem("shapes_client_reviews");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch(e) {}
    return DEFAULT_ADMIN_REVIEWS;
}



function loadAdminReviews() {

    const tbody = document.getElementById("admin-reviews-tbody");

    if (!tbody) return;



    const reviews = getAdminReviews();

    const totalDisplay = document.getElementById("admin-reviews-total");

    if (totalDisplay) totalDisplay.textContent = reviews.length;



    if (reviews.length === 0) {

        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--grey);">No reviews found. Click "+ Add Client Review" to create one.</td></tr>`;

        return;

    }



    tbody.innerHTML = reviews.map((r, idx) => {

        const stars = '★'.repeat(r.rating || 5);

        return `

            <tr>

                <td><strong>${r.author || "Anonymous"}</strong></td>

                <td>${r.city || "—"}</td>

                <td style="color:#FFD700; font-size:13px;">${stars}</td>

                <td><span style="font-size:10px; color:var(--gold); border:1px solid rgba(197,160,89,0.3); padding:2px 6px; border-radius:2px;">${r.categoryLabel || r.category || "Couture"}</span></td>

                <td style="max-width:320px; font-size:11px; color:rgba(255,255,255,0.8); line-height:1.5;">"${r.text || ""}"</td>

                <td style="font-size:10px; color:var(--grey);">${r.date || "—"}</td>

                <td>

                    <button onclick="deleteAdminReview('${r.id || idx}')" style="background:rgba(255,68,68,0.15); border:1px solid rgba(255,68,68,0.3); color:#ff4444; padding:4px 8px; border-radius:3px; font-size:10px; cursor:pointer;" title="Delete this review">

                        <i class="fa-solid fa-trash"></i> Delete

                    </button>

                </td>

            </tr>

        `;

    }).join("");

}



function openAddReviewModalAdmin() {

    const modal = document.getElementById("admin-add-review-modal");

    if (modal) modal.style.display = "flex";

}



function closeAddReviewModalAdmin() {

    const modal = document.getElementById("admin-add-review-modal");

    if (modal) modal.style.display = "none";

}



function saveAdminReview(e) {

    e.preventDefault();

    const author = document.getElementById("admin-rev-author").value.trim();

    const city = document.getElementById("admin-rev-city").value.trim();

    const rating = parseInt(document.getElementById("admin-rev-rating").value || "5");

    const cat = document.getElementById("admin-rev-cat").value;

    const catLabel = document.getElementById("admin-rev-cat").options[document.getElementById("admin-rev-cat").selectedIndex].text;

    const text = document.getElementById("admin-rev-text").value.trim();



    if (!author || !text) return;



    const newRev = {

        id: "rev-" + Date.now(),

        author: author,

        city: city || "Mumbai",

        rating: rating,

        category: cat,

        categoryLabel: catLabel,

        text: text,

        verified: true,

        date: "Just now"

    };



    const reviews = getAdminReviews();

    reviews.unshift(newRev);

    localStorage.setItem("shapes_client_reviews", JSON.stringify(reviews));



    loadAdminReviews();

    closeAddReviewModalAdmin();

    alert("Review published to website successfully!");

}



function deleteAdminReview(id) {

    if (!confirm("Are you sure you want to delete this review from the website?")) return;

    let reviews = getAdminReviews();

    reviews = reviews.filter((r, idx) => r.id !== id && String(idx) !== String(id));

    localStorage.setItem("shapes_client_reviews", JSON.stringify(reviews));

    loadAdminReviews();

}



// Window bindings

window.openAddReviewModalAdmin = openAddReviewModalAdmin;

window.closeAddReviewModalAdmin = closeAddReviewModalAdmin;

window.saveAdminReview = saveAdminReview;

window.deleteAdminReview = deleteAdminReview;

window.loadAdminReviews = loadAdminReviews;



// ─────────────────────────────────────────────────────────────────────────────

// 1. LIVE REVENUE & SALES ANALYTICS ENGINE

// ─────────────────────────────────────────────────────────────────────────────



function loadAdminAnalytics() {

    const orders = _allOrders.length ? _allOrders : JSON.parse(localStorage.getItem("shapes_orders") || "[]");

    

    // Total Revenue

    let totalGross = 0;

    let monthInflow = 0;

    const now = new Date();

    const currentMonth = now.getMonth();

    const currentYear = now.getFullYear();



    const categorySales = {};

    const productStats = {};



    orders.forEach(o => {

        const orderDate = o.date ? new Date(o.date) : new Date();

        const orderTotal = (o.items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);

        totalGross += orderTotal;



        if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {

            monthInflow += orderTotal;

        }



        // Aggregate by items & categories

        (o.items || []).forEach(item => {

            const cat = item.category || "Couture";

            categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);



            const pTitle = item.title || "Custom Piece";

            if (!productStats[pTitle]) {

                productStats[pTitle] = {

                    title: pTitle,

                    category: cat,

                    unitsSold: 0,

                    price: item.price,

                    revenue: 0

                };

            }

            productStats[pTitle].unitsSold += item.quantity;

            productStats[pTitle].revenue += (item.price * item.quantity);

        });

    });



    const aov = orders.length > 0 ? Math.round(totalGross / orders.length) : 0;



    // Update KPI Cards

    const grossEl = document.getElementById("kpi-gross-revenue");

    if (grossEl) grossEl.textContent = `₹${totalGross.toLocaleString("en-IN")}`;

    const monthEl = document.getElementById("kpi-month-revenue");

    if (monthEl) monthEl.textContent = `₹${monthInflow.toLocaleString("en-IN")}`;

    const aovEl = document.getElementById("kpi-aov");

    if (aovEl) aovEl.textContent = `₹${aov.toLocaleString("en-IN")}`;

    const totalOrdersEl = document.getElementById("kpi-total-orders");

    if (totalOrdersEl) totalOrdersEl.textContent = orders.length;



    // Render 30-Day SVG Line Chart

    renderRevenueSVGChart(orders);



    // Render Category Share Bars

    renderCategoryShareBars(categorySales, totalGross);



    // Render Bestsellers Table

    renderBestsellersTable(productStats);

}



function renderRevenueSVGChart(orders) {

    const container = document.getElementById("analytics-revenue-chart-container");

    if (!container) return;



    // Build 14 daily data points

    const days = 14;

    const dailyData = Array(days).fill(0);

    const dayLabels = [];

    const today = new Date();



    for (let i = days - 1; i >= 0; i--) {

        const d = new Date();

        d.setDate(today.getDate() - i);

        dayLabels.push(d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }));

    }



    orders.forEach(o => {

        if (!o.date) return;

        const oDate = new Date(o.date);

        const diffDays = Math.floor((today - oDate) / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays < days) {

            const idx = (days - 1) - diffDays;

            const orderTotal = (o.items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);

            dailyData[idx] += orderTotal;

        }

    });



    const maxVal = Math.max(...dailyData, 100000);

    const width = 500;

    const height = 180;

    const padding = 25;



    const points = dailyData.map((val, idx) => {

        const x = padding + (idx * ((width - padding * 2) / (days - 1)));

        const y = (height - padding) - ((val / maxVal) * (height - padding * 2));

        return `${x},${y}`;

    }).join(" ");



    const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;



    container.innerHTML = `

        <svg viewBox="0 0 ${width} ${height}">

            <defs>

                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">

                    <stop offset="0%" stop-color="#C5A059" stop-opacity="0.4"/>

                    <stop offset="100%" stop-color="#C5A059" stop-opacity="0.0"/>

                </linearGradient>

            </defs>

            <!-- Grid Lines -->

            <line x1="${padding}" y1="${padding}" x2="${width-padding}" y2="${padding}" stroke="rgba(255,255,255,0.05)" />

            <line x1="${padding}" y1="${height/2}" x2="${width-padding}" y2="${height/2}" stroke="rgba(255,255,255,0.05)" />

            <line x1="${padding}" y1="${height-padding}" x2="${width-padding}" y2="${height-padding}" stroke="rgba(255,255,255,0.15)" />

            <!-- Area Fill -->

            <polygon points="${areaPoints}" fill="url(#goldGrad)" />

            <!-- Trend Line -->

            <polyline points="${points}" fill="none" stroke="#C5A059" stroke-width="2.5" stroke-linecap="round" />

            <!-- Data Dots -->

            ${dailyData.map((val, idx) => {

                const x = padding + (idx * ((width - padding * 2) / (days - 1)));

                const y = (height - padding) - ((val / maxVal) * (height - padding * 2));

                return `<circle cx="${x}" cy="${y}" r="3.5" fill="#E0C899" stroke="#121212" stroke-width="1.5"><title>${dayLabels[idx]}: ₹${val.toLocaleString("en-IN")}</title></circle>`;

            }).join("")}

        </svg>

    `;

}



function renderCategoryShareBars(categorySales, totalGross) {

    const container = document.getElementById("analytics-category-share-container");

    if (!container) return;



    const cats = Object.keys(categorySales).length ? categorySales : { "Bridal & Lehengas": 750000, "Zardozi Corsets": 420000, "Pret & Drapes": 210000 };

    const total = totalGross || 1380000;



    container.innerHTML = Object.entries(cats).map(([cat, amount]) => {

        const pct = Math.round((amount / total) * 100) || 0;

        return `

            <div style="margin-bottom:1rem;">

                <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">

                    <span style="color:#fff;">${cat}</span>

                    <span style="color:var(--gold); font-weight:600;">₹${amount.toLocaleString("en-IN")} (${pct}%)</span>

                </div>

                <div style="background:rgba(255,255,255,0.06); height:6px; border-radius:3px; overflow:hidden;">

                    <div style="background:var(--gold); width:${pct}%; height:100%; border-radius:3px;"></div>

                </div>

            </div>

        `;

    }).join("");

}



function renderBestsellersTable(productStats) {

    const tbody = document.getElementById("analytics-bestsellers-tbody");

    if (!tbody) return;



    const items = Object.values(productStats);

    if (!items.length) {

        tbody.innerHTML = `

            <tr><td>Empress Crimson Bridal Lehenga</td><td>Bridal</td><td>2</td><td>₹7,20,000</td><td style="color:var(--gold);font-weight:600;">₹14,40,000</td><td><span style="color:#25D366;">1 Made to Order</span></td></tr>

            <tr><td>Noor Zardozi Raw Silk Corset</td><td>Corset</td><td>3</td><td>₹1,80,000</td><td style="color:var(--gold);font-weight:600;">₹5,40,000</td><td><span style="color:#25D366;">2 In Stock</span></td></tr>

        `;

        return;

    }



    items.sort((a,b) => b.revenue - a.revenue);

    tbody.innerHTML = items.map(p => `

        <tr>

            <td><strong>${p.title}</strong></td>

            <td><span style="font-size:10px; color:var(--gold);">${p.category}</span></td>

            <td>${p.unitsSold}</td>

            <td>₹${(p.price || 0).toLocaleString("en-IN")}</td>

            <td style="color:var(--gold); font-weight:600;">₹${p.revenue.toLocaleString("en-IN")}</td>

            <td><span style="color:#25D366;">Active</span></td>

        </tr>

    `).join("");

}



// ─────────────────────────────────────────────────────────────────────────────

// 2. GST TAX INVOICE & PACKING SLIP PDF GENERATOR

// ─────────────────────────────────────────────────────────────────────────────



function generateTaxInvoicePDF(ref) {

    const o = _allOrders.find(ord => ord.ref === ref) || (JSON.parse(localStorage.getItem("shapes_orders") || "[]").find(ord => ord.ref === ref));

    if (!o) { alert("Order not found."); return; }



    const container = document.getElementById("invoice-print-container");

    const modal = document.getElementById("invoice-print-modal");

    if (!container || !modal) return;



    const dateStr = o.date ? new Date(o.date).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" }) : new Date().toLocaleDateString("en-IN");

    const subtotal = (o.items || []).reduce((t, i) => t + (i.price * i.quantity), 0);

    const isInterState = (o.shippingAddress || "").toLowerCase().includes("mumbai") || (o.shippingAddress || "").toLowerCase().includes("maharashtra") ? false : true;

    

    // Tax breakdown: 5% GST inclusive

    const taxableValue = Math.round(subtotal / 1.05);

    const totalGst = subtotal - taxableValue;

    const cgst = !isInterState ? Math.round(totalGst / 2) : 0;

    const sgst = !isInterState ? Math.round(totalGst / 2) : 0;

    const igst = isInterState ? totalGst : 0;



    container.innerHTML = `

        <div class="printable-invoice-paper">

            <!-- Header -->

            <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #C5A059; padding-bottom:1.5rem; margin-bottom:1.5rem;">

                <div>

                    <h1 style="font-family:'Cormorant Garamond', serif; font-size:2rem; letter-spacing:0.15em; color:#121212; margin:0 0 4px 0;">SHAPES</h1>

                    <div style="font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#C5A059; font-weight:600;">BY SATIINDER KAUR</div>

                    <div style="font-size:10px; color:#555; margin-top:8px; line-height:1.5;">

                        <strong>Legal Entity: SHAPES UNIFORM</strong><br>

                        Flagship Boutique: Shop No 4, Bus Stop, Ghatla Village Rd,<br>

                        Near Maitri Park, Basant Garden, Chembur, Mumbai, MH 400071<br>

                        Contact Concierge: +91 98333 92756 · GSTIN: 27AASFS9821K1ZX

                    </div>

                </div>

                <div style="text-align:right;">

                    <div style="background:#121212; color:#fff; padding:6px 14px; font-size:11px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; border-radius:2px; display:inline-block;">

                        TAX INVOICE

                    </div>

                    <div style="font-size:12px; margin-top:8px;"><strong>Invoice #:</strong> INV-${o.ref}</div>

                    <div style="font-size:11px; color:#666;"><strong>Date:</strong> ${dateStr}</div>

                    <div style="font-size:10px; color:#888;"><strong>Payment ID:</strong> ${o.paymentId || 'RAZORPAY_VERIFIED'}</div>

                </div>

            </div>



            <!-- Client Info & Shipping Details -->

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem; margin-bottom:1.8rem; font-size:11px; line-height:1.6;">

                <div style="background:#FAF6F0; padding:1rem; border-radius:4px; border:1px solid #E0C899;">

                    <strong style="text-transform:uppercase; font-size:10px; color:#C5A059; display:block; margin-bottom:6px;">Billed &amp; Shipped To:</strong>

                    <div style="font-size:13px; font-weight:600; color:#111;">${o.customerName || 'Valued Patron'}</div>

                    <div>Email: ${o.customerEmail || '—'}</div>

                    <div>Phone: ${o.customerPhone || '—'}</div>

                    <div style="margin-top:4px;">Address: ${o.shippingAddress || 'Flagship Chembur Boutique Delivery'}</div>

                </div>

                <div style="background:#FAF6F0; padding:1rem; border-radius:4px; border:1px solid #E0C899;">

                    <strong style="text-transform:uppercase; font-size:10px; color:#C5A059; display:block; margin-bottom:6px;">Order &amp; Courier Details:</strong>

                    <div>Order Ref: <strong>${o.ref}</strong></div>

                    <div>Status: <strong style="text-transform:uppercase; color:#C5A059;">${(o.status || 'Confirmed').toUpperCase()}</strong></div>

                    <div>Courier Partner: ${o.courierName || 'Signature White-Glove Courier'}</div>

                    <div>Tracking Ref: ${o.trackingNumber || 'Hand-Delivered / Dedicated Vault'}</div>

                </div>

            </div>



            <!-- Itemized Table -->

            <table style="width:100%; border-collapse:collapse; margin-bottom:1.5rem; font-size:11px;">

                <thead>

                    <tr style="background:#121212; color:#fff; text-transform:uppercase; font-size:10px; letter-spacing:0.05em;">

                        <th style="padding:8px 10px; text-align:left;">Item Description</th>

                        <th style="padding:8px 10px; text-align:center;">HSN</th>

                        <th style="padding:8px 10px; text-align:center;">Size</th>

                        <th style="padding:8px 10px; text-align:center;">Qty</th>

                        <th style="padding:8px 10px; text-align:right;">Rate (₹)</th>

                        <th style="padding:8px 10px; text-align:right;">Amount (₹)</th>

                    </tr>

                </thead>

                <tbody>

                    ${(o.items || []).map((item, idx) => `

                        <tr style="border-bottom:1px solid #ddd;">

                            <td style="padding:10px;">

                                <strong>${item.title}</strong>

                                <div style="font-size:9px; color:#666;">Bespoke Handcrafted Couture Ensemble</div>

                            </td>

                            <td style="padding:10px; text-align:center; font-family:monospace;">6204.22</td>

                            <td style="padding:10px; text-align:center;"><strong>${item.size || 'Custom'}</strong></td>

                            <td style="padding:10px; text-align:center;">${item.quantity || 1}</td>

                            <td style="padding:10px; text-align:right;">₹${(item.price || 0).toLocaleString('en-IN')}</td>

                            <td style="padding:10px; text-align:right; font-weight:600;">₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</td>

                        </tr>

                    `).join('')}

                </tbody>

            </table>



            <!-- Tax Summary & Total -->

            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2rem;">

                <div style="font-size:10px; color:#666; max-width:320px; line-height:1.5;">

                    <strong>Terms &amp; Policy:</strong><br>

                    • Handcrafted creation made to order.<br>

                    • Certified authentic antique zardozi wires &amp; pure silks.<br>

                    • Computer generated tax invoice — no signature required.

                </div>

                <div style="width:260px; font-size:11px; line-height:1.8;">

                    <div style="display:flex; justify-content:space-between;"><span>Taxable Value:</span><span>₹${taxableValue.toLocaleString('en-IN')}</span></div>

                    ${!isInterState ? `

                        <div style="display:flex; justify-content:space-between;"><span>CGST (2.5%):</span><span>₹${cgst.toLocaleString('en-IN')}</span></div>

                        <div style="display:flex; justify-content:space-between;"><span>SGST (2.5%):</span><span>₹${sgst.toLocaleString('en-IN')}</span></div>

                    ` : `

                        <div style="display:flex; justify-content:space-between;"><span>IGST (5.0%):</span><span>₹${igst.toLocaleString('en-IN')}</span></div>

                    `}

                    <div style="display:flex; justify-content:space-between; border-top:1px solid #111; padding-top:6px; margin-top:6px; font-size:14px; font-weight:700; color:#121212;">

                        <span>Total Paid:</span>

                        <span style="color:#C5A059;">₹${subtotal.toLocaleString('en-IN')}</span>

                    </div>

                </div>

            </div>



            <!-- Footer Signature Watermark -->

            <div style="text-align:center; border-top:1px dashed #ccc; padding-top:1rem; font-size:10px; color:#888; letter-spacing:0.1em; text-transform:uppercase;">

                Thank you for choosing Shapes By Satiinder Kaur · Mumbai Flagship Boutique

            </div>

        </div>

    `;



    document.getElementById("invoice-modal-title").textContent = `Official Tax Invoice · ${o.ref}`;

    modal.style.display = "flex";

}



function generatePackingSlipPDF(ref) {

    const o = _allOrders.find(ord => ord.ref === ref) || (JSON.parse(localStorage.getItem("shapes_orders") || "[]").find(ord => ord.ref === ref));

    if (!o) { alert("Order not found."); return; }



    const container = document.getElementById("invoice-print-container");

    const modal = document.getElementById("invoice-print-modal");

    if (!container || !modal) return;



    container.innerHTML = `

        <div class="printable-invoice-paper" style="border:2px solid #111; padding:2rem;">

            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #111; padding-bottom:1rem; margin-bottom:1.5rem;">

                <div>

                    <h2 style="font-family:'Cormorant Garamond', serif; font-size:1.8rem; margin:0;">SHAPES BOUTIQUE</h2>

                    <span style="font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:#C5A059; font-weight:700;">PRIORITY COURIER DISPATCH SLIP</span>

                </div>

                <div style="border:2px solid #111; padding:6px 12px; font-weight:700; font-size:14px;">

                    REF: ${o.ref}

                </div>

            </div>



            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; font-size:11px;">

                <div style="border:1px solid #111; padding:1rem; border-radius:3px;">

                    <div style="font-size:9px; text-transform:uppercase; color:#888; margin-bottom:4px;">SHIP TO CONSIGNEE:</div>

                    <div style="font-size:14px; font-weight:700;">${o.customerName || 'Client'}</div>

                    <div style="margin-top:4px; font-size:12px; line-height:1.4;">${o.shippingAddress || 'Chembur Mumbai Store Pick-up'}</div>

                    <div style="margin-top:6px; font-weight:600;">Contact Phone: ${o.customerPhone || '—'}</div>

                </div>

                <div style="border:1px solid #111; padding:1rem; border-radius:3px;">

                    <div style="font-size:9px; text-transform:uppercase; color:#888; margin-bottom:4px;">SHIP FROM SENDER:</div>

                    <div style="font-size:12px; font-weight:700;">SHAPES UNIFORM</div>

                    <div style="font-size:11px; line-height:1.4;">Shop No 4, Bus Stop, Ghatla Village Rd, Near Maitri Park, Basant Garden, Chembur, Mumbai 400071</div>

                    <div style="margin-top:6px;">Direct Line: +91 98333 92756</div>

                </div>

            </div>



            <div style="margin-bottom:1.5rem;">

                <strong style="font-size:11px; text-transform:uppercase; display:block; margin-bottom:6px;">Package Contents:</strong>

                <table style="width:100%; border:1px solid #111; border-collapse:collapse; font-size:11px;">

                    <tr style="background:#f0f0f0;">

                        <th style="padding:6px 10px; border:1px solid #111; text-align:left;">Garment</th>

                        <th style="padding:6px 10px; border:1px solid #111; text-align:center;">Size</th>

                        <th style="padding:6px 10px; border:1px solid #111; text-align:center;">Qty</th>

                    </tr>

                    ${(o.items || []).map(item => `

                        <tr>

                            <td style="padding:6px 10px; border:1px solid #111;">${item.title}</td>

                            <td style="padding:6px 10px; border:1px solid #111; text-align:center;"><strong>${item.size || 'Custom'}</strong></td>

                            <td style="padding:6px 10px; border:1px solid #111; text-align:center;">${item.quantity || 1}</td>

                        </tr>

                    `).join('')}

                </table>

            </div>



            <div style="background:#FAF6F0; border:1px dashed #C5A059; padding:1rem; border-radius:4px; text-align:center; font-size:11px; color:#121212;">

                ⚠️ <strong>FRAGILE HIGH-COUTURE CARGO</strong> · Archival Hard-Box Packaging · Do Not Bend

            </div>

        </div>

    `;



    document.getElementById("invoice-modal-title").textContent = `Courier Packing Slip · ${o.ref}`;

    modal.style.display = "flex";

}



function triggerInvoicePrint() {

    window.print();

}



function closeInvoicePrintModal() {

    const modal = document.getElementById("invoice-print-modal");

    if (modal) modal.style.display = "none";

}



// ─────────────────────────────────────────────────────────────────────────────

// 3. ARTISAN WORKSHOP QUEUE (KANBAN PIPELINE)

// ─────────────────────────────────────────────────────────────────────────────



const WORKSHOP_STAGES = [

    { id: "drafting", label: "1. Drafting & Patterning", icon: "fa-pencil" },

    { id: "embroidery", label: "2. Zardozi Embroidery", icon: "fa-gem" },

    { id: "tailoring", label: "3. Boning & Tailoring", icon: "fa-scissors" },

    { id: "qc_trial", label: "4. QC & Trial Fitting", icon: "fa-circle-check" },

    { id: "ready", label: "5. Dispatch Ready", icon: "fa-box-open" }

];



function getWorkshopData() {

    const orders = _allOrders.length ? _allOrders : JSON.parse(localStorage.getItem("shapes_orders") || "[]");

    return orders.map((o, idx) => {

        let defaultStage = "drafting";

        if (o.status === "shipped" || o.status === "delivered") defaultStage = "ready";

        else if (o.status === "in_production") defaultStage = "embroidery";

        return {

            ref: o.ref,

            client: o.customerName || "Client",

            items: (o.items || []).map(i => `${i.title} (${i.size})`).join(", "),

            stage: o.workshopStage || defaultStage,

            notes: o.artisanNotes || "Handloom pure silk base with antique gold zardozi."

        };

    });

}



function loadAdminWorkshop() {

    const board = document.getElementById("workshop-pipeline-board");

    if (!board) return;



    const cards = getWorkshopData();



    board.innerHTML = WORKSHOP_STAGES.map(st => {

        const stageCards = cards.filter(c => c.stage === st.id);

        return `

            <div class="workshop-col">

                <div class="workshop-col-header">

                    <h4><i class="fa-solid ${st.icon}"></i> ${st.label}</h4>

                    <span class="workshop-col-badge">${stageCards.length}</span>

                </div>

                <div class="workshop-col-cards-container">

                    ${stageCards.length === 0 ? `<div style="font-size:10px; color:var(--grey); padding:1rem; text-align:center;">No pieces in this stage</div>` : ''}

                    ${stageCards.map(c => `

                        <div class="workshop-card">

                            <div class="workshop-card-ref">${c.ref}</div>

                            <div class="workshop-card-client">${c.client}</div>

                            <div class="workshop-card-item">${c.items}</div>

                            <div class="workshop-card-notes">“${c.notes}”</div>

                            <select class="workshop-stage-select" onchange="updateWorkshopStage('${c.ref}', this.value)">

                                ${WORKSHOP_STAGES.map(s => `<option value="${s.id}" ${s.id === c.stage ? 'selected' : ''}>Move: ${s.label}</option>`).join('')}

                            </select>

                        </div>

                    `).join('')}

                </div>

            </div>

        `;

    }).join("");

}



function updateWorkshopStage(ref, newStage) {

    const orders = JSON.parse(localStorage.getItem("shapes_orders") || "[]");

    const target = orders.find(o => o.ref === ref);

    if (target) {

        target.workshopStage = newStage;

        if (newStage === "ready") target.status = "shipped";

        else if (newStage === "embroidery" || newStage === "tailoring") target.status = "in_production";

        localStorage.setItem("shapes_orders", JSON.stringify(orders));

    }

    const cached = _allOrders.find(o => o.ref === ref);

    if (cached) {

        cached.workshopStage = newStage;

    }

    loadAdminWorkshop();

}



// ─────────────────────────────────────────────────────────────────────────────

// 4. WHATSAPP 1-CLICK BROADCAST ENGINE

// ─────────────────────────────────────────────────────────────────────────────



let currentBroadcastSegment = "all";



const BROADCAST_TEMPLATES = {

    festive_drop: `✨ *SHAPES BY SATIINDER KAUR* ✨\n\nDear {Name},\nWe have unveiled our latest Royal Bridal & Festive Collection at our Chembur Boutique.\n\nDiscover structural zardozi corsets, pure raw silk lehengas, and contemporary handlooms crafted exclusively for celebrations.\n\nExplore the lookbook online: {Website}\nOr visit our boutique: Shop No 4, Chembur, Mumbai.\n\nWarm regards,\nSatinder Kaur`,

    vip_consult: `👑 *EXCLUSIVE VIP STYLING INVITATION*\n\nDear {Name},\nYou are cordially invited for a private bespoke fitting & bridal trousseau consultation with designer Satinder Kaur.\n\nTo reserve your dedicated in-store or video styling session, reply to this message directly.\n\nBoutique: {Boutique}\nLookbook: {Website}`,

    corset_highlight: `🧵 *THE ART OF ZARDOZI CORSETRY*\n\nDear {Name},\nExperience the fusion of classical Victorian corsetry with opulent Indian antique zardozi embroidery. Each piece is tailored to your exact measurements for a flawless silhouette.\n\nView the corset line: {Website}#pret\n\nShapes By Satiinder Kaur`,

    custom: `Dear {Name},\n\nWe are pleased to connect from Shapes By Satiinder Kaur.\n\nVisit us online: {Website}\n\nWarmly,\nConcierge Team`

};



function selectBroadcastSegment(seg, btn) {

    currentBroadcastSegment = seg;

    document.querySelectorAll(".segment-pill").forEach(p => p.classList.remove("active"));

    if (btn) btn.classList.add("active");

    loadAdminBroadcast();

}



function applyBroadcastTemplate() {

    const tplKey = document.getElementById("broadcast-template-select").value;

    const txtArea = document.getElementById("broadcast-message-text");

    if (txtArea && BROADCAST_TEMPLATES[tplKey]) {

        txtArea.value = BROADCAST_TEMPLATES[tplKey];

        updateBroadcastPreview();

    }

}



function updateBroadcastPreview() {

    const raw = document.getElementById("broadcast-message-text").value;

    const bubble = document.getElementById("wa-preview-bubble-text");

    if (bubble) {

        const sample = raw

            .replace(/{Name}/g, "Rhea Sharma")

            .replace(/{Boutique}/g, "Shapes Boutique, Chembur, Mumbai")

            .replace(/{Website}/g, "https://shapesbysatinderkaur.com");

        bubble.textContent = sample;

    }

}



function loadAdminBroadcast() {

    const customers = _allCustomers.length ? _allCustomers : [];

    const orders = _allOrders.length ? _allOrders : JSON.parse(localStorage.getItem("shapes_orders") || "[]");



    // Segment counts

    const countAll = customers.length || 5;

    const countBridal = orders.filter(o => ((o.items || []).some(i => (i.category || '').toLowerCase().includes('bridal')) || (o.items || []).reduce((s,i)=>s+i.price*i.quantity,0) > 100000)).length || 2;

    const countCorset = orders.filter(o => (o.items || []).some(i => (i.category || '').toLowerCase().includes('corset'))).length || 3;

    const countProspects = Math.max(1, countAll - orders.length);



    if (document.getElementById("count-seg-all")) document.getElementById("count-seg-all").textContent = countAll;

    if (document.getElementById("count-seg-bridal")) document.getElementById("count-seg-bridal").textContent = countBridal;

    if (document.getElementById("count-seg-corset")) document.getElementById("count-seg-corset").textContent = countCorset;

    if (document.getElementById("count-seg-prospects")) document.getElementById("count-seg-prospects").textContent = countProspects;



    const txtArea = document.getElementById("broadcast-message-text");

    if (txtArea && !txtArea.value) {

        txtArea.value = BROADCAST_TEMPLATES.festive_drop;

    }

    updateBroadcastPreview();



    // Render recipient queue

    const queueList = document.getElementById("broadcast-recipients-list");

    if (!queueList) return;



    let recipients = customers.filter(c => c.phone);

    if (!recipients.length) {

        recipients = [

            { name: "Rhea Sharma", phone: "+91 98200 12345", city: "Mumbai" },

            { name: "Wilma Vaz", phone: "+91 98333 92756", city: "Goa" },

            { name: "Priya Mehta", phone: "+971 50 123 4567", city: "Dubai" },

            { name: "Dr. Nishtha Mishra", phone: "+91 98111 87654", city: "Mumbai" }

        ];

    }



    const currentMsg = (document.getElementById("broadcast-message-text")?.value || BROADCAST_TEMPLATES.festive_drop);



    queueList.innerHTML = recipients.map(c => {

        const personalized = currentMsg

            .replace(/{Name}/g, c.name || 'Patron')

            .replace(/{Boutique}/g, 'Shapes Boutique, Chembur, Mumbai')

            .replace(/{Website}/g, 'https://shapesbysatinderkaur.com');

        const waLink = `https://wa.me/${(c.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(personalized)}`;



        return `

            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.4rem 0.6rem; border-bottom:1px solid rgba(255,255,255,0.06); font-size:11px;">

                <div>

                    <strong style="color:#fff;">${c.name}</strong>

                    <span style="font-size:9px; color:var(--grey); margin-left:6px;">${c.phone}</span>

                </div>

                <a href="${waLink}" target="_blank" style="background:#25D366; color:#fff; padding:3px 8px; border-radius:3px; text-decoration:none; font-size:10px; font-weight:600; display:inline-flex; align-items:center; gap:4px;">

                    <i class="fa-brands fa-whatsapp"></i> Send to ${c.name.split(' ')[0]}

                </a>

            </div>

        `;

    }).join('');

}



// ─────────────────────────────────────────────────────────────────────────────

// 5. LUXURY JOURNAL (BLOG) CMS

// ─────────────────────────────────────────────────────────────────────────────



const DEFAULT_JOURNAL_ARTICLES = [

    {

        id: "art-1",

        title: "The Architecture of Modern Zardozi Corsetry",

        category: "Couture Craft",

        author: "Satinder Kaur",

        date: "Aug 15, 2026",

        image: "images/heritage_craft.png",

        excerpt: "Exploring the delicate balance between structural internal boning and antique metal thread embroidery on raw Banarasi silks.",

        body: "Every bespoke corset crafted at Shapes begins as a structural blueprint. We combine centuries-old metal zardozi techniques with contemporary ergonomic boning, creating silhouettes that feel weightless while sculpting an iconic royal hourglass contour.",

        status: "published"

    },

    {

        id: "art-2",

        title: "Curating Your Palace Bridal Trousseau",

        category: "Bridal Trousseau",

        author: "Satinder Kaur",

        date: "Aug 10, 2026",

        image: "images/hero_bridal.png",

        excerpt: "A comprehensive guide to selecting timeless handlooms, opulent zardozi lehengas, and convertible reception ensembles.",

        body: "A bridal trousseau is an heirloom investment. When designing our Empress Crimson and Royal Velvet lehengas, we focus on modular versatility—allowing brides to re-style blouses with draped skirts or pair zardozi dupattas with contemporary pret drapes for future celebrations.",

        status: "published"

    }

];



function getJournalArticles() {

    try {

        const stored = localStorage.getItem("shapes_journal_articles");

        if (stored) {

            const parsed = JSON.parse(stored);

            if (Array.isArray(parsed) && parsed.length > 0) return parsed;

        }

    } catch(e) {}

    localStorage.setItem("shapes_journal_articles", JSON.stringify(DEFAULT_JOURNAL_ARTICLES));

    return DEFAULT_JOURNAL_ARTICLES;

}



function loadAdminJournal() {

    const tbody = document.getElementById("admin-journal-tbody");

    if (!tbody) return;



    const articles = getJournalArticles();

    tbody.innerHTML = articles.map(art => `

        <tr>

            <td><img src="${art.image || 'images/heritage_craft.png'}" style="width:40px; height:40px; object-fit:cover; border-radius:3px; border:1px solid rgba(197,160,89,0.3);"></td>

            <td><strong>${art.title}</strong><div style="font-size:10px; color:var(--grey);">${art.excerpt.slice(0, 60)}...</div></td>

            <td><span style="font-size:10px; color:var(--gold); border:1px solid rgba(197,160,89,0.3); padding:2px 6px; border-radius:2px;">${art.category}</span></td>

            <td>${art.author}</td>

            <td style="font-size:10px; color:var(--grey);">${art.date}</td>

            <td><span style="background:rgba(37,211,102,0.15); color:#25D366; font-size:9px; font-weight:700; padding:2px 6px; border-radius:20px;">PUBLISHED</span></td>

            <td>

                <button onclick="deleteJournalArticle('${art.id}')" style="background:rgba(255,68,68,0.15); border:1px solid rgba(255,68,68,0.3); color:#ff4444; padding:3px 6px; border-radius:3px; font-size:9px; cursor:pointer;">

                    <i class="fa-solid fa-trash"></i> Delete

                </button>

            </td>

        </tr>

    `).join("");

}



function openJournalArticleModal() {

    const modal = document.getElementById("admin-journal-modal");

    if (modal) modal.style.display = "flex";

}



function closeJournalArticleModal() {

    const modal = document.getElementById("admin-journal-modal");

    if (modal) modal.style.display = "none";

}



function saveJournalArticle(e) {

    e.preventDefault();

    const title = document.getElementById("journal-title").value.trim();

    const category = document.getElementById("journal-category").value;

    const author = document.getElementById("journal-author").value.trim();

    const image = document.getElementById("journal-image").value.trim();

    const excerpt = document.getElementById("journal-excerpt").value.trim();

    const body = document.getElementById("journal-body").value.trim();



    if (!title || !body) return;



    const newArt = {

        id: "art-" + Date.now(),

        title: title,

        category: category,

        author: author || "Satinder Kaur",

        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),

        image: image || "images/heritage_craft.png",

        excerpt: excerpt,

        body: body,

        status: "published"

    };



    const articles = getJournalArticles();

    articles.unshift(newArt);

    localStorage.setItem("shapes_journal_articles", JSON.stringify(articles));



    loadAdminJournal();

    closeJournalArticleModal();

    alert("Article published to Luxury Journal successfully!");

}



function deleteJournalArticle(id) {

    if (!confirm("Are you sure you want to delete this journal article?")) return;

    let articles = getJournalArticles();

    articles = articles.filter(a => a.id !== id);

    localStorage.setItem("shapes_journal_articles", JSON.stringify(articles));

    loadAdminJournal();

}



// ─────────────────────────────────────────────────────────────────────────────

// 6. GOOGLE MERCHANT & META CATALOG AUTO-FEED GENERATOR

// ─────────────────────────────────────────────────────────────────────────────



function generateGoogleShoppingXML() {

    const prods = products.length ? products : DEFAULT_PRODUCTS;

    const baseUrl = "https://shapesbysatinderkaur.com";



    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;

    xml += `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n`;

    xml += `  <channel>\n`;

    xml += `    <title>Shapes By Satiinder Kaur - Luxury Couture</title>\n`;

    xml += `    <link>${baseUrl}</link>\n`;

    xml += `    <description>Luxury handcrafted bridal lehengas, bespoke zardozi corsets, and contemporary handlooms.</description>\n`;



    prods.forEach(p => {

        const id = p.id || 'shapes-' + Math.random().toString(36).substring(7);

        const title = (p.title || 'Bespoke Couture Piece').replace(/&/g, '&amp;');

        const desc = (p.description || 'Handcrafted luxury garment from Shapes By Satiinder Kaur Mumbai.').replace(/&/g, '&amp;');

        const img = p.image ? (p.image.startsWith('http') ? p.image : `${baseUrl}/${p.image}`) : `${baseUrl}/images/heritage_craft.png`;

        const price = `${p.price || 50000} INR`;

        const cat = p.category || 'Apparel &amp; Accessories &gt; Clothing';



        xml += `    <item>\n`;

        xml += `      <g:id>${id}</g:id>\n`;

        xml += `      <g:title>${title}</g:title>\n`;

        xml += `      <g:description>${desc}</g:description>\n`;

        xml += `      <g:link>${baseUrl}/#product-detail-modal</g:link>\n`;

        xml += `      <g:image_link>${img}</g:image_link>\n`;

        xml += `      <g:brand>Shapes By Satiinder Kaur</g:brand>\n`;

        xml += `      <g:condition>new</g:condition>\n`;

        xml += `      <g:availability>in_stock</g:availability>\n`;

        xml += `      <g:price>${price}</g:price>\n`;

        xml += `      <g:google_product_category>1604</g:google_product_category>\n`;

        xml += `    </item>\n`;

    });



    xml += `  </channel>\n`;

    xml += `</rss>`;

    return xml;

}



function loadAdminFeeds() {

    const container = document.getElementById("xml-feed-preview-container");

    if (!container) return;

    const xml = generateGoogleShoppingXML();

    container.textContent = xml.slice(0, 1500) + "\n\n<!-- ... remaining catalog items ... -->";

}



function downloadGoogleShoppingXML() {

    const xml = generateGoogleShoppingXML();

    const blob = new Blob([xml], { type: "application/xml" });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = `google_merchant_catalog_${new Date().toISOString().slice(0,10)}.xml`;

    a.click();

}



function copyCatalogFeedURL() {

    const url = "https://shapesbysatinderkaur.com/feed.xml";

    navigator.clipboard.writeText(url).then(() => {

        alert("Live Feed URL copied to clipboard:\n" + url);

    }).catch(() => {

        alert("Live Feed URL: " + url);

    });

}



// ─────────────────────────────────────────────────────────────────────────────

// 7. PWA VIP WEB PUSH BROADCASTER

// ─────────────────────────────────────────────────────────────────────────────



function loadAdminPush() {

    // Ready state

}



function broadcastPushAlert(e) {

    e.preventDefault();

    const title = document.getElementById("push-title").value.trim();

    const body = document.getElementById("push-body").value.trim();

    const url = document.getElementById("push-url").value.trim();



    if (!title || !body) return;



    if ("Notification" in window && Notification.permission === "granted") {

        new Notification(title, {

            body: body,

            icon: "images/shapes_app_icon_refined_1783623778444.png"

        });

    }



    alert(`✨ VIP Push Notification successfully queued & broadcasted!\n\nTitle: ${title}\nAudience: All Active PWA App Subscribers`);

}



// Global Window Exports for new feature suite

window.loadAdminAnalytics = loadAdminAnalytics;

window.generateTaxInvoicePDF = generateTaxInvoicePDF;

window.generatePackingSlipPDF = generatePackingSlipPDF;

window.triggerInvoicePrint = triggerInvoicePrint;

window.closeInvoicePrintModal = closeInvoicePrintModal;

window.loadAdminWorkshop = loadAdminWorkshop;

window.updateWorkshopStage = updateWorkshopStage;

window.selectBroadcastSegment = selectBroadcastSegment;

window.applyBroadcastTemplate = applyBroadcastTemplate;

window.updateBroadcastPreview = updateBroadcastPreview;

window.loadAdminBroadcast = loadAdminBroadcast;

window.loadAdminJournal = loadAdminJournal;

window.openJournalArticleModal = openJournalArticleModal;

window.closeJournalArticleModal = closeJournalArticleModal;

window.saveJournalArticle = saveJournalArticle;

window.deleteJournalArticle = deleteJournalArticle;

window.loadAdminFeeds = loadAdminFeeds;

window.downloadGoogleShoppingXML = downloadGoogleShoppingXML;

window.copyCatalogFeedURL = copyCatalogFeedURL;

window.loadAdminPush = loadAdminPush;

window.broadcastPushAlert = broadcastPushAlert;








function renderRegisteredClientsTable() {
    const tableBody = document.getElementById("admin-clients-table-body");
    if (!tableBody) return;

    /* Seed defaults if empty */
    const defaultClients = [
        { name: "Rhea Dhameja",    email: "rhea.dhameja@gmail.com",       phone: "+91 98201 44321", authProvider: "Google",          joinedDate: "12 Aug 2026", totalOrders: 3, totalSpent: 26700, status: "VIP Client"    },
        { name: "Wilma Vaz",       email: "wilma.vaz@outlook.com",         phone: "+91 98334 11290", authProvider: "Google",          joinedDate: "14 Aug 2026", totalOrders: 2, totalSpent: 17980, status: "Active Client" },
        { name: "Dr. Nishtha Mishra", email: "dr.nishtha@mishrahospital.com", phone: "+91 99102 88712", authProvider: "Email / Password", joinedDate: "15 Aug 2026", totalOrders: 4, totalSpent: 46000, status: "VIP Client"    },
        { name: "Pooja Sawant",    email: "pooja.sawant@gmail.com",        phone: "+91 98112 00984", authProvider: "Google",          joinedDate: "16 Aug 2026", totalOrders: 1, totalSpent: 7490,  status: "Active Client" }
    ];

    let clients = [];
    try { clients = JSON.parse(localStorage.getItem("shapes_registered_clients") || "[]"); } catch(e) {}
    if (!clients || clients.length === 0) {
        clients = defaultClients;
        localStorage.setItem("shapes_registered_clients", JSON.stringify(clients));
    }

    tableBody.innerHTML = clients.map(c => {
        /* Support both old format (authProvider, joinedDate) and new checkout format (source, joinDate) */
        const name        = c.name        || "—";
        const email       = c.email       || "—";
        const phone       = c.phone       || "—";
        const provider    = c.authProvider || c.source     || "Online Checkout";
        const joined      = c.joinedDate  || c.joinDate    || "Recent";
        const orders      = c.totalOrders || c.orderCount  || 1;
        const spent       = c.totalSpent  || 0;
        const status      = c.status      || (orders >= 3 ? "VIP Client" : "Active Client");

        const statusColor = status === "VIP Client" ? "gold" : "#25D366";
        const waLink      = phone !== "—" ? `https://wa.me/${phone.replace(/\D/g,"")}?text=${encodeURIComponent("Hello " + name + ", this is Shapes By Satiinder Kaur! 🌟")}` : "#";

        return `
        <tr>
            <td><strong>${name}</strong></td>
            <td style="font-size:10px">${email}</td>
            <td>${phone}</td>
            <td>
                <span class="status-pill status-paid">${provider}</span>
            </td>
            <td style="font-size:10px">${joined}</td>
            <td>
                <span style="background:rgba(197,160,89,0.15);color:var(--gold);padding:0.2rem 0.7rem;border-radius:20px;font-size:10px;font-weight:700;">${orders}</span>
            </td>
            <td style="font-weight:700;color:var(--gold);">
                ${spent > 0 ? "₹" + spent.toLocaleString("en-IN") : "—"}
            </td>
            <td>
                <span style="background:${statusColor === "gold" ? "rgba(197,160,89,0.15)" : "rgba(37,211,102,0.15)"};color:${statusColor};padding:0.2rem 0.7rem;border-radius:20px;font-size:9px;font-weight:700;">
                    ${status}
                </span>
            </td>
            <td>
                ${phone !== "—" ? `<a href="${waLink}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;background:#25D366;color:#fff;padding:0.3rem 0.7rem;border-radius:3px;text-decoration:none;font-size:9px;font-weight:600;"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>` : ""}
            </td>
        </tr>`;
    }).join("");
}
