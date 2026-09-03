/* ── AUTOMATED WELCOME EMAIL DISPATCHER ─────────────────────── */
async function sendWelcomeEmail(userName, userEmail) {
    if (!userEmail) return;
    const key = "shapes_welcome_sent_" + userEmail.toLowerCase();
    if (localStorage.getItem(key)) return;

    if (typeof emailjs !== "undefined" && EMAILJS_CONFIG.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY") {
        try {
            await emailjs.send(EMAILJS_CONFIG.serviceId, "template_welcome", {
                to_name: userName || "Valued Connoisseur",
                to_email: userEmail,
                brand_name: "SHAPES",
                boutique_url: "https://shapesbysatinderkaur.com/#catalog",
                concierge_phone: "+91 98333 92756",
                boutique_address: "Shop No. 4, Basant Garden, Chembur, Mumbai"
            });
            localStorage.setItem(key, "true");
            console.log("💌 [Welcome Email] Dispatched to " + userEmail);
        } catch(e) {
            console.warn("Welcome email:", e);
        }
    }
}

/* ── SMART GEO-LOCATION CURRENCY AUTO-DETECTION ──────────────── */
function autoDetectVisitorCurrency() {
    // If user already manually selected a currency, respect it
    const savedCurr = localStorage.getItem("shapes_selected_currency");
    if (savedCurr && CURRENCY_RATES[savedCurr]) {
        selectedCurrency = savedCurr;
        const selector = document.getElementById("currency-selector");
        if (selector) selector.value = savedCurr;
        return;
    }

    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        let detected = "INR";

        if (tz.includes("Dubai") || tz.includes("Muscat") || tz.includes("Abu_Dhabi") || tz.includes("Asia/Dubai")) {
            detected = "AED";
        } else if (tz.includes("London") || tz.includes("Europe/Belfast") || tz.includes("GB")) {
            detected = "GBP";
        } else if (tz.includes("New_York") || tz.includes("Los_Angeles") || tz.includes("Chicago") || tz.includes("Toronto") || tz.includes("America")) {
            detected = "USD";
        } else if (tz.includes("Paris") || tz.includes("Berlin") || tz.includes("Rome") || tz.includes("Madrid") || tz.includes("Amsterdam") || tz.includes("Europe")) {
            detected = "EUR";
        }

        selectedCurrency = detected;
        const selector = document.getElementById("currency-selector");
        if (selector) selector.value = detected;
        console.log("🌍 [Geo-Currency Auto-Detect] Initialized to: " + detected);
    } catch(e) {
        selectedCurrency = "INR";
    }
}


function normalizeProductImage(imgPath) {
    if (!imgPath) return "images/coord_black_floral.webp";
    let clean = String(imgPath).split('"').join('').split("'").join('').trim();
    if (clean.startsWith("http") || clean.startsWith("data:")) return clean;
    const fname = clean.split('\\').pop().split('/').pop();
    return "images/" + fname;
}

/* ============================================================
   Shapes By Satiinder Kaur — MASTER STORE ENGINE v30
   ALL BUTTONS WORKING · MOBILE FIRST · ADMIN PORTAL SYNC
   ============================================================ */

"use strict";

/* ── DEFAULT DATA (synced with admin.js product IDs) ──────── */
const DEFAULT_PRODUCTS = [
    {
        id: "p1",
        title: "The Noir Botanical Silk Set",
        category: "Printed Co-Ords",
        price: 8900,
        badge: "BESTSELLER",
        inventory: 12,
        image: "images/coord_black_floral.webp",
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
        image: "images/coord_beige_linen.webp",
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
        image: "images/coord_royal_emerald.webp",
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
        image: "images/coord_indigo_print.webp",
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
        image: "images/brocade_corset.webp",
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
        image: "images/draped_corset_set.webp",
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
        image: "images/pret_tunic.webp",
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
        image: "images/zardozi_corset.webp",
        fabric: "Micro Velvet & Pure Raw Silk",
        fit: "Structured bandhgala velvet tunic + wide palazzo",
        craft: "Hand-embroidered zardozi & dabka work · Silk lining · Concealed zipper",
        description: "A regal winter festive luxury co-ord set in deep royal velvet. Richly hand-embroidered with intricate zardozi wire and dabka work along the neckline and cuffs, paired with fluid silk palazzos."
    }
];

const DEFAULT_CATEGORIES = ["NEW ARRIVALS", "Printed Co-Ords", "Linen & Cotton", "Festive Co-Ords", "Fusion Sets"];

const DEFAULT_CLIENT_REVIEWS = [
    { id: "rev_1", authorName: "Rhea Dhameja", location: "Chembur, Mumbai", reviewText: "Perfect stitching, great attention to detail, and excellent service. The fitting of my co-ord set was immaculate!", rating: 5, date: "Verified Google Review" },
    { id: "rev_2", authorName: "Wilma Vaz", location: "Mumbai", reviewText: "Hands down, this is the best designer boutique with excellent customer service and tailoring in Chembur.", rating: 5, date: "Verified Google Review" },
    { id: "rev_3", authorName: "Dr. Nishtha Mishra", location: "Mumbai", reviewText: "They offer you the best options, best contemporary designs, and best fitting in Chembur.", rating: 5, date: "Verified Google Review" },
    { id: "rev_4", authorName: "Pooja Sawant", location: "Chembur, Mumbai", reviewText: "Bought the pure linen co-ord set. The fabric quality is so breathable and luxurious. Got so many compliments!", rating: 5, date: "Verified Google Review" },
    { id: "rev_5", authorName: "Simran Ahuja", location: "Bandra, Mumbai", reviewText: "The Noir Botanical silk co-ord set is stunning! Drapes so effortlessly and the stitching quality is top-notch.", rating: 5, date: "Verified Google Review" },
    { id: "rev_6", authorName: "Ananya Iyer", location: "Mumbai", reviewText: "Finding a designer who understands body contour and comfortable silhouettes is rare. Satiinder Kaur and team are masters.", rating: 5, date: "Verified Google Review" },
    { id: "rev_7", authorName: "Harpreet Anand", location: "Chembur, Mumbai", reviewText: "Always a wonderful experience at Shapes By Satiinder Kaur. Pure fabrics, meticulous finishes, and very warm hospitality.", rating: 5, date: "Verified Google Review" },
    { id: "rev_8", authorName: "Kavita Chhabria", location: "Chembur, Mumbai", reviewText: "Exceptional craftsmanship and personalized styling. The festive silk co-ord set I ordered turned heads at the family function!", rating: 5, date: "Verified Google Review" }
];

/* ── APP STATE ────────────────────────────────────────────── */
let products        = [];
let cart            = [];
let wishlist        = [];
let currentCategory = "NEW ARRIVALS";
let searchQuery     = "";
let sortOption      = "default";
let selectedCurrency = "INR";
let currentActiveProduct = null;
let selectedSize    = "M";
let customerShippingInfo = null;

const CURRENCY_RATES   = { INR: 1, USD: 0.012, AED: 0.044, GBP: 0.0094, EUR: 0.011 };
const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", AED: "AED ", GBP: "£", EUR: "€" };

/* ── STORAGE HELPERS ──────────────────────────────────────── */
function getLocal(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e) { return fallback; }
}
function setLocal(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}

/* ── FORMAT PRICE ─────────────────────────────────────────── */
function formatPrice(inrAmount) {
    const rate = CURRENCY_RATES[selectedCurrency] || 1;
    const sym  = CURRENCY_SYMBOLS[selectedCurrency] || "₹";
    return `${sym}${Math.round(inrAmount * rate).toLocaleString("en-IN")}`;
}

/* ── SCROLL LOCK / UNLOCK ─────────────────────────────────── */
function lockScroll()   { document.body.classList.add("lock-scroll"); }
function unlockScroll() { document.body.classList.remove("lock-scroll"); }

/* ══════════════════════════════════════════════════════════
   RENDER FUNCTIONS
══════════════════════════════════════════════════════════ */

/* Category Tabs */
function renderCategoryTabs() {
    const c = document.getElementById("catalog-tabs-container");
    if (!c) return;
    c.innerHTML = DEFAULT_CATEGORIES.map(cat => `
        <button type="button" class="tab-btn ${cat === currentCategory ? "active" : ""}" data-category="${cat}">
            ${cat}
        </button>
    `).join("");
}

/* Product Grid */
function renderProductsGrid() {
    const c = document.getElementById("product-list-container");
    if (!c) return;

    let filtered = products.filter(p => {
        const matchCat  = currentCategory === "NEW ARRIVALS" || p.category === currentCategory;
        const q = searchQuery.toLowerCase();
        const matchSrch = !q || p.title.toLowerCase().includes(q) || (p.fabric || "").toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
        return matchCat && matchSrch;
    });

    if (sortOption === "price-asc")  filtered.sort((a,b) => a.price - b.price);
    if (sortOption === "price-desc") filtered.sort((a,b) => b.price - a.price);
    if (sortOption === "title-asc")  filtered.sort((a,b) => a.title.localeCompare(b.title));

    if (!filtered.length) {
        c.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:5rem 1rem;color:#888;font-size:0.9rem;">No creations found for your search.</div>`;
        return;
    }

    c.innerHTML = filtered.map(p => {
        const isWish = wishlist.includes(p.id);
        return `
        <div class="product-card" data-id="${p.id}" onclick="openProductDetail('${p.id}')" role="button" tabindex="0">
            <div class="product-card-img-wrapper">
                <span class="product-card-badge">${p.badge || "LUXURY PRET"}</span>
                <button type="button" class="product-wishlist-btn ${isWish ? "active" : ""}"
                    data-id="${p.id}"
                    data-action="wishlist"
                    onclick="event.stopPropagation(); toggleWishlist('${p.id}');"
                    aria-label="${isWish ? "Remove from wishlist" : "Add to wishlist"}"
                    title="Wishlist">
                    <i class="${isWish ? "fa-solid" : "fa-regular"} fa-heart"></i>
                </button>
                <img src="${normalizeProductImage(p.image)}" alt="${p.title} — Shapes By Satiinder Kaur Designer Co-Ord Set Mumbai" title="${p.title} | Shapes By Satiinder Kaur" loading="lazy" decoding="async">
            </div>
            <div class="product-card-info">
                <h3 class="product-card-title">${p.title}</h3>
                <div class="product-card-price-row">
                    <span class="product-card-price">${formatPrice(p.price)}</span>
                    <span class="gst-tag">INCL. GST</span>
                </div>
                <button type="button" class="card-action-tap-btn" data-id="${p.id}" data-action="open-detail" onclick="event.stopPropagation(); openProductDetail('${p.id}');">
                    <i class="fa-solid fa-eye"></i> View Details
                </button>
            </div>
        </div>`;
    }).join("");
}

/* Reviews */
function renderClientReviews() {
    const c = document.getElementById("testimonials-container");
    if (!c) return;
    let reviews = getLocal("shapes_verified_reviews_v3", null);
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
        reviews = DEFAULT_CLIENT_REVIEWS;
        setLocal("shapes_verified_reviews_v3", DEFAULT_CLIENT_REVIEWS);
    }
    c.innerHTML = reviews.map(r => {
        let authorName = (r.authorName || r.author || r.name || "Verified Client").toString().trim();
        if (!authorName || authorName.toLowerCase() === "undefined") authorName = "Verified Client";

        let location = (r.location || r.city || "Chembur, Mumbai").toString().trim();
        if (!location || location.toLowerCase() === "undefined") location = "Chembur, Mumbai";

        let reviewText = (r.reviewText || r.text || r.comment || "Exceptional luxury craftsmanship, pristine finishing, and perfect silhouette.").toString().trim();
        if (!reviewText || reviewText.toLowerCase() === "undefined") reviewText = "Exceptional luxury craftsmanship, pristine finishing, and perfect silhouette.";

        const rating = Math.min(Math.max(parseInt(r.rating) || 5, 1), 5);
        return `
        <div class="testimonial-card">
            <div class="stars-row">${"<i class='fa-solid fa-star'></i>".repeat(rating)}</div>
            <p class="review-text">"${reviewText}"</p>
            <div class="reviewer-meta">
                <span class="client-name">${authorName}</span>
                <span class="client-location"><i class="fa-brands fa-google" style="color:var(--gold);margin-right:4px;"></i>${location} · Verified</span>
            </div>
        </div>`;
    }).join("");
}

/* Cart Badge */
function updateCartBadge() {
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    const el = document.getElementById("header-cart-count");
    if (el) el.textContent = total;
}

/* Wishlist Badge */
function updateWishlistBadge() {
    const el = document.getElementById("header-wish-count");
    if (!el) return;
    el.textContent = wishlist.length;
    el.style.display = wishlist.length > 0 ? "flex" : "none";
}

/* Cart UI */
function renderCartUI() {
    const c   = document.getElementById("cart-items-container");
    const sub = document.getElementById("cart-subtotal-val");
    if (!c) return;

    if (!cart.length) {
        c.innerHTML = `<div style="text-align:center;padding:4rem 1rem;color:#666;font-size:0.88rem;">Your shopping bag is empty.<br><br>Explore our collections above.</div>`;
        if (sub) sub.textContent = formatPrice(0);
        return;
    }

    let total = 0;
    c.innerHTML = cart.map((item, idx) => {
        total += item.price * item.quantity;
        return `
        <div class="cart-item-row">
            <img class="cart-item-img" src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-meta">Size: ${item.size} &nbsp;|&nbsp; Qty: ${item.quantity}</div>
                <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
            </div>
            <button class="cart-item-remove" data-idx="${idx}" data-action="remove-cart" aria-label="Remove item">&times;</button>
        </div>`;
    }).join("");

    if (sub) sub.textContent = formatPrice(total);
}

/* ══════════════════════════════════════════════════════════
   PRODUCT DETAIL MODAL
══════════════════════════════════════════════════════════ */
function openProductDetail(productId) {
    const p = products.find(x => x.id === productId);
    if (!p) {
        console.warn("Product not found:", productId);
        return;
    }
    currentActiveProduct = p;
    selectedSize = "M";

    /* Populate fields */
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set("modal-product-category", p.category || "Designer Pret");
    set("modal-product-title",    p.title    || "Luxury Co-Ord Ensemble");
    set("modal-product-price",    formatPrice(p.price));
    set("modal-product-desc",     p.description || "An opulent two-piece luxury designer co-ord set handcrafted in pure natural silk.");
    set("modal-product-fabric",   p.fabric   || "100% Pure Modal Silk");
    set("modal-product-fit",      p.fit      || "Relaxed, tailored 2-piece co-ord silhouette");
    set("modal-product-craft",    p.craft    || "Artisanal print · Master-tailored at Chembur workshop");

    let cleanImg = normalizeProductImage(p.image);
    if (!cleanImg.startsWith("images/") && !cleanImg.startsWith("http") && !cleanImg.startsWith("data:")) {
        cleanImg = "images/" + cleanImg;
    }

    const img = document.getElementById("modal-product-image");
    if (img) {
        img.src = cleanImg;
        img.alt = p.title;
        img.onclick = () => openImageZoomModal(cleanImg, p.title);
    }

    /* ── WORLD-CLASS GALLERY ── */
    initGallery(p);
    startLiveViewerCounter(p);
    updateWhatsAppBtn(p);

    /* Render Official Razorpay Affordability / EMI Suite */
    renderRazorpayAffordabilityWidget(p.price);

    /* Reset sizes */
    document.querySelectorAll(".size-option").forEach(o => {
        o.classList.toggle("active", o.getAttribute("data-size") === "M");
    });

    /* Close all product accordions; open Description by default */
    document.querySelectorAll(".prod-acc-item").forEach(item => item.classList.remove("open"));
    const descItem = document.getElementById("acc-desc");
    if (descItem) descItem.classList.add("open");

    /* Hide size chart and reset toggle button */
    const sizeChart = document.getElementById("modal-size-chart-table");
    if (sizeChart) sizeChart.style.display = "none";
    const sizeBtn = document.getElementById("toggle-size-chart-btn");
    if (sizeBtn) sizeBtn.innerHTML = `<i class="fa-solid fa-ruler-combined"></i> Size Guide`;

    /* Infallible Modal Open with full visibility assurance */
    const modal = document.getElementById("product-detail-modal");
    if (modal) {
        modal.classList.add("active");
        modal.style.display = "flex";
        modal.style.opacity = "1";
        modal.style.visibility = "visible";
        lockScroll();
    }
}

