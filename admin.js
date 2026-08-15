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
    }
];

const DEFAULT_CATEGORIES = ["Zardozi", "Brocade", "Draped Sets", "Pret"];

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
    if (localStorage.getItem("shapes_catalog_version") !== "satiinder_kaur_v4_live") {
        localStorage.removeItem("shapes_products");
        localStorage.setItem("shapes_products", JSON.stringify(DEFAULT_PRODUCTS));
        localStorage.setItem("shapes_categories", JSON.stringify(DEFAULT_CATEGORIES));
        localStorage.setItem("shapes_config", JSON.stringify(DEFAULT_CONFIG));
        localStorage.setItem("shapes_catalog_version", "satiinder_kaur_v4_live");
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
    // Load Firebase data for orders and customers
    setTimeout(() => {
        if (window._firebaseReady) {
            loadAdminOrders();
            loadAdminCustomers();
        }
    }, 800);
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

            // Lazy-load Firebase data on tab open
            if (target === "cms-orders-tab" && window._firebaseReady) loadAdminOrders();
            if (target === "cms-customers-tab" && window._firebaseReady) loadAdminCustomers();
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
    let clean = path.replace(/['"]/g, '').trim();
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

// ─────────────────────────────────────────────────────────────
// ORDERS DATABASE  (reads from Firestore)
// ─────────────────────────────────────────────────────────────
let _allOrders = []; // cache for search filter

async function loadAdminOrders() {
    const tbody = document.getElementById("orders-tbody");
    if (!tbody) return;
    if (!window._dbAdmin) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:2rem;color:#e57373;">Firebase not configured yet. Add your firebaseConfig to firebase-config.js first.</td></tr>`;
        return;
    }
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:2rem;color:var(--grey);"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading orders…</td></tr>`;
    try {
        const snap = await window._getDocsAdmin(
            window._queryAdmin(window._collAdmin(window._dbAdmin, "orders"), window._orderByAdmin("date", "desc"))
        );
        _allOrders = [];
        snap.forEach(d => _allOrders.push({ id: d.id, ...d.data() }));
        renderOrdersTable(_allOrders);
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:2rem;color:#e57373;">Error: ${e.message}</td></tr>`;
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
        const waMsg = encodeURIComponent(`Hi ${o.customerName || ""}, this is Shapes By Satiinder Kaur. Regarding your order *${o.ref}* — we'd like to confirm details. 🙏`);
        const waLink = `https://wa.me/${(o.customerPhone || "").replace(/\D/g,"")}?text=${waMsg}`;
        return `<tr>
            <td><strong style="color:var(--gold)">${o.ref}</strong></td>
            <td>${o.customerName || "—"}</td>
            <td style="font-size:10px">${o.customerEmail || "—"}</td>
            <td>${o.customerPhone || "—"}</td>
            <td style="font-size:10px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${items}">${items}</td>
            <td>₹${total.toLocaleString("en-IN")}</td>
            <td style="font-size:9px;color:var(--grey)">${o.paymentId || "—"}</td>
            <td style="font-size:10px">${date}</td>
            <td><span style="background:rgba(37,211,102,0.15);color:#25D366;font-size:8px;font-weight:600;letter-spacing:0.1em;padding:0.25rem 0.6rem;border-radius:20px;">✓ Confirmed</span></td>
            <td>
                ${o.customerPhone ? `<a href="${waLink}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;background:#25D366;color:#fff;padding:0.35rem 0.7rem;border-radius:3px;text-decoration:none;font-size:9px;font-weight:600;"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>` : ""}
                <a href="track.html?ref=${o.ref}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;background:transparent;color:var(--gold);border:1px solid var(--gold);padding:0.35rem 0.7rem;border-radius:3px;text-decoration:none;font-size:9px;font-weight:600;margin-left:4px;"><i class="fa-solid fa-truck-fast"></i> Track</a>
            </td>
        </tr>`;
    }).join("");
}

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
            .map(v => `"${(v||"").toString().replace(/"/g,'""')}"`).join(",");
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

async function loadAdminCustomers() {
    const tbody = document.getElementById("customers-tbody");
    if (!tbody || !window._dbAdmin) return;
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--grey);"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading customers…</td></tr>`;
    try {
        const [custSnap, ordSnap] = await Promise.all([
            window._getDocsAdmin(window._collAdmin(window._dbAdmin, "customers")),
            window._getDocsAdmin(window._collAdmin(window._dbAdmin, "orders"))
        ]);

        // Build uid -> [orders] map
        _custOrdersMap = {};
        let totalCustomerOrders = 0;
        let totalCustomerSpend = 0;

        ordSnap.forEach(d => {
            const o = { id: d.id, ...d.data() };
            const uid = o.uid || null;
            if (!uid) return;
            if (!_custOrdersMap[uid]) _custOrdersMap[uid] = [];
            _custOrdersMap[uid].push(o);
        });

        _allCustomers = [];
        custSnap.forEach(d => {
            _allCustomers.push({ id: d.id, ...d.data() });
        });

        // Compute metrics
        const totalCustomers = _allCustomers.length;
        let payingCustomers = 0;

        _allCustomers.forEach(c => {
            const orders = _custOrdersMap[c.uid] || [];
            if (orders.length > 0) payingCustomers++;
            orders.forEach(o => {
                totalCustomerOrders++;
                (o.items || []).forEach(i => {
                    totalCustomerSpend += (i.price * i.quantity) || 0;
                });
            });
        });

        // Update Stat Cards
        const elTotal = document.getElementById("stat-total-customers");
        const elPaying = document.getElementById("stat-paying-customers");
        const elOrders = document.getElementById("stat-total-cust-orders");
        const elSpend = document.getElementById("stat-total-cust-spend");

        if (elTotal) elTotal.textContent = totalCustomers;
        if (elPaying) elPaying.textContent = payingCustomers;
        if (elOrders) elOrders.textContent = totalCustomerOrders;
        if (elSpend) elSpend.textContent = "₹" + totalCustomerSpend.toLocaleString("en-IN");

        renderCustomersTable(_allCustomers);

    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#e57373;">Error: ${e.message}</td></tr>`;
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

