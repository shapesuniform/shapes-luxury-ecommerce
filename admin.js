// SHAPES Atelier - Standalone Admin Portal JS

// Default Initial Data (to read from if empty)
const DEFAULT_PRODUCTS = [
    {
        id: "p1",
        title: "The Royal Zardozi Corset",
        category: "Zardozi",
        price: 185000,
        inventory: 5,
        image: "zardozi_corset.png",
        description: "An opulent structured corset in deep crimson silk-velvet, hand-embroidered with dense gold zardozi motifs. Features internal structural steel-boning and a classical adjustable lace-up back.",
        craft: "Handcrafted velvet, metallic gold zardozi wire, steel boning. Dry clean only."
    },
    {
        id: "p2",
        title: "Banarasi Brocream Corset",
        category: "Brocade",
        price: 85000,
        inventory: 8,
        image: "brocade_corset.png",
        description: "A striking sweetheart neckline corset crafted from hand-woven ivory and gold Banarasi brocade silk. Offers clean structure and elegant posture contouring.",
        craft: "100% Banarasi silk brocade, satin lining, flex-boning. Dry clean only."
    },
    {
        id: "p3",
        title: "The Emerald Draped Set",
        category: "Draped Sets",
        price: 245000,
        inventory: 4,
        image: "draped_corset_set.png",
        description: "An elegant emerald corset structured in velvet, paired with a flowing, pre-draped georgette skirt. Accented with badla borders along the cowl drape.",
        craft: "Velvet corset and georgette drape set. Dry clean only."
    },
    {
        id: "p4",
        title: "Charcoal Raw Silk Pret Corset",
        category: "Pret",
        price: 45000,
        inventory: 10,
        image: "pret_corset.png",
        description: "A minimalist structured corset in raw charcoal silk, featuring gold stitching lines hand-tacked along the vertical structural seams. A contemporary wardrobe essential.",
        craft: "100% raw mulberry silk, comfort-flex structuring. Dry clean only."
    },
    {
        id: "p_1786736236272",
        title: "haha",
        category: "Zardozi",
        price: 5000,
        inventory: 500,
        image: "wedding_couple.png",
        description: "na",
        craft: ""
    }
];

const DEFAULT_CATEGORIES = ["Zardozi", "Brocade", "Draped Sets", "Pret"];

const DEFAULT_CONFIG = {
    brandName: "Shapes By Satiinder Kaur",
    heroTitle: "THE STRUCTURE OF HERITAGE",
    storyTitle: "RE-IMAGINING THE CORSET",
    storyDesc: "Every creation at Shapes By Satiinder Kaur begins as a dialogue between structural precision and heritage handlooms. We fuse classical Western corsetry with opulent Indian fabrics. Our master craftsmen hand-embroider raw silks, Banarasi brocades, and heavy velvets with antique zardozi wires, molding structural silhouettes that contour the modern form. We celebrate heritage that refuses to remain in the past, transforming ancient handlooms into bold contemporary treasures."
};

// Local variables
let products = [];
let categories = [];
let config = {};

// Initialize Admin Portal
function initAdmin() {
    // 1. Sync from shared localStorage
    if (!localStorage.getItem("shapes_products")) {
        localStorage.setItem("shapes_products", JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem("shapes_categories")) {
        localStorage.setItem("shapes_categories", JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem("shapes_config")) {
        localStorage.setItem("shapes_config", JSON.stringify(DEFAULT_CONFIG));
    }

    products = JSON.parse(localStorage.getItem("shapes_products"));
    categories = JSON.parse(localStorage.getItem("shapes_categories"));
    config = JSON.parse(localStorage.getItem("shapes_config"));

    // 2. Check login state
    checkCMSLock();

    // 3. Setup CMS UI listeners
    setupCMSListeners();
}

// Passcode verify login checks
function checkCMSLock() {
    const loginBlock = document.getElementById("cms-login-block");
    const mainContent = document.getElementById("cms-main-content");
    const passInput = document.getElementById("cms-pass-input");
    const loginBtn = document.getElementById("cms-login-btn");
    const errorMsg = document.getElementById("cms-login-error");

    if (sessionStorage.getItem("shapes_cms_unlocked") === "true") {
        loginBlock.style.display = "none";
        mainContent.style.display = "grid";
        loadCMSPanels();
    } else {
        loginBlock.style.display = "flex";
        mainContent.style.display = "none";
        passInput.value = "";
        errorMsg.style.display = "none";

        const handleLogin = () => {
            const pass = passInput.value.trim();
            if (pass === "luxury2026") {
                sessionStorage.setItem("shapes_cms_unlocked", "true");
                loginBlock.style.display = "none";
                mainContent.style.display = "grid";
                loadCMSPanels();
            } else {
                errorMsg.style.display = "block";
            }
        };

        loginBtn.onclick = handleLogin;
        passInput.onkeypress = (e) => {
            if (e.key === "Enter") handleLogin();
        };
    }
}

// Lock admin session
function lockCMSSession() {
    sessionStorage.removeItem("shapes_cms_unlocked");
    checkCMSLock();
}

// Load configurations into panels
function loadCMSPanels() {
    renderCMSProducts();
    populateCMSCategories();
    populateCMSSettings();
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

// Render Products catalog table
function renderCMSProducts() {
    const tbody = document.getElementById("cms-products-tbody");
    tbody.innerHTML = "";

    products.forEach(p => {
        const tr = `
            <tr>
                <td><img src="${p.image}" class="table-thumb" alt=""></td>
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
window.addEventListener("DOMContentLoaded", initAdmin);

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