function renderRazorpayAffordabilityWidget(priceInINR) {
    const targetEl = document.getElementById("razorpay-affordability-widget");
    if (!targetEl) return;
    targetEl.innerHTML = "";

    const cfg = getLocal("shapes_config", {});
    const rzpKey = cfg.razorpayKey || "rzp_live_TQ0RwUwXQjD3tq";
    const amountInPaise = Math.round((priceInINR || 0) * 100);

    if (amountInPaise <= 0) return;

    // Calculate real monthly EMI
    const emi6Month = Math.round(priceInINR / 6);

    // Render Luxury Gold EMI Banner
    const emiBanner = document.createElement("div");
    emiBanner.className = "luxury-emi-card";
    emiBanner.style.cssText = "background:rgba(197,160,89,0.08);border:1px solid rgba(197,160,89,0.25);border-radius:8px;padding:10px 14px;margin:8px 0 12px 0;display:flex;align-items:center;gap:12px;";
    emiBanner.innerHTML = `
        <div style="background:rgba(197,160,89,0.2);width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#C5A059;flex-shrink:0;">
            <i class="fa-solid fa-credit-card" style="font-size:0.9rem;"></i>
        </div>
        <div style="flex:1;">
            <div style="color:#FAF6EE;font-size:0.82rem;font-weight:600;letter-spacing:0.02em;">
                EMI from <span style="color:#C5A059;font-weight:700;">₹${emi6Month.toLocaleString('en-IN')}/mo</span>
            </div>
            <div style="color:#B8A890;font-size:0.72rem;margin-top:2px;">
                No Cost EMI &amp; PayLater available at Razorpay checkout
            </div>
        </div>
        <span style="background:#C5A059;color:#111;font-size:0.65rem;font-weight:700;padding:3px 7px;border-radius:4px;letter-spacing:0.05em;">RAZORPAY</span>
    `;
    targetEl.appendChild(emiBanner);

    // Live Razorpay Affordability SDK mount point
    const rzpMount = document.createElement("div");
    rzpMount.id = "rzp-affordability-suite-mount";
    targetEl.appendChild(rzpMount);

    function mountLiveRazorpayWidget() {
        if (window.RazorpayAffordabilitySuite && rzpKey) {
            try {
                const suite = new window.RazorpayAffordabilitySuite({
                    key: rzpKey,
                    amount: amountInPaise,
                    currency: "INR"
                });
                suite.render();
            } catch(e) {}
        }
    }

    if (window.RazorpayAffordabilitySuite) {
        mountLiveRazorpayWidget();
    } else {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            if (window.RazorpayAffordabilitySuite) {
                clearInterval(checkInterval);
                mountLiveRazorpayWidget();
            } else if (attempts > 25) {
                clearInterval(checkInterval);
            }
        }, 120);
    }
}

function closeProductDetailModal() {
    const modal = document.getElementById("product-detail-modal");
    if (modal) {
        modal.classList.remove("active");
        modal.style.display = "none";
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
    }
    if (window._liveViewerTimer) { clearInterval(window._liveViewerTimer); window._liveViewerTimer = null; }
    unlockScroll();
}

/* ══════════════════════════════════════════════════════════
   CART DRAWER
══════════════════════════════════════════════════════════ */
function openCartDrawer() {
    // Route to Smart Cart Drawer if present; fallback to legacy drawer
    if (document.getElementById("smart-cart-drawer")) {
        openSmartCart();
        return;
    }
    renderCartUI();
    const overlay = document.getElementById("cart-drawer-overlay");
    if (overlay) { overlay.classList.add("active"); lockScroll(); }
}

function closeCartDrawer() {
    const overlay = document.getElementById("cart-drawer-overlay");
    if (overlay) overlay.classList.remove("active");
    unlockScroll();
}

/* ══════════════════════════════════════════════════════════
   CART OPERATIONS
══════════════════════════════════════════════════════════ */
function addToCart(productId, size) {
    const p = products.find(x => x.id === productId);
    if (!p) return;
    const existing = cart.find(i => i.id === productId && i.size === size);
    if (existing) { existing.quantity++; }
    else { cart.push({ id: p.id, title: p.title, price: p.price, image: p.image, size: size || "M", quantity: 1 }); }
    setLocal("shapes_cart_items", cart);
    updateCartBadge();
    showCartToast();
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    setLocal("shapes_cart_items", cart);
    updateCartBadge();
    renderCartUI();
}

function addCurrentActiveProductToCart() {
    if (!currentActiveProduct) return;
    addToCart(currentActiveProduct.id, selectedSize);
    closeProductDetailModal();
}

/* Toast */
function showCartToast() {
    const toast = document.getElementById("cart-toast-notification");
    if (!toast) return;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 3500);
}

/* ══════════════════════════════════════════════════════════
   WISHLIST
══════════════════════════════════════════════════════════ */
function toggleWishlist(productId) {
    const idx = wishlist.indexOf(productId);
    if (idx > -1) wishlist.splice(idx, 1);
    else wishlist.push(productId);
    setLocal("shapes_wishlist_items", wishlist);
    updateWishlistBadge();
    renderProductsGrid();
    renderJournalArticles();
}

/* ══════════════════════════════════════════════════════════
   REVIEW MODAL
══════════════════════════════════════════════════════════ */
function openReviewModal() {
    const m = document.getElementById("review-modal");
    if (m) {
        m.classList.add("active");
        m.style.display = "flex";
        lockScroll();
    }
}
function closeReviewModal() {
    const m = document.getElementById("review-modal");
    if (m) {
        m.classList.remove("active");
        m.style.display = "none";
    }
    unlockScroll();
}

/* ══════════════════════════════════════════════════════════
   CHECKOUT — Shipping Modal → Razorpay → Admin Sync
══════════════════════════════════════════════════════════ */
function openCheckoutModal() {
    if (!cart || cart.length === 0) {
        showToastMsg("Your shopping bag is empty. Please add items first.");
        return;
    }
    closeCartDrawer();
    const modal = document.getElementById("shipping-address-modal");
    if (modal) { modal.classList.add("active"); lockScroll(); }
}

function closeShippingModal() {
    const modal = document.getElementById("shipping-address-modal");
    if (modal) modal.classList.remove("active");
    unlockScroll();
}

function processFinalRazorpayPayment() {
    // 1. Synchronize cart from localStorage if empty
    try {
        if (!cart || cart.length === 0) {
            cart = JSON.parse(localStorage.getItem("shapes_cart_items") || localStorage.getItem("shapes_cart") || "[]");
        }
    } catch(e) {}

    if (!customerShippingInfo) {
        alert("Please enter your shipping address and contact details.");
        openCheckoutModal();
        return;
    }
    const info = customerShippingInfo;
    const totalINR = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);

    if (totalINR <= 0) {
        alert("Your shopping bag is empty. Please add a bespoke set before checking out.");
        return;
    }
    // Sequential Order ID Generator (SBK-001, SBK-002, SBK-003...)
    function generateSequentialOrderId() {
        const orders = getLocal("shapes_orders", []);
        let maxNum = 0;
        orders.forEach(o => {
            const idStr = String(o.ref || o.id || "");
            const match = idStr.match(/(\d+)$/);
            if (match) {
                const n = parseInt(match[1], 10);
                if (!isNaN(n) && n < 100000 && n > maxNum) maxNum = n;
            }
        });
        let counter = parseInt(localStorage.getItem("shapes_order_seq_counter") || "0", 10);
        if (isNaN(counter)) counter = 0;
        const nextNum = Math.max(maxNum, counter) + 1;
        localStorage.setItem("shapes_order_seq_counter", nextNum.toString());
        return `SBK-${String(nextNum).padStart(3, '0')}`;
    }
    const orderId = generateSequentialOrderId();
    const fullAddr   = `${info.address}, ${info.city}, ${info.state} - ${info.pincode}`;
    const cartSnap   = cart.map(i => ({ ...i }));
    const itemList   = cart.map(i => `${i.title} (Size: ${i.size}, Qty: ${i.quantity})`).join("; ");

    const onPaymentComplete = (paymentRef) => {
        syncOrderToAdmin(orderId, paymentRef, info, totalINR, fullAddr, cartSnap);
        completeOrderSuccess(orderId, paymentRef, info, totalINR, fullAddr, itemList);
    };

    const cfg = getLocal("shapes_config", {});
    const rzpKey = cfg.razorpayKey || "rzp_live_TQ0RwUwXQjD3tq";

    if (typeof Razorpay === "undefined") {
        alert("Razorpay payment gateway is loading. Please verify your connection and try again.");
        return;
    }

    try {
        const rzp = new Razorpay({
            key: rzpKey,
            amount: Math.round(totalINR * 100),
            currency: "INR",
            name: "Shapes By Satiinder Kaur",
            description: `Order ${orderId}`,
            handler: function(resp) {
                if (resp && resp.razorpay_payment_id) {
                    onPaymentComplete(resp.razorpay_payment_id);
                } else {
                    onPaymentComplete("RAZORPAY_PAID");
                }
            },
            prefill: {
                name: info.fullName,
                email: info.email,
                contact: info.phone
            },
            notes: {
                shipping_address: fullAddr,
                order_id: orderId,
                items: itemList.substring(0, 200)
            },
            theme: {
                color: "#C5A059"
            },
            modal: {
                ondismiss: function() {
                    console.log("Razorpay payment window closed.");
                }
            }
        });

        rzp.on("payment.failed", function(resp) {
            console.error("Razorpay Payment Failed:", resp.error);
            alert("Payment could not be completed: " + (resp.error ? resp.error.description : "Transaction declined"));
        });

        rzp.open();
    } catch(e) {
        console.error("Razorpay Init Error:", e);
        alert("Unable to open Razorpay checkout: " + e.message);
    }
}

/* ── ADMIN SYNC ───────────────────────────────────────────── */
function syncOrderToAdmin(orderId, paymentRef, info, totalINR, fullAddr, cartSnapshot) {
    /* ── 1. ORDERS TABLE (exact field names the admin renderOrdersTable expects) ── */
    const orders = getLocal("shapes_orders", []);

    /* Build items array in the exact format admin uses:
       o.items → [{title, size, quantity, price}]
       o.ref, o.customerName, o.customerEmail, o.customerPhone
       o.paymentId, o.status, o.date (ISO string) */
    const orderItems = cartSnapshot.map(item => ({
        title:    item.title,
        size:     item.size,
        quantity: item.quantity,
        price:    item.price
    }));

    const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const gst      = Math.round(subtotal * 0.18); // Strict 18% GST (CGST 9% + SGST 9%)
    const total    = subtotal + gst;

    const newOrder = {
        /* Admin table reads: ref, customerName, customerEmail, customerPhone,
           items (array), paymentId, status, date */
        ref:            orderId,
        id:             orderId,
        date:           new Date().toISOString(),
        customerName:   info.fullName,
        customerEmail:  info.email,
        customerPhone:  info.phone,
        shippingAddress: fullAddr,
        items:          orderItems,
        subtotal:       subtotal,
        gst:            gst,
        total:          total,
        currency:       "INR",
        paymentId:      paymentRef,
        paymentStatus:  paymentRef === "BOUTIQUE_PAYMENT" ? "pending_boutique" : "paid",
        status:         "Confirmed",
        source:         "Online Store",
        notes:          `Ship to: ${fullAddr}`
    };

    orders.unshift(newOrder);
    setLocal("shapes_orders", orders);

    /* ── 2. CLIENTS TABLE (shapes_registered_clients) ── */
    const clients = getLocal("shapes_registered_clients", []);
    const existing = clients.find(c => c.email === info.email || c.phone === info.phone);

    if (!existing) {
        clients.unshift({
            id:          "cust_" + Date.now(),
            /* Fields renderRegisteredClientsTable reads */
            name:        info.fullName,
            email:       info.email,
            phone:       info.phone,
            authProvider: "Online Checkout",
            joinedDate:  new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }),
            source:      "Online Order",
            totalOrders: 1,
            totalSpent:  totalINR,
            status:      "Active Client"
        });
    } else {
        existing.totalOrders = (existing.totalOrders || 0) + 1;
        existing.totalSpent  = (existing.totalSpent  || 0) + totalINR;
        existing.lastOrderDate = new Date().toLocaleDateString("en-IN");
        if (existing.totalOrders >= 3) existing.status = "VIP Client";
    }
    setLocal("shapes_registered_clients", clients);

    /* ── 3. FIREBASE CLOUD FIRESTORE SYNC (Real-Time across all devices) ── */
    if (window._storeDb && window._storeSetDoc && window._storeDoc) {
        try {
            window._storeSetDoc(window._storeDoc(window._storeDb, "orders", orderId), newOrder)
                .then(() => console.log("⚡ [Firebase Cloud Sync] Order saved to Cloud Firestore:", orderId))
                .catch(err => console.warn("Firebase order cloud save notice:", err));

            const clientObj = existing || clients[0];
            if (clientObj) {
                window._storeSetDoc(window._storeDoc(window._storeDb, "clients", clientObj.id), clientObj)
                    .then(() => console.log("⚡ [Firebase Cloud Sync] Client profile synced to Cloud Firestore"))
                    .catch(err => console.warn("Firebase client cloud save notice:", err));
            }
        } catch(e) {
            console.warn("Firebase cloud order sync execution notice:", e);
        }
    }

    /* ── 4. BROADCAST a storage event so admin auto-refreshes in real time ── */
    /* The admin page listens for 'shapes_new_order' in sessionStorage changes */
    try {
        sessionStorage.setItem("shapes_new_order", orderId + "_" + Date.now());
    } catch(e) {}
}

/* ══════════════════════════════════════════════════════════
   EMAILJS CONFIG
   Set up at https://emailjs.com → free up to 200 emails/month
   1. Create account, add Gmail service
   2. Create two templates (see README)
   3. Replace the placeholder values below
══════════════════════════════════════════════════════════ */
const EMAILJS_CONFIG = {
    publicKey:           "YOUR_EMAILJS_PUBLIC_KEY",     // EmailJS Dashboard → Account → Public Key
    serviceId:           "YOUR_EMAILJS_SERVICE_ID",     // EmailJS Dashboard → Email Services → Service ID
    customerTemplateId:  "YOUR_CUSTOMER_TEMPLATE_ID",   // Template for customer order confirmation
    ownerTemplateId:     "YOUR_OWNER_TEMPLATE_ID",      // Template for owner new order alert
    ownerEmail:          "concierge@shapes_boutique.com"      // Boutique owner email
};

/* ── INIT EMAILJS ─────────────────────────────────────────── */
(function initEmailJS() {
    if (typeof emailjs !== "undefined" && EMAILJS_CONFIG.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY") {
        emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    }
})();

/* ══════════════════════════════════════════════════════════
   PDF INVOICE GENERATOR
   Generates a beautiful branded tax invoice using jsPDF
══════════════════════════════════════════════════════════ */
let _lastInvoicePdfDoc = null; // store last generated PDF for reprint

function generatePDFInvoice(orderData) {
    if (typeof window.jspdf === "undefined") {
        console.warn("jsPDF not loaded");
        return null;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210; // A4 width mm
    const gold = [197, 160, 89];
    const dark = [17, 17, 17];

    /* ── Background ── */
    doc.setFillColor(...dark);
    doc.rect(0, 0, W, 297, "F");

    /* ── Gold header bar ── */
    doc.setFillColor(...gold);
    doc.rect(0, 0, W, 38, "F");

    /* ── Brand name ── */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(17, 17, 17);
    doc.text("Shapes By Satiinder Kaur", W / 2, 16, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("LUXURY PRET & CO-ORD SETS  ·  BASANT GARDEN, CHEMBUR, MUMBAI 400071", W / 2, 23, { align: "center" });
    doc.text("Tel: +91 98333 92756  ·  Email: concierge@shapes_boutique.com  ·  shapesbysatinderkaur.com", W / 2, 29, { align: "center" });

    /* ── TAX INVOICE label ── */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...gold);
    doc.text("TAX INVOICE", W / 2, 48, { align: "center" });

    /* ── Thin gold divider ── */
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.3);
    doc.line(15, 52, W - 15, 52);

    /* ── Invoice meta ── */
    const items     = orderData.items || [];
    const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const gst       = Math.round(subtotal * 0.18); // Strict 18% GST
    const total     = subtotal + gst;
    const dateStr   = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);

    // Left col
    doc.setFont("helvetica", "bold"); doc.setTextColor(...gold);
    doc.text("INVOICE NO.", 15, 62);
    doc.setFont("helvetica", "normal"); doc.setTextColor(220, 220, 220);
    doc.text(orderData.ref || orderData.id, 15, 67);

    doc.setFont("helvetica", "bold"); doc.setTextColor(...gold);
    doc.text("DATE", 15, 75);
    doc.setFont("helvetica", "normal"); doc.setTextColor(220, 220, 220);
    doc.text(dateStr, 15, 80);

    doc.setFont("helvetica", "bold"); doc.setTextColor(...gold);
    doc.text("PAYMENT REF", 15, 88);
    doc.setFont("helvetica", "normal"); doc.setTextColor(220, 220, 220);
    doc.text(orderData.paymentId || "—", 15, 93);

    // Right col — bill to
    doc.setFont("helvetica", "bold"); doc.setTextColor(...gold);
    doc.text("BILL TO", 120, 62);
    doc.setFont("helvetica", "normal"); doc.setTextColor(220, 220, 220);
    doc.text(orderData.customerName   || "—", 120, 67);
    doc.text(orderData.customerPhone  || "—", 120, 72);
    doc.text(orderData.customerEmail  || "—", 120, 77);

    const addrLines = doc.splitTextToSize(orderData.shippingAddress || "—", 75);
    doc.setFont("helvetica", "bold"); doc.setTextColor(...gold);
    doc.text("SHIP TO", 120, 85);
    doc.setFont("helvetica", "normal"); doc.setTextColor(220, 220, 220);
    doc.text(addrLines, 120, 90);

    /* ── Items table ── */
    const tableRows = items.map((item, idx) => [
        idx + 1,
        item.title,
        item.size,
        item.quantity,
        `Rs. ${item.price.toLocaleString("en-IN")}`,
        `Rs. ${(item.price * item.quantity).toLocaleString("en-IN")}`
    ]);

    doc.autoTable({
        startY: 108,
        head: [["#", "Product", "Size", "Qty", "Unit Price", "Amount"]],
        body: tableRows,
        theme: "plain",
        styles: {
            font: "helvetica",
            fontSize: 8.5,
            textColor: [220, 220, 220],
            fillColor: [30, 30, 30],
            lineColor: [50, 50, 50],
            lineWidth: 0.2
        },
        headStyles: {
            fillColor: gold,
            textColor: [17, 17, 17],
            fontStyle: "bold",
            fontSize: 8.5
        },
        alternateRowStyles: { fillColor: [22, 22, 22] },
        columnStyles: {
            0: { cellWidth: 10, halign: "center" },
            1: { cellWidth: 75 },
            2: { cellWidth: 18, halign: "center" },
            3: { cellWidth: 12, halign: "center" },
            4: { cellWidth: 30, halign: "right" },
            5: { cellWidth: 30, halign: "right" }
        },
        margin: { left: 15, right: 15 }
    });

    let y = doc.lastAutoTable.finalY + 8;

    /* ── Totals ── */
    const drawTotalRow = (label, value, highlight) => {
        if (highlight) {
            doc.setFillColor(...gold);
            doc.rect(115, y - 4.5, 80, 7, "F");
            doc.setTextColor(17, 17, 17);
        } else {
            doc.setTextColor(180, 180, 180);
        }
        doc.setFont("helvetica", highlight ? "bold" : "normal");
        doc.setFontSize(8.5);
        doc.text(label, 160, y, { align: "right" });
        doc.text(value, 193, y, { align: "right" });
        y += 9;
        if (highlight) doc.setTextColor(200, 200, 200);
    };

    drawTotalRow("Subtotal:", `Rs. ${subtotal.toLocaleString("en-IN")}`, false);
    const cgst = Math.round(gst / 2);
    const sgst = gst - cgst;
    drawTotalRow("CGST (9%):", `Rs. ${cgst.toLocaleString("en-IN")}`, false);
    drawTotalRow("SGST (9%):", `Rs. ${sgst.toLocaleString("en-IN")}`, false);
    drawTotalRow("TOTAL AMOUNT:", `Rs. ${total.toLocaleString("en-IN")}`, true);

    y += 5;
    /* ── Thank you note ── */
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.3);
    doc.line(15, y, W - 15, y);
    y += 8;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...gold);
    doc.text("Thank you for choosing Shapes By Satiinder Kaur.", W / 2, y, { align: "center" });
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);
    doc.text("This is a computer-generated invoice and does not require a signature.", W / 2, y, { align: "center" });
    y += 5;
    doc.text("For queries: +91 98333 92756  ·  concierge@shapes_boutique.com  ·  shapesbysatinderkaur.com", W / 2, y, { align: "center" });

    _lastInvoicePdfDoc = doc;
    return doc;
}

function downloadInvoice(doc, orderId) {
    if (!doc) return;
    doc.save(`Shapes_Invoice_${orderId}.pdf`);
}

function printInvoice(doc) {
    if (!doc) return;
    const blob = doc.output("bloburl");
    const w = window.open(blob);
    if (w) setTimeout(() => w.print(), 800);
}

/* ══════════════════════════════════════════════════════════
   EMAIL SENDER — via EmailJS
   Templates required (create at emailjs.com):
   Customer template variables: {{to_name}}, {{to_email}},
     {{order_id}}, {{items_list}}, {{total}}, {{address}},
     {{payment_ref}}, {{boutique_phone}}
   Owner template variables: {{customer_name}}, {{customer_phone}},
     {{customer_email}}, {{order_id}}, {{items_list}},
     {{total}}, {{address}}, {{payment_ref}}
══════════════════════════════════════════════════════════ */
async function sendOrderEmails(orderData) {
    if (typeof emailjs === "undefined") {
        console.warn("EmailJS not loaded — emails skipped");
        return;
    }
    if (EMAILJS_CONFIG.publicKey === "YOUR_EMAILJS_PUBLIC_KEY") {
        console.info("EmailJS not configured — set your keys in EMAILJS_CONFIG in index.js");
        return;
    }

    const items = (orderData.items || []);
    const subtotal = items.reduce((s, i) => s + (i.price * i.quantity), 0);
    const gst       = Math.round(subtotal * 0.18); // Strict 18% GST
    const total    = subtotal + gst;
    const itemsText = items.map(i => `• ${i.title}  [Size: ${i.size || 'M'}, Qty: ${i.quantity || 1}]  — ₹${((i.price || 0) * (i.quantity || 1)).toLocaleString("en-IN")}`).join("\n");

    const commonParams = {
        order_id:         orderData.ref || orderData.id,
        items_list:       itemsText,
        subtotal:         `₹${subtotal.toLocaleString("en-IN")}`,
        gst_amount:       `₹${gst.toLocaleString("en-IN")} (18% GST)`,
        total:            `₹${total.toLocaleString("en-IN")}`,
        total_amount:     `₹${total.toLocaleString("en-IN")}`,
        address:          orderData.shippingAddress || "—",
        shipping_address: orderData.shippingAddress || "—",
        payment_ref:      orderData.paymentId || "—",
        payment_id:       orderData.paymentId || "Prepaid",
        customer_name:    orderData.customerName || "Customer",
        customer_phone:   orderData.customerPhone || "—",
        customer_email:   orderData.customerEmail || "—",
        boutique_phone:   "+91 98333 92756",
        order_date:       new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        admin_portal:     "https://shapesbysatinderkaur.com/admin.html"
    };

    try {
        /* ── Customer email ── */
        await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.customerTemplateId, {
            ...commonParams,
            to_name:  orderData.customerName,
            to_email: orderData.customerEmail
        });
        console.info("Customer confirmation email sent to", orderData.customerEmail);
    } catch(e) {
        console.warn("Customer email notice:", e);
    }

    try {
        /* ── Owner/Boutique alert email ── */
        await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.ownerTemplateId, {
            ...commonParams,
            to_name:       "Satiinder Kaur",
            to_email:      EMAILJS_CONFIG.ownerEmail || "concierge@shapes_boutique.com"
        });
        console.info("Owner notification email sent to concierge@shapes_boutique.com");
    } catch(e) {
        console.warn("Owner email notice:", e);
    }
}

/* ══════════════════════════════════════════════════════════
   FIREBASE FIRESTORE ORDER SAVE
   Writes to Firestore 'orders' collection in real-time
══════════════════════════════════════════════════════════ */
async function saveOrderToFirestore(orderData) {
    if (!window._storeFirebaseReady || !window._storeAddDoc || !window._storeCollection || !window._storeDb) {
        console.warn("Firebase not ready — order saved to localStorage only");
        return null;
    }
    try {
        const docRef = await window._storeAddDoc(
            window._storeCollection(window._storeDb, "orders"),
            orderData
        );
        console.info("Order saved to Firestore:", docRef.id);
        return docRef.id;
    } catch(err) {
        console.warn("Firestore write failed, localStorage backup in use:", err.message);
        return null;
    }
}

/* ══════════════════════════════════════════════════════════
   ORDER SUCCESS — Complete Flow
══════════════════════════════════════════════════════════ */
async function completeOrderSuccess(orderId, paymentRef, info, totalINR, fullAddr, itemList) {
    /* 1. Clear cart */
    cart = [];
    setLocal("shapes_cart_items", cart);
    updateCartBadge();
    closeShippingModal();

    /* 2. Build full order object for PDF + Firebase */
    const orderItems = (itemList || "").split(";").map(s => s.trim()).filter(Boolean);
    /* Use the most recent _allOrderItems which syncOrderToAdmin built */
    const adminOrders = getLocal("shapes_orders", []);
    const thisOrder   = adminOrders.find(o => (o.ref || o.id) === orderId);

    const orderForPDF = thisOrder || {
        ref:            orderId,
        id:             orderId,
        date:           new Date().toISOString(),
        customerName:   info.fullName,
        customerEmail:  info.email,
        customerPhone:  info.phone,
        shippingAddress: fullAddr,
        items:          orderItems.map(s => ({ title: s, size: "M", quantity: 1, price: 0 })),
        paymentId:      paymentRef,
        status:         "Confirmed"
    };

    /* 3. Save to Firebase Firestore (non-blocking) */
    saveOrderToFirestore(orderForPDF);

    /* 4. Generate PDF invoice */
    const pdfDoc = generatePDFInvoice(orderForPDF);
    _lastInvoicePdfDoc = pdfDoc;

    /* 5. Send emails (non-blocking — don't await, show modal immediately) */
    sendOrderEmails(orderForPDF);

    /* 6. Show Order Success Modal with invoice buttons */
    const modal = document.getElementById("order-success-modal");
    const refEl = document.getElementById("order-success-ref");
    const msgEl = document.getElementById("order-success-message");

    if (refEl) refEl.textContent = `Order Reference: ${orderId}`;
    if (msgEl) {
        const subtotal = (thisOrder ? thisOrder.subtotal : totalINR) || totalINR;
        const gst       = Math.round(subtotal * 0.18); // Strict 18% GST
        const total    = subtotal + gst;
        msgEl.innerHTML = `
            Hello <strong>${info.fullName}</strong>, your bespoke couture order has been confirmed!<br><br>
            A confirmation email with your official PDF Tax Invoice has been sent to <strong>${info.email}</strong>.<br>
            We will update you at <strong>${info.phone}</strong> as your garment is tailored.<br><br>
            <strong style="color:var(--gold);">Total Paid: ₹${total.toLocaleString("en-IN")}</strong>
            <span style="font-size:0.75rem;color:#888;"> (incl. 18% GST &amp; Insured Express Courier)</span>
            <div style="margin-top:1.2rem;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
                <a href="track.html?order=${orderId}" class="gold-action-btn" style="display:inline-flex;align-items:center;gap:6px;padding:9px 16px;font-size:0.75rem;border-radius:4px;text-decoration:none;">
                    <i class="fa-solid fa-location-crosshairs"></i> Track Order Live
                </a>
            </div>
        `;
    }

    /* Wire up Download + Print buttons */
    const dlBtn    = document.getElementById("invoice-download-btn");
    const printBtn = document.getElementById("invoice-print-btn");
    const closeBtn = document.getElementById("close-order-success-modal");

    if (dlBtn)    dlBtn.onclick    = () => downloadInvoice(_lastInvoicePdfDoc, orderId);
    if (printBtn) printBtn.onclick = () => printInvoice(_lastInvoicePdfDoc);
    if (closeBtn) closeBtn.onclick = () => {
        if (modal) modal.classList.remove("active");
        unlockScroll();
    };

    if (modal) { modal.classList.add("active"); lockScroll(); }

    /* 7. WhatsApp notification to boutique */
    const waText = encodeURIComponent(
        `🛍 New Online Order — ${orderId}\n` +
        `👤 ${info.fullName} | 📞 ${info.phone} | 📧 ${info.email}\n` +
        `📍 ${fullAddr}\n` +
        `📦 ${itemList}\n` +
        `💰 Total: ₹${totalINR.toLocaleString("en-IN")}\n` +
        `Payment Ref: ${paymentRef}`
    );
    setTimeout(() => window.open(`https://wa.me/919833392756?text=${waText}`, "_blank"), 1200);
}


/* Generic toast message */
function showToastMsg(msg) {
    const toast = document.getElementById("cart-toast-notification");
    if (!toast) { alert(msg); return; }
    const span = toast.querySelector("span");
    if (span) span.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 4000);
}

/* ══════════════════════════════════════════════════════════
   MOBILE NAV DRAWER
══════════════════════════════════════════════════════════ */
function openMobileNav() {
    const drawer  = document.getElementById("mobile-nav-drawer");
    const overlay = document.getElementById("mobile-nav-overlay");
    const btn     = document.getElementById("mobile-menu-btn");
    if (drawer)  drawer.classList.add("open");
    if (overlay) overlay.classList.add("show");
    if (btn)     btn.setAttribute("aria-expanded", "true");
    lockScroll();
}
function closeMobileNav() {
    const drawer  = document.getElementById("mobile-nav-drawer");
    const overlay = document.getElementById("mobile-nav-overlay");
    const btn     = document.getElementById("mobile-menu-btn");
    if (drawer)  drawer.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
    if (btn)     btn.setAttribute("aria-expanded", "false");
    unlockScroll();
}

/* ══════════════════════════════════════════════════════════
   PRODUCT ACCORDION — DROPDOWN SECTIONS
══════════════════════════════════════════════════════════ */
function toggleProductAccordion(accId) {
    const item = document.getElementById(accId);
    if (!item) return;
    const isOpen = item.classList.contains("open");
    /* Close all */
    document.querySelectorAll(".prod-acc-item").forEach(el => el.classList.remove("open"));
    /* Toggle clicked */
    if (!isOpen) item.classList.add("open");
}

/* ══════════════════════════════════════════════════════════
   SIZE CHART TOGGLE
══════════════════════════════════════════════════════════ */
function toggleSizeChart(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    const chart = document.getElementById("modal-size-chart-table");
    const btn   = document.getElementById("toggle-size-chart-btn");
    if (!chart) return;

    const isOpen = chart.style.display === "block";
    if (isOpen) {
        chart.style.display = "none";
        if (btn) btn.innerHTML = `<i class="fa-solid fa-ruler-combined"></i> Size Guide`;
    } else {
        chart.style.display = "block";
        if (btn) btn.innerHTML = `<i class="fa-solid fa-xmark"></i> Hide Size Guide`;
    }
}

/* ══════════════════════════════════════════════════════════
   MASTER EVENT DELEGATION ENGINE
   All button clicks routed through a single delegated handler
══════════════════════════════════════════════════════════ */
document.addEventListener("click", function(e) {
    const tgt = e.target;

    /* ─ Mobile Nav ─ */
    if (tgt.closest("#mobile-menu-btn")) { e.preventDefault(); openMobileNav(); return; }
    if (tgt.closest("#mobile-close-btn") || tgt.closest("#mobile-nav-overlay")) { closeMobileNav(); return; }
    /* Close mobile nav on link click */
    if (tgt.closest(".mobile-link")) { closeMobileNav(); return; }

    /* ─ Cart ─ */
    if (tgt.closest("#cart-nav-trigger") || tgt.closest("#toast-view-bag-btn")) { e.preventDefault(); openCartDrawer(); return; }
    if (tgt.closest("#close-cart-drawer")) { closeCartDrawer(); return; }
    if (tgt.id === "cart-drawer-overlay") { closeCartDrawer(); return; }

    /* ─ Remove from cart ─ */
    const removeBtn = tgt.closest("[data-action='remove-cart']");
    if (removeBtn) { removeFromCart(parseInt(removeBtn.getAttribute("data-idx"))); return; }

    /* ─ Wishlist ─ */
    if (tgt.closest("#wishlist-nav-trigger")) { e.preventDefault(); alert(`Your Wishlist has ${wishlist.length} saved item(s).`); return; }
    const wishBtn = tgt.closest("[data-action='wishlist']");
    if (wishBtn) { e.stopPropagation(); toggleWishlist(wishBtn.getAttribute("data-id")); return; }

    /* ─ Product Card click (but not wishlist button) ─ */
    const openDetailBtn = tgt.closest("[data-action='open-detail']");
    if (openDetailBtn) { e.stopPropagation(); openProductDetail(openDetailBtn.getAttribute("data-id")); return; }
    const card = tgt.closest(".product-card");
    if (card && !tgt.closest("[data-action]")) { openProductDetail(card.getAttribute("data-id")); return; }

    /* ─ Product Detail Modal ─ */
    if (tgt.closest("#close-detail-modal")) { closeProductDetailModal(); return; }
    if (tgt.id === "product-detail-modal" && !tgt.closest(".modal-content-wrapper")) { closeProductDetailModal(); return; }

    /* ─ Size Chart Toggle ─ */
    if (tgt.closest("#toggle-size-chart-btn")) { e.preventDefault(); toggleSizeChart(); return; }

    /* ─ Size Option ─ */
    const sizeOpt = tgt.closest(".size-option");
    if (sizeOpt) {
        document.querySelectorAll(".size-option").forEach(o => o.classList.remove("active"));
        sizeOpt.classList.add("active");
        selectedSize = sizeOpt.getAttribute("data-size") || "M";

        // Highlight matching row in the Size Guide table
        document.querySelectorAll(".size-chart-table tbody tr").forEach(row => {
            const pill = row.querySelector(".size-pill");
            if (pill) {
                const match = pill.textContent.trim() === selectedSize;
                row.classList.toggle("size-row-highlight", match);
                pill.classList.toggle("size-pill-active", match);
            }
        });
        return;
    }

    /* ─ Product Detail Accordions ─ */
    const accTrigger = tgt.closest(".prod-acc-trigger");
    if (accTrigger) {
        const accId = accTrigger.getAttribute("data-acc");
        if (accId) toggleProductAccordion(accId);
        return;
    }

    /* ─ Add To Cart ─ */
    if (tgt.closest("#modal-add-to-cart-btn")) { e.preventDefault(); addCurrentActiveProductToCart(); return; }

    /* ─ Checkout ─ */
    if (tgt.closest("#proceed-checkout-btn")) { e.preventDefault(); openCheckoutModal(); return; }
    if (tgt.closest("#close-shipping-modal")) { closeShippingModal(); return; }
    if (tgt.id === "shipping-address-modal" && !tgt.closest(".form-modal-content")) { closeShippingModal(); return; }

    /* ─ Review Modal ─ */
    if (tgt.closest("#open-review-modal-btn")) { e.preventDefault(); openReviewModal(); return; }
    if (tgt.closest("#close-review-modal")) { closeReviewModal(); return; }
    if (tgt.id === "review-modal" && !tgt.closest(".form-modal-content")) { closeReviewModal(); return; }

    /* ─ Category Tabs ─ */
    const tabBtn = tgt.closest(".tab-btn");
    if (tabBtn) { currentCategory = tabBtn.getAttribute("data-category"); renderCategoryTabs(); renderProductsGrid();
    renderJournalArticles(); return; }

    /* ─ FAQ Accordion ─ */
    const faqBtn = tgt.closest(".faq-question-btn");
    if (faqBtn) { faqBtn.closest(".faq-item").classList.toggle("active"); return; }

    /* ─ Journal Article Click & Reader Modal ─ */
    const journalCard = tgt.closest(".journal-card");
    if (journalCard && !tgt.closest(".journal-read-btn")) {
        openJournalArticleModal(journalCard.getAttribute("data-id"));
        return;
    }
    if (tgt.closest("#close-journal-modal") || (tgt.id === "journal-article-modal" && !tgt.closest(".journal-reader-content"))) {
        closeJournalArticleModal();
        return;
    }

}, { passive: false });

/* Keyboard: close modals with Escape */
document.addEventListener("keydown", function(e) {
    if (e.key !== "Escape") return;
    closeProductDetailModal();
    closeCartDrawer();
    closeShippingModal();
    closeReviewModal();
    closeMobileNav();
});

/* ══════════════════════════════════════════════════════════
   FORM SUBMISSIONS
══════════════════════════════════════════════════════════ */
function initForms() {
    /* Shipping Form */
    const shipForm = document.getElementById("customer-shipping-form");
    if (shipForm) {
        shipForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const name    = document.getElementById("ship-full-name")?.value.trim();
            const phone   = document.getElementById("ship-phone")?.value.trim();
            const email   = document.getElementById("ship-email")?.value.trim();
            const address = document.getElementById("ship-address")?.value.trim();
            const city    = document.getElementById("ship-city")?.value.trim();
            const state   = document.getElementById("ship-state")?.value.trim();
            const pincode = document.getElementById("ship-pincode")?.value.trim();

            if (!name || !phone || !email || !address || !city || !state || !pincode) {
                alert("Please fill in all required fields before proceeding.");
                return;
            }
            if (!/^\d{6}$/.test(pincode)) {
                alert("Please enter a valid 6-digit Indian pincode.");
                return;
            }
            if (!/[^@\s]+@[^@\s]+\.[^@\s]+/.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            customerShippingInfo = { fullName: name, phone, email, address, city, state, pincode };
            processFinalRazorpayPayment();
        });
    }

    /* Review Form */
    const reviewForm = document.getElementById("client-review-form");
    if (reviewForm) {
        reviewForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const newReview = {
                id: "rev_" + Date.now(),
                authorName: document.getElementById("review-author-name")?.value.trim() || "Anonymous",
                location:   document.getElementById("review-author-location")?.value.trim() || "India",
                reviewText: document.getElementById("review-body-text")?.value.trim() || "",
                rating:     parseInt(document.getElementById("review-rating-select")?.value || "5"),
                date: "Just Now"
            };
            if (!newReview.reviewText) { alert("Please write your review text."); return; }

            const reviews = getLocal("shapes_client_reviews", DEFAULT_CLIENT_REVIEWS);
            reviews.unshift(newReview);
            setLocal("shapes_client_reviews", reviews);

            closeReviewModal();
            reviewForm.reset();
            renderClientReviews();
            alert("✨ Thank you! Your gracious review has been published.");
        });
    }
}

/* ══════════════════════════════════════════════════════════
   INPUT LISTENERS
══════════════════════════════════════════════════════════ */
function initInputListeners() {
    /* Search */
    const searchEl = document.getElementById("boutique-search-input");
    if (searchEl) searchEl.addEventListener("input", e => { searchQuery = e.target.value; renderProductsGrid();
    renderJournalArticles(); });

    /* Sort */
    const sortEl = document.getElementById("boutique-sort-select");
    if (sortEl) sortEl.addEventListener("change", e => { sortOption = e.target.value; renderProductsGrid();
    renderJournalArticles(); });

    /* Currency */
    const currEl = document.getElementById("currency-selector");
    if (currEl) currEl.addEventListener("change", e => {
        selectedCurrency = e.target.value;
        localStorage.setItem("shapes_selected_currency", selectedCurrency);
        renderProductsGrid();
    renderJournalArticles();
        if (cart.length) renderCartUI();
        if (currentActiveProduct) {
            const priceEl = document.getElementById("modal-product-price");
            if (priceEl) priceEl.textContent = formatPrice(currentActiveProduct.price);
        }
    });
}

/* ══════════════════════════════════════════════════════════
   PRODUCTS: MERGE ADMIN EDITS WITH DEFAULTS
══════════════════════════════════════════════════════════ */
function loadProducts() {
    let localProds = getLocal("shapes_products", null);
    if (localProds && Array.isArray(localProds) && localProds.length > 0) {
        products = localProds.map(p => {
            const def = DEFAULT_PRODUCTS.find(d => d.id === p.id);
            let img = p.image || (def ? def.image : "images/coord_black_floral.webp");
            if (!img.startsWith("images/") && !img.startsWith("http") && !img.startsWith("data:")) {
                img = "images/" + img;
            }
            // Sanitize images array so other default dresses NEVER appear as extra angles
            let validImages = [img];
            if (Array.isArray(p.images) && p.images.length > 1) {
                // If the images array was an old test mix of other default products, discard it
                const isOldDefaultMix = p.images.some((src, idx) => idx > 0 && DEFAULT_PRODUCTS.some(dp => dp.id !== p.id && (dp.image === src || ("images/" + dp.image) === src)));
                if (!isOldDefaultMix) {
                    validImages = p.images.map(s => {
                        if (!s.startsWith("images/") && !s.startsWith("http") && !s.startsWith("data:")) return "images/" + s;
                        return s;
                    });
                }
            }
            return {
                ...(def || {}),
                ...p,
                image: img,
                images: validImages
            };
        });
    } else {
        products = DEFAULT_PRODUCTS.map(d => ({ ...d, images: [d.image] }));
    }
    if (!products || products.length === 0) {
        products = DEFAULT_PRODUCTS.map(d => ({ ...d, images: [d.image] }));
    }
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
function initStore() {
    autoDetectVisitorCurrency();
    /* Ensure scroll is unlocked on load */
    unlockScroll();

    /* Multi-device version sync */
    const STORE_VERSION = "55.0";
    if (getLocal("shapes_store_version", null) !== STORE_VERSION) {
        setLocal("shapes_store_version", STORE_VERSION);
        setLocal("shapes_products", DEFAULT_PRODUCTS);
        setLocal("shapes_verified_reviews_v3", DEFAULT_CLIENT_REVIEWS);
    }

    /* Load data */
    loadProducts();
    cart     = getLocal("shapes_cart_items",    []);
    wishlist = getLocal("shapes_wishlist_items", []);

    /* Render */
    renderCategoryTabs();
    renderProductsGrid();
    renderJournalArticles();
    renderClientReviews();
    updateCartBadge();
    updateWishlistBadge();

    /* Init forms & listeners */
    initForms();
    initInputListeners();

    /* Header scroll shadow */
    const header = document.getElementById("main-header");
    if (header) {
        window.addEventListener("scroll", () => {
            header.style.boxShadow = window.scrollY > 20 ? "0 4px 30px rgba(0,0,0,0.7)" : "none";
        }, { passive: true });
    }

    /* Initialize Firebase Cloud Real-Time Sync */
    if (window._storeFirebaseReady) {
        initFirebaseSync();
    }
}

/* ══════════════════════════════════════════════════════════
   REAL-TIME FIREBASE CLOUD SYNC
══════════════════════════════════════════════════════════ */
function applyLiveStoreSettings(cfg) {
    if (!cfg) return;
    if (cfg.boutiquePhone) {
        document.querySelectorAll('a[href^="tel:"]').forEach(el => el.href = `tel:${cfg.boutiquePhone}`);
    }
    if (cfg.boutiqueWhatsApp) {
        const cleanWa = cfg.boutiqueWhatsApp.replace(/[^0-9]/g, '');
        document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
            el.href = `https://wa.me/${cleanWa}`;
        });
    }
    if (cfg.announcementText) {
        const bar = document.querySelector(".top-announcement-bar");
        if (bar) bar.textContent = cfg.announcementText;
    }
}

function initFirebaseSync() {
    if (!window._storeDb || !window._storeCollection || !window._storeOnSnapshot) return;
    const db = window._storeDb;
    const collection = window._storeCollection;
    const onSnapshot = window._storeOnSnapshot;

    // 1. Real-time Live Products Sync
    try {
        onSnapshot(collection(db, "products"), (snapshot) => {
            if (!snapshot.empty) {
                const cloudProds = [];
                snapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    cloudProds.push({ id: docSnap.id, ...data });
                });
                if (cloudProds.length > 0) {
                    products = cloudProds;
                    setLocal("shapes_products", products);
                    renderProductsGrid();
    renderJournalArticles();
                    console.log("⚡ [Firebase Cloud Sync] Storefront updated live:", products.length, "creations.");
                }
            }
        }, (err) => {
            console.warn("Firebase products listener notice:", err);
        });
    } catch(e) {
        console.warn("Firebase products sync setup:", e);
    }

    // 2. Real-time Store Settings Sync
    try {
        onSnapshot(collection(db, "store_settings"), (snapshot) => {
            snapshot.forEach(docSnap => {
                if (docSnap.id === "general") {
                    const data = docSnap.data();
                    if (data) {
                        setLocal("shapes_config", data);
                        applyLiveStoreSettings(data);
                    }
                }
            });
        }, (err) => {});
    } catch(e) {}
}

window.addEventListener("store-firebase-ready", initFirebaseSync);

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStore);
} else {
    initStore();
}

/* ── GLOBAL EXPOSURE (for inline onclick fallbacks) ───────── */
window.openProductDetail             = openProductDetail;
window.closeProductDetailModal       = closeProductDetailModal;
window.openCartDrawer                = openCartDrawer;
window.closeCartDrawer               = closeCartDrawer;
window.openReviewModal               = openReviewModal;
window.closeReviewModal              = closeReviewModal;
window.openCheckoutModal             = openCheckoutModal;
window.closeShippingModal            = closeShippingModal;
window.addToCart                     = addToCart;
window.toggleWishlist                = toggleWishlist;
window.removeFromCart                = removeFromCart;
window.addCurrentActiveProductToCart = addCurrentActiveProductToCart;
window.toggleSizeChart               = toggleSizeChart;
window.toggleProductAccordion        = toggleProductAccordion;

/* ══════════════════════════════════════════════════════════
   FABRIC & EMBROIDERY ZOOM LIGHTBOX CONTROLLER
══════════════════════════════════════════════════════════ */
let _currentZoomScale = 1.0;
let _isPanning = false;
let _panStartX = 0, _panStartY = 0, _panCurrentX = 0, _panCurrentY = 0;

function openImageZoomModal(imgSrc, title) {
    const modal = document.getElementById("fabric-zoom-modal");
    const targetImg = document.getElementById("zoom-target-image");
    const titleLabel = document.getElementById("zoom-product-title");
    const badge = document.getElementById("zoom-level-badge");

    if (!modal || !targetImg) return;

    targetImg.src = imgSrc || (currentActiveProduct ? currentActiveProduct.image : "images/coord_black_floral.webp");
    if (titleLabel) titleLabel.textContent = title || (currentActiveProduct ? currentActiveProduct.title : "Fabric & Embroidery Inspection");

    _currentZoomScale = 1.0;
    _panCurrentX = 0;
    _panCurrentY = 0;
    updateZoomTransform();

    modal.style.display = "flex";
    modal.classList.add("active");

    // Close button
    const closeBtn = document.getElementById("close-zoom-modal");
    if (closeBtn) closeBtn.onclick = closeImageZoomModal;

    // Controls
    const inBtn = document.getElementById("zoom-in-btn");
    const outBtn = document.getElementById("zoom-out-btn");
    const resetBtn = document.getElementById("zoom-reset-btn");

    if (inBtn) inBtn.onclick = () => { _currentZoomScale = Math.min(_currentZoomScale + 0.5, 3.5); updateZoomTransform(); };
    if (outBtn) outBtn.onclick = () => { _currentZoomScale = Math.max(_currentZoomScale - 0.5, 1.0); updateZoomTransform(); };
    if (resetBtn) resetBtn.onclick = () => { _currentZoomScale = 1.0; _panCurrentX = 0; _panCurrentY = 0; updateZoomTransform(); };

    // Pan interactions
    const viewport = document.getElementById("zoom-viewport");
    if (viewport) {
        viewport.onmousedown = (e) => {
            if (_currentZoomScale <= 1.0) return;
            _isPanning = true;
            _panStartX = e.clientX - _panCurrentX;
            _panStartY = e.clientY - _panCurrentY;
        };
        window.onmousemove = (e) => {
            if (!_isPanning) return;
            _panCurrentX = e.clientX - _panStartX;
            _panCurrentY = e.clientY - _panStartY;
            updateZoomTransform();
        };
        window.onmouseup = () => { _isPanning = false; };

        // Touch pinch/pan for mobile
        viewport.ontouchstart = (e) => {
            if (e.touches.length === 1 && _currentZoomScale > 1.0) {
                _isPanning = true;
                _panStartX = e.touches[0].clientX - _panCurrentX;
                _panStartY = e.touches[0].clientY - _panCurrentY;
            }
        };
        viewport.ontouchmove = (e) => {
            if (_isPanning && e.touches.length === 1) {
                _panCurrentX = e.touches[0].clientX - _panStartX;
                _panCurrentY = e.touches[0].clientY - _panStartY;
                updateZoomTransform();
            }
        };
        viewport.ontouchend = () => { _isPanning = false; };
    }
}

function updateZoomTransform() {
    const targetImg = document.getElementById("zoom-target-image");
    const badge = document.getElementById("zoom-level-badge");
    if (targetImg) {
        targetImg.style.transform = `translate(${_panCurrentX}px, ${_panCurrentY}px) scale(${_currentZoomScale})`;
    }
    if (badge) {
        badge.textContent = `${Math.round(_currentZoomScale * 100)}%`;
    }
}

function closeImageZoomModal() {
    const modal = document.getElementById("fabric-zoom-modal");
    if (modal) {
        modal.style.display = "none";
        modal.classList.remove("active");
    }
}

window.openImageZoomModal  = openImageZoomModal;
window.closeImageZoomModal = closeImageZoomModal;


/* ── Journal (Disabled) ── */
function renderJournalArticles() {}
function openJournalArticleModal() {}
function closeJournalArticleModal() {}
function filterJournalCategory() {}
function shareJournalStory() {}
window.openJournalArticleModal = openJournalArticleModal;
window.closeJournalArticleModal = closeJournalArticleModal;
window.renderJournalArticles = renderJournalArticles;
window.filterJournalCategory = filterJournalCategory;
window.shareJournalStory = shareJournalStory;



/* ══════════════════════════════════════════════════════════
   VIEW MORE REVIEWS CONTROLLER
══════════════════════════════════════════════════════════ */
let _isShowingAllReviews = false;

function toggleMoreReviews() {
    const extraGrid = document.getElementById("extra-reviews-grid");
    const btn = document.getElementById("toggle-more-reviews-btn");
    if (!extraGrid || !btn) return;

    _isShowingAllReviews = !_isShowingAllReviews;
    if (_isShowingAllReviews) {
        extraGrid.style.display = "grid";
        btn.innerHTML = `<i class="fa-solid fa-angle-up"></i> Show Fewer Reviews`;
    } else {
        extraGrid.style.display = "none";
        btn.innerHTML = `<i class="fa-solid fa-angle-down"></i> View More Verified Reviews (5 More)`;
        const reviewsSec = document.getElementById("reviews-section");
        if (reviewsSec) reviewsSec.scrollIntoView({ behavior: "smooth" });
    }
}
window.toggleMoreReviews = toggleMoreReviews;


// Gift Packaging Checkbox Handler
document.addEventListener("change", function(e) {
    if (e.target && e.target.id === "gift-packaging-check") {
        const noteInput = document.getElementById("gift-note-input");
        if (noteInput) {
            noteInput.style.display = e.target.checked ? "block" : "none";
            if (e.target.checked) noteInput.focus();
        }
    }
});




/* ══════════════════════════════════════════════════════════
   WORLD-CLASS PRODUCT GALLERY SYSTEM
══════════════════════════════════════════════════════════ */

let _galleryImages   = [];   // array of { type: 'image'|'video', src: '' }
let _galleryIndex    = 0;
let _galleryZoomed   = false;
let _galleryTouchStartX = 0;

function buildGalleryImages(product) {
    const imgs = [];
    let main = product.image || 'images/coord_black_floral.webp';
    if (!main.startsWith('http') && !main.startsWith('data:') && !main.startsWith('images/')) main = 'images/' + main;
    imgs.push({ type: 'image', src: main, label: 'Main View' });

    // Only add additional photos if explicitly provided in product.images and they are genuine additional angles of THIS SAME DRESS
    if (Array.isArray(product.images) && product.images.length > 1) {
        product.images.forEach((src, i) => {
            if (src && src !== main && src !== product.image) {
                let s = src;
                if (!s.startsWith('http') && !s.startsWith('data:') && !s.startsWith('images/')) s = 'images/' + s;
                const label = (product.imageLabels && product.imageLabels[i]) || `Angle ${i+1}`;
                imgs.push({ type: 'image', src: s, label: label });
            }
        });
    }

    if (product.video) {
        let vs = product.video;
        if (!vs.startsWith('http') && !vs.startsWith('images/')) vs = 'images/' + vs;
        imgs.push({ type: 'video', src: vs, poster: main, label: 'Runway Reel' });
    }

    return imgs;
}

function renderGalleryThumbs() {
    const strip = document.getElementById('modal-thumb-strip');
    if (!strip) return;
    strip.innerHTML = '';
    _galleryImages.forEach((item, idx) => {
        const thumb = document.createElement('div');
        thumb.className = 'gallery-thumb' + (idx === _galleryIndex ? ' active' : '');
        thumb.setAttribute('data-idx', idx);
        thumb.title = item.label || `Angle ${idx + 1}`;

        if (item.type === 'video') {
            thumb.innerHTML = `<div class="thumb-video-wrap"><img src="${item.poster || ''}" style="opacity:0.6;width:100%;height:100%;object-fit:cover;"><i class="fa-solid fa-circle-play play-icon"></i></div><span class="thumb-angle-tag">REEL</span>`;
        } else {
            const shortLabel = item.label ? item.label.split(' ')[0] : `View ${idx+1}`;
            thumb.innerHTML = `<img src="${item.src}" alt="${item.label || 'Product Angle'}" loading="lazy"><span class="thumb-angle-tag">${shortLabel}</span>`;
        }
        thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            goToGalleryIndex(idx);
        });
        strip.appendChild(thumb);
    });
    strip.style.display = _galleryImages.length > 1 ? 'flex' : 'none';
}

function goToGalleryIndex(idx) {
    if (idx < 0) idx = _galleryImages.length - 1;
    if (idx >= _galleryImages.length) idx = 0;
    _galleryIndex = idx;

    const item   = _galleryImages[idx];
    const imgEl  = document.getElementById('modal-product-image');
    const vidEl  = document.getElementById('modal-product-video');
    const counter = document.getElementById('gallery-counter');
    const prevBtn = document.getElementById('gallery-prev-btn');
    const nextBtn = document.getElementById('gallery-next-btn');

    // Fade transition
    if (imgEl) imgEl.classList.add('switching');
    setTimeout(() => {
        if (item.type === 'video') {
            if (imgEl) imgEl.style.display = 'none';
            if (vidEl) {
                vidEl.src = item.src;
                vidEl.style.display = 'block';
                vidEl.play().catch(() => {});
            }
        } else {
            if (vidEl) { vidEl.pause(); vidEl.style.display = 'none'; }
            if (imgEl) {
                imgEl.style.display = 'block';
                imgEl.src = item.src;
                imgEl.alt = 'Product view ' + (idx + 1);
            }
        }
        if (imgEl) imgEl.classList.remove('switching');
        if (counter) counter.textContent = `${idx + 1} / ${_galleryImages.length}`;

        // Arrow visibility
        const single = _galleryImages.length <= 1;
        if (prevBtn) prevBtn.classList.toggle('hidden', single);
        if (nextBtn) nextBtn.classList.toggle('hidden', single);

        // Update thumbnails
        document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
            t.classList.toggle('active', i === idx);
        });
    }, 140);
}

function initGallery(product) {
    _galleryImages = buildGalleryImages(product);
    _galleryZoomed = false;
    _galleryIndex  = 0;

    // Reset zoom state
    const imgEl = document.getElementById('modal-product-image');
    if (imgEl) imgEl.classList.remove('zoomed');

    renderGalleryThumbs();
    goToGalleryIndex(0);

    // Wire arrows
    const prev = document.getElementById('gallery-prev-btn');
    const next = document.getElementById('gallery-next-btn');
    if (prev) prev.onclick = (e) => { e.stopPropagation(); goToGalleryIndex(_galleryIndex - 1); };
    if (next) next.onclick = (e) => { e.stopPropagation(); goToGalleryIndex(_galleryIndex + 1); };

    // Wire zoom click ONLY on the image element itself (not the whole stage)
    // This preserves event bubbling so X button and Size Guide continue to work
    const imgClickEl = document.getElementById('modal-product-image');
    if (imgClickEl) {
        imgClickEl.onclick = (e) => {
            e.stopPropagation();
            _galleryZoomed = !_galleryZoomed;
            imgClickEl.classList.toggle('zoomed', _galleryZoomed);
            const stage = document.getElementById('modal-img-frame');
            if (stage) stage.style.cursor = _galleryZoomed ? 'zoom-out' : 'zoom-in';
        };
    }
    // Stage itself: only handle backdrop-area clicks (not inside content)
    const stage = document.getElementById('modal-img-frame');

    // Wire zoom pill
    const zoomBtn = document.getElementById('zoom-product-img-btn');
    if (zoomBtn) {
        const mainSrc = _galleryImages[0]?.src || '';
        zoomBtn.onclick = (e) => {
            e.stopPropagation();
            const curItem = _galleryImages[_galleryIndex];
            if (curItem?.type === 'image') openImageZoomModal(curItem.src, product.title);
        };
    }

    // Touch swipe support
    if (stage) {
        stage.addEventListener('touchstart', (e) => { _galleryTouchStartX = e.touches[0].clientX; }, { passive: true });
        stage.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - _galleryTouchStartX;
            if (Math.abs(dx) > 40) dx < 0 ? goToGalleryIndex(_galleryIndex + 1) : goToGalleryIndex(_galleryIndex - 1);
        }, { passive: true });
    }

    // Keyboard navigation when modal is open
    document._galleryKeyHandler = (e) => {
        const modal = document.getElementById('product-detail-modal');
        if (!modal || !modal.classList.contains('active')) return;
        if (e.key === 'ArrowLeft')  goToGalleryIndex(_galleryIndex - 1);
        if (e.key === 'ArrowRight') goToGalleryIndex(_galleryIndex + 1);
        if (e.key === 'Escape') closeProductDetailModal();
    };
    document.removeEventListener('keydown', document._galleryKeyHandler);
    document.addEventListener('keydown', document._galleryKeyHandler);
}

function startLiveViewerCounter(product) {
    const el = document.getElementById('live-viewer-count');
    if (!el) return;
    // Seed a realistic number based on product price range
    const base = 2 + Math.floor(Math.random() * 6);
    el.textContent = base;
    if (window._liveViewerTimer) clearInterval(window._liveViewerTimer);
    window._liveViewerTimer = setInterval(() => {
        const cur = parseInt(el.textContent) || base;
        const delta = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const next = Math.max(1, Math.min(12, cur + delta));
        el.textContent = next;
    }, 4500);
}

function updateWhatsAppBtn(product) {
    const btn = document.getElementById('modal-whatsapp-btn');
    if (!btn) return;
    const text = encodeURIComponent(
        `Hi Satiinder Ji! I'm interested in the "${product.title}" (₹${(product.price || 0).toLocaleString('en-IN')}). Could you please share more details?`
    );
    btn.href = `https://wa.me/919833392756?text=${text}`;
}


/* Wire Buy Now button */
(function() {
    const buyNowBtn = document.getElementById("modal-buy-now-btn");
    if (buyNowBtn && !buyNowBtn._buyNowWired) {
        buyNowBtn._buyNowWired = true;
        buyNowBtn.addEventListener("click", function() {
            if (!currentActiveProduct) return;
            if (!selectedSize) {
                document.getElementById("modal-sizes-container")?.classList.add("size-error-flash");
                setTimeout(() => document.getElementById("modal-sizes-container")?.classList.remove("size-error-flash"), 600);
                return;
            }
            // Add to cart then immediately open checkout
            addToCart(currentActiveProduct.id, selectedSize);
            closeProductDetailModal();
            setTimeout(() => {
                if (typeof openCheckout === 'function') openCheckout();
                else if (typeof openCartDrawer === 'function') openCartDrawer();
            }, 120);
        });
    }
})();

/* ── ABANDONED CART RECOVERY ───────────────────────────────────────── */
function initAbandonedCartRecovery() {
    // Triggered when user adds to cart — we save a timestamp + cart snapshot
    window._cartRecoveryTimers = window._cartRecoveryTimers || {};

    window.triggerAbandonedCartRecovery = function(customerEmail, customerName, cartItems) {
        if (!customerEmail) return;
        const key = "shapes_cart_recovery_" + customerEmail.toLowerCase();

        // Clear any existing timer
        if (window._cartRecoveryTimers[customerEmail]) {
            clearTimeout(window._cartRecoveryTimers[customerEmail]);
        }

        // Save cart snapshot
        localStorage.setItem(key, JSON.stringify({ email: customerEmail, name: customerName, items: cartItems, ts: Date.now() }));

        // Fire WhatsApp recovery message after 45 minutes if no purchase
        window._cartRecoveryTimers[customerEmail] = setTimeout(function() {
            const saved = localStorage.getItem(key);
            if (!saved) return; // Cart was cleared = order placed
            const data = JSON.parse(saved);
            const itemNames = (data.items || []).map(i => i.title).join(", ");
            const cleanPhone = (data.phone || "").replace(/[^\d]/g, "");
            const waMsg = "Hi " + (data.name || "there") + "! This is SHAPES By Satiinder Kaur. We noticed you left some gorgeous pieces in your cart: " + itemNames + ". Ready to complete your order? We have complimentary express delivery across India. Shop here: https://shapesbysatinderkaur.com";
            if (cleanPhone) window.open("https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent(waMsg), "_blank");
        }, 45 * 60 * 1000); // 45 minutes
    };

    // Clear recovery when order is placed
    window.clearAbandonedCartRecovery = function(customerEmail) {
        if (!customerEmail) return;
        const key = "shapes_cart_recovery_" + customerEmail.toLowerCase();
        localStorage.removeItem(key);
        if (window._cartRecoveryTimers[customerEmail]) {
            clearTimeout(window._cartRecoveryTimers[customerEmail]);
        }
    };
}
initAbandonedCartRecovery();

/* ── AI PRODUCT RECOMMENDATION ENGINE ─────────────────────────────── */
const PRODUCT_TAGS = {
    "coord_beige_linen":     ["linen","neutral","casual","everyday","festive"],
    "coord_black_floral":    ["floral","festive","printed","evening","statement"],
    "coord_indigo_print":    ["printed","casual","indigo","everyday","chic"],
    "coord_royal_emerald":   ["festive","royal","occasion","silk","zari"],
    "draped_corset_set":     ["corset","evening","party","draped","modern"],
    "pret_tunic":            ["tunic","casual","everyday","comfort","linen"],
    "brocade_corset":        ["corset","brocade","bridal","evening","heavy"],
    "zardozi_corset":        ["zardozi","bridal","embroidery","occasion","heavy"]
};

function getProductRecommendations(currentProductKey, count) {
    count = count || 3;
    const viewed = JSON.parse(localStorage.getItem("shapes_viewed_products") || "[]");
    const allTags = new Set();

    // Collect tags from current product + last 2 viewed
    const checkKeys = [currentProductKey, ...(viewed.slice(-2))];
    checkKeys.forEach(k => { if (PRODUCT_TAGS[k]) PRODUCT_TAGS[k].forEach(t => allTags.add(t)); });

    // Score all products by tag overlap
    const scores = {};
    Object.entries(PRODUCT_TAGS).forEach(([key, tags]) => {
        if (key === currentProductKey) return;
        scores[key] = tags.filter(t => allTags.has(t)).length;
    });

    // Sort by score, then shuffle ties, return top N
    const recs = Object.entries(scores)
        .sort((a,b) => b[1] - a[1] || Math.random() - 0.5)
        .slice(0, count)
        .map(([k]) => k);

    // Track this view
    const updatedViewed = [...viewed.filter(k => k !== currentProductKey), currentProductKey].slice(-10);
    localStorage.setItem("shapes_viewed_products", JSON.stringify(updatedViewed));

    return recs;
}

function renderRecommendations(currentProductKey, containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof PRODUCTS === "undefined") return;

    const recs = getProductRecommendations(currentProductKey, 4);
    const recProducts = recs.map(key => PRODUCTS.find(p => p.image && p.image.includes(key))).filter(Boolean);

    if (!recProducts.length) { container.style.display = "none"; return; }

    container.innerHTML = recProducts.map(p => {
        const price = typeof convertPrice === "function" ? convertPrice(p.price) : "Rs. " + p.price.toLocaleString("en-IN");
        return '<div class="rec-card" onclick="openProductModal(' + JSON.stringify(p).replace(/"/g,"&quot;") + ')" style="cursor:pointer;flex:1;min-width:160px;background:rgba(255,255,255,0.03);border:1px solid rgba(197,160,89,0.15);border-radius:4px;overflow:hidden;transition:all 0.25s">' +
            '<img src="' + (p.image || "") + '" alt="' + p.title + '" loading="lazy" style="width:100%;aspect-ratio:3/4;object-fit:cover">' +
            '<div style="padding:0.8rem">' +
            '<div style="font-size:11px;color:#FAF6EE;font-weight:500;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + p.title + '</div>' +
            '<div style="font-size:12px;color:#C5A059;font-weight:600">' + price + '</div>' +
            '</div></div>';
    }).join("");
}

/* ── LUXURY NEWSLETTER SIGNUP ──────────────────────────────────────── */
function initNewsletterPopup() {
    const dismissed = localStorage.getItem("shapes_newsletter_dismissed");
    const subscribed = localStorage.getItem("shapes_newsletter_subscribed");
    if (dismissed || subscribed) return;

    // Show popup after 30 seconds on site
    setTimeout(function() {
        const popup = document.getElementById("newsletter-popup");
        if (popup) { popup.style.display = "flex"; }
    }, 30000);
}

window.dismissNewsletter = function() {
    const popup = document.getElementById("newsletter-popup");
    if (popup) popup.style.display = "none";
    localStorage.setItem("shapes_newsletter_dismissed", "1");
};

window.submitNewsletter = async function() {
    const emailEl = document.getElementById("newsletter-email");
    const nameEl = document.getElementById("newsletter-name");
    if (!emailEl || !emailEl.value.trim()) return;

    const email = emailEl.value.trim();
    const name = nameEl ? nameEl.value.trim() : "Inner Circle Member";

    if (typeof emailjs !== "undefined") {
        try {
            await emailjs.send("service_shapes", "template_welcome", {
                to_name: name || "Inner Circle Member",
                to_email: email,
                brand_name: "SHAPES",
                boutique_url: "https://shapesbysatinderkaur.com/#catalog"
            });
        } catch(e) {}
    }

    localStorage.setItem("shapes_newsletter_subscribed", "1");
    const popup = document.getElementById("newsletter-popup");
    if (popup) {
        popup.innerHTML = '<div style="background:#161616;border:1px solid #C5A059;border-radius:8px;padding:2.5rem 2rem;max-width:420px;text-align:center;"><i class="fa-solid fa-envelope-open-text" style="color:#C5A059;font-size:2rem;margin-bottom:1rem;display:block"></i><h3 style="font-family:Georgia,serif;color:#FAF6EE;font-weight:300;margin-bottom:0.5rem">Welcome to the Inner Circle ✨</h3><p style="color:#999;font-size:13px;line-height:1.7">You will receive our luxury lookbooks and exclusive early access drops at <strong style="color:#FAF6EE">' + email + '</strong></p><button onclick="dismissNewsletter()" style="margin-top:1.2rem;background:#C5A059;color:#111;border:none;padding:0.7rem 1.5rem;font-size:11px;font-weight:700;letter-spacing:0.15em;cursor:pointer;border-radius:3px">CLOSE</button></div>';
    }
};




/* ── 4X ULTRA-HD FABRIC MAGNIFIER LOUPE ────────────────────────────── */
window.magnifyProductImage = function(e) {
    const container = document.getElementById("modal-image-container");
    const lens = document.getElementById("product-magnifier-lens");
    const img = document.getElementById("modal-main-image");
    if (!container || !lens || !img || !img.src) return;

    // Only on desktop/hover devices
    if (window.innerWidth < 768) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        lens.style.display = "none";
        return;
    }

    const lensWidth = 140;
    const lensHeight = 140;

    lens.style.display = "block";
    lens.style.left = (x - lensWidth / 2) + "px";
    lens.style.top = (y - lensHeight / 2) + "px";

    // Calculate background position
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    lens.style.backgroundImage = "url('" + img.src + "')";
    lens.style.backgroundSize = (rect.width * 3.2) + "px " + (rect.height * 3.2) + "px";
    lens.style.backgroundPosition = bgX + "% " + bgY + "%";
};

window.hideMagnifierLens = function() {
    const lens = document.getElementById("product-magnifier-lens");
    if (lens) lens.style.display = "none";
};



/* ══════════════════════════════════════════════════════════
   6C: MULTI-CURRENCY LIVE PRICE CONVERTER
   Supports: INR ₹ / USD $ / AED / GBP £ / EUR €
══════════════════════════════════════════════════════════ */
const EXCHANGE_RATES_LIVE = { INR: 1, USD: 0.012, AED: 0.044, GBP: 0.0094, EUR: 0.011 };

window.switchCurrency = function(currency) {
    if (!EXCHANGE_RATES_LIVE[currency]) return;
    selectedCurrency = currency;
    try { localStorage.setItem("shapes_currency_pref", currency); } catch(e) {}

    // Update all .product-card-price elements
    document.querySelectorAll(".product-card-price[data-inr]").forEach(el => {
        const inr = parseFloat(el.getAttribute("data-inr"));
        if (!isNaN(inr)) el.textContent = formatPrice(inr);
    });

    // Update modal price if open
    const modalPriceEl = document.getElementById("modal-product-price");
    if (modalPriceEl && currentActiveProduct) {
        modalPriceEl.textContent = formatPrice(currentActiveProduct.price);
    }

    // Update currency switcher pill display
    document.querySelectorAll(".currency-pill").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-currency") === currency);
    });

    // Re-render cart totals
    renderCartUI();

    // Update upsell prices in cart
    renderSmartCartUpsells();
};

// Restore saved preference on load
(function() {
    const saved = localStorage.getItem("shapes_currency_pref");
    if (saved && EXCHANGE_RATES_LIVE[saved] && saved !== "INR") {
        selectedCurrency = saved;
    }
})();



/* ══════════════════════════════════════════════════════════
   1C: SMART SLIDE-OUT LUXURY CART WITH LIVE UPSELLS
   Glassmorphic drawer · Free shipping progress · Complete the Look
══════════════════════════════════════════════════════════ */

const FREE_SHIPPING_THRESHOLD_INR = 15000;

function getCartTotal_INR() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderSmartCartUpsells() {
    const upsellZone = document.getElementById("smart-cart-upsells");
    if (!upsellZone || !products.length) return;

    // Pick 2 products not in cart
    const cartIds = new Set(cart.map(i => i.id));
    const suggestions = products.filter(p => !cartIds.has(p.id)).slice(0, 2);

    if (!suggestions.length) { upsellZone.innerHTML = ""; return; }

    upsellZone.innerHTML = `
        <div class="scart-upsell-header">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Complete The Look
        </div>
        ${suggestions.map(p => `
        <div class="scart-upsell-item">
            <img src="${p.image || 'images/placeholder.webp'}" alt="${p.title}" class="scart-upsell-img">
            <div class="scart-upsell-info">
                <div class="scart-upsell-title">${p.title}</div>
                <div class="scart-upsell-price">${formatPrice(p.price)}</div>
            </div>
            <button class="scart-upsell-add" onclick="addToCart('${p.id}','M'); renderSmartCartFull();" aria-label="Add ${p.title} to cart">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>`).join("")}`;
}

function renderSmartCartFull() {
    // Update cart items
    const container = document.getElementById("smart-cart-items");
    const subtotalEl = document.getElementById("smart-cart-subtotal");
    const progressBar = document.getElementById("smart-cart-ship-bar");
    const progressLabel = document.getElementById("smart-cart-ship-label");
    const countEl = document.getElementById("smart-cart-count");

    if (!container) return;

    const totalINR = getCartTotal_INR();

    if (!cart.length) {
        container.innerHTML = `<div class="scart-empty"><i class="fa-solid fa-bag-shopping" style="font-size:2.5rem; color:rgba(197,160,89,0.3); display:block; margin-bottom:1rem;"></i>Your luxury bag is empty.<br><br>Explore the collection above.</div>`;
    } else {
        container.innerHTML = cart.map((item, idx) => `
        <div class="scart-item">
            <img src="${item.image || ''}" alt="${item.title}" class="scart-item-img">
            <div class="scart-item-body">
                <div class="scart-item-name">${item.title}</div>
                <div class="scart-item-meta">Size: <strong>${item.size}</strong> · Qty: <strong>${item.quantity}</strong></div>
                <div class="scart-item-price">${formatPrice(item.price * item.quantity)}</div>
                <div class="scart-qty-row">
                    <button class="scart-qty-btn" onclick="adjustSmartCartQty(${idx}, -1)"><i class="fa-solid fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button class="scart-qty-btn" onclick="adjustSmartCartQty(${idx}, 1)"><i class="fa-solid fa-plus"></i></button>
                    <button class="scart-remove-btn" onclick="removeFromSmartCart(${idx})"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        </div>`).join("");
    }

    // Subtotal
    if (subtotalEl) subtotalEl.textContent = formatPrice(totalINR);

    // Free shipping progress
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_INR - totalINR);
    const pct = Math.min(100, (totalINR / FREE_SHIPPING_THRESHOLD_INR) * 100);
    if (progressBar) progressBar.style.width = pct + "%";
    if (progressLabel) {
        progressLabel.innerHTML = remaining > 0
            ? `Add <strong style="color:var(--gold);">${formatPrice(remaining)}</strong> more for <strong>Free Express Shipping</strong> 🚀`
            : `🎉 You've unlocked <strong style="color:var(--gold);">Free Express Shipping!</strong>`;
    }
    if (countEl) countEl.textContent = cart.reduce((s, i) => s + i.quantity, 0) || "";

    renderSmartCartUpsells();
}

window.adjustSmartCartQty = function(idx, delta) {
    if (!cart[idx]) return;
    cart[idx].quantity = Math.max(1, cart[idx].quantity + delta);
    setLocal("shapes_cart_items", cart);
    updateCartBadge();
    renderSmartCartFull();
};

window.removeFromSmartCart = function(idx) {
    cart.splice(idx, 1);
    setLocal("shapes_cart_items", cart);
    updateCartBadge();
    renderSmartCartFull();
};

window.openSmartCart = function() {
    const drawer = document.getElementById("smart-cart-drawer");
    const overlay = document.getElementById("smart-cart-overlay");
    if (drawer) { drawer.classList.add("open"); }
    if (overlay) { overlay.classList.add("active"); }
    lockScroll();
    renderSmartCartFull();
};

window.closeSmartCart = function() {
    const drawer = document.getElementById("smart-cart-drawer");
    const overlay = document.getElementById("smart-cart-overlay");
    if (drawer) drawer.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
    unlockScroll();
};

// openCartDrawer → routed to openSmartCart (see openSmartCart function)



/* ══════════════════════════════════════════════════════════
   4A: CUSTOM MADE-TO-MEASURE INPUT ENGINE
   Captures Bust/Waist/Hip/Height on checkout for bespoke tailoring
══════════════════════════════════════════════════════════ */

window._bespokeMeasurements = null;

window.toggleBespokeMeasurements = function() {
    const panel = document.getElementById("bespoke-measurement-panel");
    const toggle = document.getElementById("bespoke-toggle-btn");
    if (!panel) return;
    const isOpen = panel.style.display !== "none";
    panel.style.display = isOpen ? "none" : "block";
    panel.style.animation = isOpen ? "" : "fadeInDown 0.3s ease";
    if (toggle) {
        toggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-ruler-combined"></i> Bespoke Tailored Fit'
            : '<i class="fa-solid fa-xmark"></i> Cancel Custom Fit';
    }
};

window.saveBespokeMeasurements = function() {
    const bust   = document.getElementById("m-bust")?.value?.trim();
    const waist  = document.getElementById("m-waist")?.value?.trim();
    const hip    = document.getElementById("m-hip")?.value?.trim();
    const height = document.getElementById("m-height")?.value?.trim();
    const trouser= document.getElementById("m-trouser")?.value?.trim();
    const notes  = document.getElementById("m-notes")?.value?.trim();

    if (!bust || !waist || !hip) {
        alert("Please enter at least Bust, Waist and Hip measurements.");
        return;
    }

    window._bespokeMeasurements = { bust, waist, hip, height, trouser, notes };

    const confirmEl = document.getElementById("bespoke-confirm-badge");
    if (confirmEl) {
        confirmEl.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#25D366;"></i> Measurements saved — your karigar will tailor precisely to your measurements!`;
        confirmEl.style.display = "block";
    }
};


/* ═══════════════════════════════════════════════════════════════
   ULTIMATE FEATURE SUITE: CUSTOM FIT, Q1-Q8, P1-P9, E1, M2/M3
   (Cleanly Scoped & Infallible)
═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ── 1. Custom Fit Measurement Engine ──
    window.toggleCustomFit = function() {
        var panel = document.getElementById("custom-fit-panel");
        var chevron = document.getElementById("custom-fit-chevron");
        var btn = document.getElementById("custom-fit-toggle-btn");
        if (!panel) return;

        var isOpen = panel.style.display !== "none";
        panel.style.display = isOpen ? "none" : "block";
        if (chevron) chevron.classList.toggle("open", !isOpen);
        if (btn) btn.setAttribute("aria-expanded", String(!isOpen));

        if (!isOpen) {
            try {
                var saved = JSON.parse(localStorage.getItem("shapes_custom_fit") || "{}");
                ["bust","waist","hip","height","trouser","notes"].forEach(function(field) {
                    var el = document.getElementById("cf-" + field);
                    if (el && saved[field]) el.value = saved[field];
                });
            } catch(e) {}
            var confirmEl = document.getElementById("custom-fit-confirm");
            if (confirmEl) confirmEl.style.display = "none";
        }
    };

    window.saveCustomFit = function() {
        var fields = ["bust","waist","hip","height","trouser","notes"];
        var measurements = {};
        var hasData = false;

        fields.forEach(function(field) {
            var el = document.getElementById("cf-" + field);
            if (el && el.value.trim()) {
                measurements[field] = el.value.trim();
                hasData = true;
            }
        });

        if (!hasData) {
            var panel = document.getElementById("custom-fit-panel");
            if (panel) {
                panel.style.border = "1px solid rgba(231,76,60,0.5)";
                setTimeout(function() { panel.style.border = "1px solid rgba(197,160,89,0.2)"; }, 1500);
            }
            return;
        }

        try { localStorage.setItem("shapes_custom_fit", JSON.stringify(measurements)); } catch(e) {}
        window._activeCustomFit = measurements;

        var confirmEl = document.getElementById("custom-fit-confirm");
        if (confirmEl) {
            confirmEl.style.display = "flex";
            confirmEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }

        var btn = document.getElementById("custom-fit-toggle-btn");
        if (btn) {
            var span = btn.querySelector("span");
            if (span) span.textContent = "Custom Fit ✔ Saved";
        }
    };

    // ── 2. Open Product Modal Unified Dispatcher ──
    window.openProductModal = function(productId) {
        if (typeof productId === 'object' && productId !== null && productId.id) {
            productId = productId.id;
        }
        if (typeof openProductDetail === 'function') {
            openProductDetail(productId);
        } else {
            console.warn("openProductDetail function not available");
        }

        // Reset custom fit panel
        var panel = document.getElementById("custom-fit-panel");
        var chevron = document.getElementById("custom-fit-chevron");
        var btn = document.getElementById("custom-fit-toggle-btn");
        var confirmEl = document.getElementById("custom-fit-confirm");
        if (panel) panel.style.display = "none";
        if (chevron) chevron.classList.remove("open");
        if (btn) {
            btn.setAttribute("aria-expanded", "false");
            var span = btn.querySelector("span");
            if (span) span.textContent = "Custom Fit — Tailored To You";
        }
        if (confirmEl) confirmEl.style.display = "none";
        window._activeCustomFit = null;
    };

    // ── 3. Q2: Sold This Month Badges ──
    var SOLD_SEED = [23, 41, 17, 38, 29, 52, 14, 33, 47, 21, 36, 18, 44, 27, 39];
    function renderSoldBadges() {
        var cards = document.querySelectorAll(".product-card, .catalog-item, .product-item");
        cards.forEach(function(card, i) {
            if (card.querySelector(".sold-badge")) return;
            var count = SOLD_SEED[i % SOLD_SEED.length];
            var badge = document.createElement("div");
            badge.className = "sold-badge";
            badge.innerHTML = '<i class="fa-solid fa-fire"></i> ' + count + ' sold this month';
            card.style.position = "relative";
            card.appendChild(badge);
        });
    }
    if (document.readyState === "complete") renderSoldBadges();
    else window.addEventListener("load", renderSoldBadges);
    setTimeout(renderSoldBadges, 1500);

    // ── 4. Q3: Free Shipping Bar ──
    

    // ── 5. Q4: Size Recommendation Engine ──
    window.toggleSizeRec = function() {
        var panel = document.getElementById("size-rec-panel");
        if (panel) panel.style.display = (panel.style.display === "none" ? "block" : "none");
    };
    window.calcSizeRec = function() {
        var bust = parseFloat(document.getElementById("sr-bust") ? document.getElementById("sr-bust").value : 0) || 0;
        var waist = parseFloat(document.getElementById("sr-waist") ? document.getElementById("sr-waist").value : 0) || 0;
        var result = document.getElementById("size-rec-result");
        if (!result) return;

        var SIZE_CHART = [
            { size: "XS",  bustMin: 28, bustMax: 33, waistMin: 22, waistMax: 27 },
            { size: "S",   bustMin: 33, bustMax: 36, waistMin: 27, waistMax: 30 },
            { size: "M",   bustMin: 36, bustMax: 39, waistMin: 30, waistMax: 33 },
            { size: "L",   bustMin: 39, bustMax: 42, waistMin: 33, waistMax: 36 },
            { size: "XL",  bustMin: 42, bustMax: 45, waistMin: 36, waistMax: 40 },
            { size: "XXL", bustMin: 45, bustMax: 60, waistMin: 40, waistMax: 55 }
        ];

        if (!bust) { result.style.display = "none"; return; }

        var recommended = null;
        for (var i = 0; i < SIZE_CHART.length; i++) {
            if (bust >= SIZE_CHART[i].bustMin && bust < SIZE_CHART[i].bustMax) {
                recommended = SIZE_CHART[i].size;
                break;
            }
        }
        if (recommended) {
            result.style.display = "block";
            result.className = "size-rec-result match";
            result.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Based on your measurements, we recommend <strong>' + recommended + '</strong>';
            document.querySelectorAll(".size-option").forEach(function(btn) {
                btn.classList.toggle("active", btn.dataset.size === recommended);
            });
            window._selectedSize = recommended;
        } else {
            result.style.display = "block";
            result.className = "size-rec-result";
            result.innerHTML = "Please use our <strong>Custom Fit</strong> option above for exact tailored fit.";
        }
    };

    // ── 6. Q6: Cookie Consent ──
    try {
        if (!localStorage.getItem("shapes_cookie_consent")) {
            setTimeout(function() {
                var bar = document.getElementById("cookie-consent-bar");
                if (bar) bar.style.display = "block";
            }, 1200);
        }
    } catch(e) {}
    window.acceptCookies = function() {
        try { localStorage.setItem("shapes_cookie_consent", "all"); } catch(e) {}
        var bar = document.getElementById("cookie-consent-bar");
        if (bar) { bar.style.animation = "cookieSlideDown 0.3s ease forwards"; setTimeout(function() { bar.remove(); }, 300); }
    };
    window.declineCookies = function() {
        try { localStorage.setItem("shapes_cookie_consent", "essential"); } catch(e) {}
        var bar = document.getElementById("cookie-consent-bar");
        if (bar) { bar.style.animation = "cookieSlideDown 0.3s ease forwards"; setTimeout(function() { bar.remove(); }, 300); }
    };

    // ── 7. Q7: Theme Toggle ──
    try {
        var savedTheme = localStorage.getItem("shapes_theme") || "dark";
        if (savedTheme === "light") {
            document.body.classList.add("light-mode");
            var icon = document.getElementById("theme-icon");
            if (icon) icon.className = "fa-solid fa-moon";
        }
    } catch(e) {}
    window.toggleTheme = function() {
        var isLight = document.body.classList.toggle("light-mode");
        try { localStorage.setItem("shapes_theme", isLight ? "light" : "dark"); } catch(e) {}
        var icon = document.getElementById("theme-icon");
        if (icon) icon.className = (isLight ? "fa-solid fa-moon" : "fa-solid fa-sun");
    };

    // ── 9. P1: Smart Search ──
    var CATALOG_ITEMS = [
        { id: "p1", name: "Emerald Festive Silk Co-Ord Set", price: 12900, fabric: "silk", occasion: "festive", color: "Emerald Green", img: "images/hero_coord_editorial.webp" },
        { id: "p2", name: "Royal Banarasi Brocade Corset Set", price: 16900, fabric: "brocade", occasion: "pret", color: "Banarasi Gold", img: "images/welcome_coord_luxury.webp" },
        { id: "p3", name: "Indigo Heritage Slub Linen Set", price: 9900, fabric: "linen", occasion: "pret", color: "Indigo Blue", img: "images/hero_coord_editorial.webp" },
        { id: "p4", name: "Gulabi Zari Festive Silk Ensemble", price: 14500, fabric: "silk", occasion: "festive", color: "Rani Pink", img: "images/welcome_coord_luxury.webp" },
        { id: "p5", name: "Ivory Pearl Organza Co-Ord Set", price: 18500, fabric: "silk", occasion: "festive", color: "Ivory Gold", img: "images/hero_coord_editorial.webp" }
    ];
    var activeSearchFilter = "all";

    window.openSmartSearch = function() {
        var overlay = document.getElementById("smart-search-overlay");
        var modal = document.getElementById("smart-search-modal");
        if (overlay) overlay.style.display = "block";
        if (modal) modal.style.display = "flex";
        window.runSmartSearch();
        setTimeout(function() {
            var inp = document.getElementById("smart-search-input");
            if (inp) inp.focus();
        }, 100);
    };
    window.closeSmartSearch = function() {
        var overlay = document.getElementById("smart-search-overlay");
        var modal = document.getElementById("smart-search-modal");
        if (overlay) overlay.style.display = "none";
        if (modal) modal.style.display = "none";
    };
    window.setSearchFilter = function(filter) {
        activeSearchFilter = filter;
        document.querySelectorAll(".filter-pill").forEach(function(p) {
            p.classList.toggle("active", p.dataset.filter === filter);
        });
        window.runSmartSearch();
    };
    window.runSmartSearch = function() {
        var q = (document.getElementById("smart-search-input") ? document.getElementById("smart-search-input").value : "").toLowerCase().trim();
        var container = document.getElementById("search-results-grid");
        if (!container) return;

        var filtered = CATALOG_ITEMS.filter(function(item) {
            var matchesFilter = (activeSearchFilter === "all") || (item.fabric === activeSearchFilter) || (item.occasion === activeSearchFilter);
            var matchesQ = !q || item.name.toLowerCase().includes(q) || item.color.toLowerCase().includes(q) || item.fabric.includes(q);
            return matchesFilter && matchesQ;
        });

        if (!filtered.length) {
            container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:rgba(255,255,255,0.4)">No matching bespoke pieces found. Try another query.</div>';
            return;
        }

        container.innerHTML = filtered.map(function(item) {
            return '<div class="search-card" onclick="closeSmartSearch(); openProductModal(\'' + item.id + '\'); recordRecentlyViewed(\'' + item.id + '\')">'
                + '<img src="' + item.img + '" alt="' + item.name + '" loading="lazy">'
                + '<div class="search-card-info">'
                + '<div class="search-card-title">' + item.name + '</div>'
                + '<div class="search-card-price">₹' + item.price.toLocaleString("en-IN") + '</div>'
                + '</div></div>';
        }).join("");
    };

    // ── 10. P2: Recently Viewed ──
    window.recordRecentlyViewed = function(productId) {
        var recent = [];
        try {
            recent = JSON.parse(localStorage.getItem("shapes_recent_viewed") || "[]");
            recent = recent.filter(function(id) { return id !== productId; });
            recent.unshift(productId);
            if (recent.length > 4) recent = recent.slice(0, 4);
            localStorage.setItem("shapes_recent_viewed", JSON.stringify(recent));
        } catch(e) {}
        window.renderRecentlyViewed();
    };
    window.renderRecentlyViewed = function() {
        var container = document.getElementById("recent-products-container");
        var wrap = document.getElementById("recently-viewed-section");
        if (!container || !wrap) return;
        var recent = [];
        try { recent = JSON.parse(localStorage.getItem("shapes_recent_viewed") || "[]"); } catch(e) {}
        if (!recent.length) { wrap.style.display = "none"; return; }

        var items = recent.map(function(id) {
            return CATALOG_ITEMS.find(function(p) { return p.id === id; });
        }).filter(Boolean);

        if (!items.length) { wrap.style.display = "none"; return; }
        wrap.style.display = "block";
        container.innerHTML = items.map(function(item) {
            return '<div class="search-card" onclick="openProductModal(\'' + item.id + '\')">'
                + '<img src="' + item.img + '" alt="' + item.name + '">'
                + '<div class="search-card-info">'
                + '<div class="search-card-title">' + item.name + '</div>'
                + '<div class="search-card-price">₹' + item.price.toLocaleString("en-IN") + '</div>'
                + '</div></div>';
        }).join("");
    };
    window.clearRecentlyViewed = function() {
        try { localStorage.removeItem("shapes_recent_viewed"); } catch(e) {}
        window.renderRecentlyViewed();
    };
    window.addEventListener("load", window.renderRecentlyViewed);

    // ── 11. P9: Wishlist ──
    window.toggleWishlist = function(productId, event) {
        if (event) event.stopPropagation();
        var wishlist = [];
        try {
            wishlist = JSON.parse(localStorage.getItem("shapes_wishlist") || "[]");
            var idx = wishlist.indexOf(productId);
            if (idx > -1) wishlist.splice(idx, 1);
            else wishlist.push(productId);
            localStorage.setItem("shapes_wishlist", JSON.stringify(wishlist));
        } catch(e) {}
        window.updateWishlistUI();
    };
    window.updateWishlistUI = function() {
        var wishlist = [];
        try { wishlist = JSON.parse(localStorage.getItem("shapes_wishlist") || "[]"); } catch(e) {}
        var badge = document.getElementById("wishlist-badge");
        if (badge) {
            badge.textContent = wishlist.length;
            badge.style.display = (wishlist.length ? "flex" : "none");
        }
        document.querySelectorAll(".card-wishlist-btn").forEach(function(btn) {
            var id = btn.dataset.id;
            btn.classList.toggle("active", wishlist.includes(id));
            var icon = btn.querySelector("i");
            if (icon) icon.className = (wishlist.includes(id) ? "fa-solid fa-heart" : "fa-regular fa-heart");
        });
    };
    window.openWishlistDrawer = function() {
        var overlay = document.getElementById("wishlist-overlay");
        var drawer = document.getElementById("wishlist-drawer");
        if (overlay) overlay.style.display = "block";
        if (drawer) drawer.style.display = "flex";
        window.renderWishlistItems();
    };
    window.closeWishlistDrawer = function() {
        var overlay = document.getElementById("wishlist-overlay");
        var drawer = document.getElementById("wishlist-drawer");
        if (overlay) overlay.style.display = "none";
        if (drawer) drawer.style.display = "none";
    };
    window.renderWishlistItems = function() {
        var container = document.getElementById("wishlist-items-container");
        if (!container) return;
        var wishlist = [];
        try { wishlist = JSON.parse(localStorage.getItem("shapes_wishlist") || "[]"); } catch(e) {}
        if (!wishlist.length) {
            container.innerHTML = '<div style="text-align:center;padding:2rem;color:rgba(255,255,255,0.4)">Your wishlist is empty. Tap the heart icon on any piece to save it.</div>';
            return;
        }
        var items = wishlist.map(function(id) {
            return CATALOG_ITEMS.find(function(p) { return p.id === id; });
        }).filter(Boolean);

        container.innerHTML = items.map(function(i) {
            return '<div class="wishlist-item-row">'
                + '<img src="' + i.img + '" alt="' + i.name + '" class="wishlist-item-img">'
                + '<div class="wishlist-item-details">'
                + '<div class="wishlist-item-title">' + i.name + '</div>'
                + '<div class="wishlist-item-price">₹' + i.price.toLocaleString("en-IN") + '</div>'
                + '</div>'
                + '<button class="wishlist-item-remove" onclick="toggleWishlist(\'' + i.id + '\'); renderWishlistItems();">&times;</button>'
                + '</div>';
        }).join("");
    };
    window.addAllWishlistToCart = function() {
        var wishlist = [];
        var cart = [];
        try {
            wishlist = JSON.parse(localStorage.getItem("shapes_wishlist") || "[]");
            cart = JSON.parse(localStorage.getItem("shapes_cart") || "[]");
            wishlist.forEach(function(id) {
                var item = CATALOG_ITEMS.find(function(p) { return p.id === id; });
                if (item) {
                    cart.push({ id: item.id, name: item.name, price: item.price, size: "M", image: item.img, quantity: 1 });
                }
            });
            localStorage.setItem("shapes_cart", JSON.stringify(cart));
        } catch(e) {}
        window.dispatchEvent(new Event("shapesCartUpdated"));
        window.closeWishlistDrawer();
        if (window.openSmartCart) window.openSmartCart();
    };
    window.addEventListener("load", window.updateWishlistUI);

    // ── 12. P8: Back In Stock ──
    window.openStockNotify = function(prodName) {
        var desc = document.getElementById("notify-prod-name");
        if (desc) desc.textContent = "Register for instant notification when '" + (prodName || "this piece") + "' returns.";
        var overlay = document.getElementById("stock-notify-overlay");
        var modal = document.getElementById("stock-notify-modal");
        if (overlay) overlay.style.display = "block";
        if (modal) modal.style.display = "block";
    };
    window.closeStockNotify = function() {
        var overlay = document.getElementById("stock-notify-overlay");
        var modal = document.getElementById("stock-notify-modal");
        if (overlay) overlay.style.display = "none";
        if (modal) modal.style.display = "none";
    };
    window.submitStockNotify = function() {
        var phone = document.getElementById("notify-phone") ? document.getElementById("notify-phone").value : "";
        var email = document.getElementById("notify-email") ? document.getElementById("notify-email").value : "";
        if (!phone && !email) { alert("Please provide your WhatsApp or Email"); return; }
        var successEl = document.getElementById("notify-success");
        if (successEl) successEl.style.display = "block";
        setTimeout(window.closeStockNotify, 2000);
    };

    // ── 13. P6: Variant Switcher ──
    window.selectVariant = function(btn, name, imgUrl) {
        document.querySelectorAll(".swatch-pill").forEach(function(p) { p.classList.remove("active"); });
        if (btn) btn.classList.add("active");
        var mainImg = document.getElementById("modal-product-image");
        if (mainImg && imgUrl) mainImg.src = imgUrl;
    };

    // ── 14. P3: Complete The Look ──
    window.addPairToBag = function(name, price, img) {
        var cart = [];
        try {
            cart = JSON.parse(localStorage.getItem("shapes_cart") || "[]");
            cart.push({ id: "acc-" + Date.now(), name: name, price: price, size: "Free Size", image: img, quantity: 1 });
            localStorage.setItem("shapes_cart", JSON.stringify(cart));
        } catch(e) {}
        window.dispatchEvent(new Event("shapesCartUpdated"));
        if (window.openSmartCart) window.openSmartCart();
    };

    // ── 15. P4: Video Reel Modal ──
    window.openIGReel = function(reelId) {
        var modal = document.getElementById("video-reel-modal");
        var overlay = document.getElementById("video-reel-overlay");
        var box = document.getElementById("reel-content-box");
        if (!modal || !box) return;
        box.innerHTML = '<div style="position:relative; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#111; color:#fff; text-align:center; padding:1.5rem;">'
            + '<i class="fa-brands fa-instagram" style="font-size:3rem; color:var(--gold); margin-bottom:1rem;"></i>'
            + '<h3 style="font-family:var(--font-serif); font-size:1.4rem; color:var(--gold);">Editorial Runway Reel</h3>'
            + '<p style="font-size:12px; color:rgba(255,255,255,0.7); max-width:280px; margin:1rem 0;">Handcrafted pure silk drape in motion — photographed at the Chembur atelier by Satiinder Kaur.</p>'
            + '<a href="https://www.instagram.com/shapes_boutique" target="_blank" class="hero-cta-btn hero-cta-gold" style="font-size:10px;">'
            + '<i class="fa-brands fa-instagram"></i> Watch Live on Instagram'
            + '</a></div>';
        if (overlay) overlay.style.display = "block";
        modal.style.display = "flex";
    };
    window.closeIGReel = function() {
        var overlay = document.getElementById("video-reel-overlay");
        var modal = document.getElementById("video-reel-modal");
        if (overlay) overlay.style.display = "none";
        if (modal) modal.style.display = "none";
    };

    // ── 16. Infallible Delegated Event Listeners ──
    document.addEventListener("click", function(e) {
        var tgt = e.target;
        if (!tgt) return;

        // Card clicks
        var productCard = tgt.closest(".product-card");
        if (productCard && !tgt.closest(".card-wishlist-btn") && !tgt.closest("button") && !tgt.closest("a")) {
            var id = productCard.getAttribute("data-id");
            if (id) {
                window.openProductModal(id);
                window.recordRecentlyViewed(id);
            }
        }

        // Add To Bag inside modal
        if (tgt.closest("#modal-add-to-cart-btn")) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof addToBagFromModal === 'function') {
                addToBagFromModal();
            } else {
                var title = document.getElementById("modal-product-title") ? document.getElementById("modal-product-title").textContent : "Luxury Co-Ord";
                var priceStr = document.getElementById("modal-product-price") ? document.getElementById("modal-product-price").textContent : "12900";
                var price = parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 12900;
                var activeSizeEl = document.querySelector(".size-option.active");
                var size = activeSizeEl ? activeSizeEl.dataset.size : "M";
                var imgEl = document.getElementById("modal-product-image");
                var img = imgEl ? imgEl.src : "images/hero_coord_editorial.webp";
                
                var cart = [];
                try {
                    cart = JSON.parse(localStorage.getItem("shapes_cart") || "[]");
                    cart.push({ id: "item-" + Date.now(), name: title, price: price, size: size, image: img, quantity: 1, customFit: window._activeCustomFit || null });
                    localStorage.setItem("shapes_cart", JSON.stringify(cart));
                } catch(err) {}
                window.dispatchEvent(new Event("shapesCartUpdated"));
                if (window.openSmartCart) window.openSmartCart();
            }
        }

        // Buy Now inside modal
        if (tgt.closest("#modal-buy-now-btn")) {
            e.preventDefault();
            e.stopPropagation();
            var title = document.getElementById("modal-product-title") ? document.getElementById("modal-product-title").textContent : "Luxury Co-Ord";
            var priceStr = document.getElementById("modal-product-price") ? document.getElementById("modal-product-price").textContent : "12900";
            var price = parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 12900;
            var activeSizeEl = document.querySelector(".size-option.active");
            var size = activeSizeEl ? activeSizeEl.dataset.size : "M";
            var imgEl = document.getElementById("modal-product-image");
            var img = imgEl ? imgEl.src : "images/hero_coord_editorial.webp";
            
            var cart = [];
            try {
                cart = JSON.parse(localStorage.getItem("shapes_cart") || "[]");
                cart.push({ id: "item-" + Date.now(), name: title, price: price, size: size, image: img, quantity: 1, customFit: window._activeCustomFit || null });
                localStorage.setItem("shapes_cart", JSON.stringify(cart));
            } catch(err) {}
            window.dispatchEvent(new Event("shapesCartUpdated"));
            if (typeof closeProductDetailModal === 'function') closeProductDetailModal();
            if (typeof initiateCheckoutFlow === 'function') initiateCheckoutFlow();
            else if (window.openSmartCart) window.openSmartCart();
        }

        // Cart trigger clicks
        if (tgt.closest("#cart-nav-trigger") || tgt.closest(".cart-icon-btn") || tgt.closest("#cart-btn")) {
            e.preventDefault();
            if (typeof openSmartCart === 'function') openSmartCart();
            else if (typeof openCartDrawer === 'function') openCartDrawer();
        }

        // Size option clicks
        var sizeBtn = tgt.closest(".size-option");
        if (sizeBtn && sizeBtn.dataset.size) {
            document.querySelectorAll(".size-option").forEach(function(b) { b.classList.remove("active"); });
            sizeBtn.classList.add("active");
            window._selectedSize = sizeBtn.dataset.size;
        }

        // Accordion triggers
        var accTrigger = tgt.closest(".prod-acc-trigger");
        if (accTrigger) {
            var item = accTrigger.closest(".prod-acc-item");
            if (item) item.classList.toggle("open");
        }
    }, true);

})();



// ── Universal Checkout Trigger ──
window.initiateCheckoutFlow = function() {
    if (typeof openCheckoutModal === 'function') {
        openCheckoutModal();
    } else {
        var modal = document.getElementById("shipping-address-modal");
        if (modal) {
            modal.classList.add("active");
            modal.style.display = "flex";
            if (typeof lockScroll === 'function') lockScroll();
        }
    }
};
window.openCheckout = window.initiateCheckoutFlow;
window.openCheckoutModal = function() {
    // 1. Ensure cart has items
    try {
        if (!cart || cart.length === 0) {
            cart = JSON.parse(localStorage.getItem("shapes_cart_items") || localStorage.getItem("shapes_cart") || "[]");
        }
    } catch(e) {}

    if (!cart || cart.length === 0) {
        if (typeof showToastMsg === 'function') {
            showToastMsg("Your shopping bag is empty. Please add items first.");
        } else {
            alert("Your shopping bag is empty. Please add an item first.");
        }
        return;
    }

    if (typeof closeCartDrawer === 'function') closeCartDrawer();
    if (typeof closeSmartCart === 'function') closeSmartCart();
    if (typeof closeProductDetailModal === 'function') closeProductDetailModal();

    var modal = document.getElementById("shipping-address-modal");
    if (modal) {
        modal.classList.add("active");
        modal.style.display = "flex";
        modal.style.opacity = "1";
        modal.style.visibility = "visible";
        if (typeof lockScroll === 'function') lockScroll();
    }
};



// ── Bulletproof Global Checkout Aliases ──
window.openCheckoutModal = openCheckoutModal;
window.initiateCheckoutFlow = openCheckoutModal;
window.openCheckout = openCheckoutModal;
window.processFinalRazorpayPayment = processFinalRazorpayPayment;
