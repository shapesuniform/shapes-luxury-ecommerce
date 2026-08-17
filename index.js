const DEFAULT_PRODUCTS = [
    {
        id: "p1",
        title: "The Royal Zardozi Corset",
        category: "Zardozi",
        price: 185000,
        inventory: 5,
        image: "zardozi_corset.webp",
        description: "An opulent structured corset in deep crimson silk-velvet, hand-embroidered with dense gold zardozi motifs. Features internal structural steel-boning and a classical adjustable lace-up back.",
        craft: "Handcrafted velvet, metallic gold zardozi wire, steel boning. Dry clean only."
    },
    {
        id: "p2",
        title: "Banarasi Brocade Sweetheart Corset",
        category: "Brocade",
        price: 85000,
        inventory: 8,
        image: "brocade_corset.webp",
        description: "A striking sweetheart neckline corset crafted from hand-woven ivory and gold Banarasi brocade silk. Offers clean structure and elegant posture contouring.",
        craft: "100% Banarasi silk brocade, satin lining, flex-boning. Dry clean only."
    },
    {
        id: "p3",
        title: "The Emerald Draped Set",
        category: "Draped Sets",
        price: 245000,
        inventory: 4,
        image: "draped_corset_set.webp",
        description: "An elegant emerald corset structured in velvet, paired with a flowing, pre-draped georgette skirt. Accented with badla borders along the cowl drape.",
        craft: "Velvet corset and georgette drape set. Dry clean only."
    },
    {
        id: "p4",
        title: "Charcoal Raw Silk Pret Corset",
        category: "Pret",
        price: 45000,
        inventory: 10,
        image: "pret_corset.webp",
        description: "A minimalist structured corset in raw charcoal silk, featuring gold stitching lines hand-tacked along the vertical structural seams. A contemporary wardrobe essential.",
        craft: "100% raw mulberry silk, comfort-flex structuring. Dry clean only."
    }
];

const DEFAULT_CATEGORIES = ["Zardozi", "Brocade", "Draped Sets", "Pret"];

const DEFAULT_CONFIG = {
    brandName: "Shapes By Satiinder Kaur",
    heroTitle: "A HERITAGE OF ELEGANCE",
    storyTitle: "CRAFTED FOR ROYALS",
    storyDesc: "Every creation at Shapes By Satiinder Kaur begins as a dream of fabric and thread. Our master craftsmen revive age-old techniques of zardozi, badla, and beadwork from royal households, fusing them seamlessly with structural silhouettes that contour the modern form. We celebrate heritage that refuses to remain in the past, transforming ancient handlooms into breathtaking contemporary treasures.",
    razorpayKey: "rzp_live_TQ0RwUwXQjD3tq" // Live Production Key
};

// State Variables
let products = [];
let categories = [];
let config = {};
let cart = [];
let selectedSize = "";
let currentActiveProduct = null;

// Search, Filter and Sort State
let activeCategory = "All";
let searchQuery = "";
let currentSort = "default";

// Initialize Store App
function initStore() {
    // Force clean migration for ultra-fast WebP catalog sync
    if (localStorage.getItem("shapes_catalog_version") !== "shapes_v7_speed_sync") {
        localStorage.removeItem("shapes_products");
        localStorage.setItem("shapes_products", JSON.stringify(DEFAULT_PRODUCTS));
        localStorage.setItem("shapes_categories", JSON.stringify(DEFAULT_CATEGORIES));
        localStorage.setItem("shapes_config", JSON.stringify(DEFAULT_CONFIG));
        localStorage.setItem("shapes_catalog_version", "shapes_v7_speed_sync");
    }



    // Load from LocalStorage or write defaults
    if (!localStorage.getItem("shapes_products")) {
        localStorage.setItem("shapes_products", JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem("shapes_categories")) {
        localStorage.setItem("shapes_categories", JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem("shapes_config")) {
        localStorage.setItem("shapes_config", JSON.stringify(DEFAULT_CONFIG));
    }
    if (!localStorage.getItem("shapes_cart")) {
        localStorage.setItem("shapes_cart", JSON.stringify([]));
    }

    // Parse stored products and rigorously sanitize any 'haha' or dummy items
    let rawProducts = JSON.parse(localStorage.getItem("shapes_products")) || [];
    products = rawProducts.filter(p => p && p.title && !p.title.toLowerCase().includes("haha") && !p.id.includes("1786736236272") && !p.title.toLowerCase().includes("test"));
    
    // If empty after sanitization, restore default pieces
    if (products.length === 0) {
        products = [...DEFAULT_PRODUCTS];
    }
    localStorage.setItem("shapes_products", JSON.stringify(products));

    categories = JSON.parse(localStorage.getItem("shapes_categories")) || DEFAULT_CATEGORIES;
    config = JSON.parse(localStorage.getItem("shapes_config")) || DEFAULT_CONFIG;
    cart = JSON.parse(localStorage.getItem("shapes_cart")) || [];

    // Render elements
    renderStorefront();
    renderClientReviews();
    renderStoreJournal();
    initStarRatingPicker();
    updateCartCount();
    updateWishlistCount();
    setupEventListeners();
    setupScrollAnimations();
}



// Render storefront elements
function renderStorefront() {
    // 1. Text elements config
    document.querySelectorAll(".footer-col.brand-info h3").forEach(el => el.innerText = config.brandName);
    const heroTitleEl = document.getElementById("hero-title-text");
    if (heroTitleEl) heroTitleEl.innerText = config.heroTitle;
    const heroTaglineEl = document.getElementById("hero-tagline-text");
    if (heroTaglineEl && config.heroTagline) heroTaglineEl.innerText = config.heroTagline;
    const storyTitleEl = document.getElementById("story-title-text");
    if (storyTitleEl) storyTitleEl.innerText = config.storyTitle;
    const storyDescEl = document.getElementById("story-desc-text");
    if (storyDescEl) storyDescEl.innerText = config.storyDesc;

    // 2. Render Horizontal Category Filter Tabs in Catalog Section
    const tabsContainer = document.getElementById("catalog-tabs-container");
    if (tabsContainer) {
        tabsContainer.innerHTML = `
            <button class="tab-btn active" data-filter="All">Shop All</button>
        `;
        categories.forEach(cat => {
            tabsContainer.innerHTML += `
                <button class="tab-btn" data-filter="${cat}">${cat}</button>
            `;
        });

        // Horizontal category tabs click listeners
        document.querySelectorAll(".tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                selectCategoryTab(btn.dataset.filter);
            });
        });
    }

    // 3. Initial Catalog Grid Render
    updateCatalogGrid();
}

// Select category tab helper
function selectCategoryTab(categoryName) {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        if (btn.dataset.filter.toLowerCase() === categoryName.toLowerCase()) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    activeCategory = categoryName;
    updateCatalogGrid();
}

// Unified catalog compiler: applies category filters, text search, and sorting
function updateCatalogGrid() {
    const listContainer = document.getElementById("product-list-container");
    listContainer.innerHTML = "";

    // Update Section Header title based on Category
    const titleText = document.getElementById("catalog-title-text");
    if (activeCategory === "All") {
        titleText.innerText = "NEW ARRIVALS";
    } else {
        titleText.innerText = activeCategory.toUpperCase() + " COLLECTION";
    }

    // Step 1: Category Filter
    let filtered = activeCategory === "All"
        ? products
        : products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

    // Step 2: Search Filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }

    // Step 3: Sort logic
    if (currentSort === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === "title-asc") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (currentSort === "default") {
        // Sort back by ID or order added (simple restoration)
        filtered.sort((a, b) => a.id.localeCompare(b.id));
    }

    // Render Cards
    if (filtered.length === 0) {
        listContainer.innerHTML = `<p class="cart-empty-msg" style="grid-column: 1/-1;">No creations found matching your query.</p>`;
        return;
    }

    filtered.forEach(p => {
        const isSoldOut = p.inventory <= 0;
        const isFav = wishlist.includes(p.id);
        const cardHtml = `
            <div class="product-card" data-id="${p.id}">
                <div class="product-card-img-wrapper">
                    ${isSoldOut ? '<span class="sold-out-badge">Sold Out</span>' : ''}
                    <span class="product-card-badge">${p.category}</span>
                    <button class="product-wishlist-btn ${isFav ? 'active' : ''}" onclick="toggleWishlist('${p.id}', event)" title="Save to Wishlist" aria-label="Save to Wishlist">
                        <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                    <img src="${cleanImagePath(p.image)}" alt="${p.title} — Handcrafted Luxury Indian Couture by Satiinder Kaur" width="600" height="800" loading="lazy" decoding="async">
                    <div class="product-card-hover-overlay">
                        <span class="view-piece-text">Explore Piece</span>
                    </div>
                </div>
                <div class="product-card-info">
                    <h3 class="product-card-title">${p.title}</h3>
                    <div class="product-card-price-row">
                        <span class="product-card-price">${formatCurrency(p.price)}</span>
                        <span class="gst-tag">Tax Incl.</span>
                    </div>
                    <button class="card-action-tap-btn" onclick="openProductDetail('${p.id}'); event.stopPropagation();">
                        <span>View Details</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        listContainer.innerHTML += cardHtml;
    });

    // Add card click listeners
    document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.closest(".product-wishlist-btn") || e.target.closest(".card-action-tap-btn")) return;
            openProductDetail(card.dataset.id);
        });
    });
}

// Multi-Currency Exchange Rates & Conversion
let currentCurrency = localStorage.getItem("shapes_currency") || "INR";
const CURRENCY_RATES = {
    INR: { rate: 1, symbol: "₹", locale: "en-IN", code: "INR" },
    USD: { rate: 0.012, symbol: "$", locale: "en-US", code: "USD" },
    GBP: { rate: 0.0095, symbol: "£", locale: "en-GB", code: "GBP" },
    AED: { rate: 0.044, symbol: "AED ", locale: "en-AE", code: "AED" },
    EUR: { rate: 0.011, symbol: "€", locale: "de-DE", code: "EUR" }
};

function formatCurrency(amountInInr) {
    const config = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES.INR;
    const converted = amountInInr * config.rate;

    if (currentCurrency === "INR") {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amountInInr);
    } else {
        return config.symbol + Math.round(converted).toLocaleString(config.locale);
    }
}

function setCurrency(newCurrency) {
    if (CURRENCY_RATES[newCurrency]) {
        currentCurrency = newCurrency;
        localStorage.setItem("shapes_currency", newCurrency);
        updateCatalogGrid();
        renderCartItems();
        if (currentActiveProduct) {
            document.getElementById("modal-product-price").innerText = formatCurrency(currentActiveProduct.price);
        }
    }
}

// Clean Image Path Helper (Prefers WebP with auto-prefix)
function cleanImagePath(path) {
    if (!path) return "images/zardozi_corset.webp";
    let clean = path.replace(/['"]/g, '').trim();
    clean = clean.split('\\').pop().split('/').pop();
    if (!clean.startsWith("images/") && !clean.startsWith("http")) {
        clean = "images/" + clean;
    }
    // Swap .png to .webp for high performance
    clean = clean.replace(/\.png$/i, '.webp');
    return clean;
}

// ─────────────────────────────────────────────────────────────
// WISHLIST MANAGEMENT
// ─────────────────────────────────────────────────────────────
let wishlist = JSON.parse(localStorage.getItem("shapes_wishlist") || "[]");

function toggleWishlist(productId, event) {
    if (event) event.stopPropagation();

    const idx = wishlist.indexOf(productId);
    const p = products.find(prod => prod.id === productId);

    if (idx > -1) {
        wishlist.splice(idx, 1);
        showMobileToast(`Removed "${p ? p.title : 'Item'}" from Wishlist`);
    } else {
        wishlist.push(productId);
        showMobileToast(`Saved "${p ? p.title : 'Item'}" to Wishlist`);
    }

    localStorage.setItem("shapes_wishlist", JSON.stringify(wishlist));
    updateWishlistCount();
    updateCatalogGrid();
    updateModalWishlistState();
    renderWishlistItems();
}

function updateWishlistCount() {
    const countEl = document.getElementById("wishlist-count");
    if (countEl) countEl.innerText = wishlist.length;
}

function openWishlistDrawer() {
    renderWishlistItems();
    document.getElementById("wishlist-drawer").classList.add("active");
}

function closeWishlistDrawer() {
    document.getElementById("wishlist-drawer").classList.remove("active");
}

function renderWishlistItems() {
    const container = document.getElementById("wishlist-items-container");
    if (!container) return;
    container.innerHTML = "";

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="cart-empty-msg">
                <i class="fa-regular fa-heart" style="font-size: 2rem; color: var(--gold); margin-bottom: 0.8rem;"></i>
                <p>Your saved wishlist is empty.<br>Click the heart icon on any design to bookmark it.</p>
            </div>
        `;
        return;
    }

    wishlist.forEach(id => {
        const p = products.find(prod => prod.id === id);
        if (!p) return;

        const itemHtml = `
            <div class="cart-item">
                <div class="cart-item-img-wrapper" style="cursor: pointer;" onclick="openProductDetail('${p.id}'); closeWishlistDrawer();">
                    <img src="${cleanImagePath(p.image)}" alt="${p.title}">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title" style="cursor: pointer;" onclick="openProductDetail('${p.id}'); closeWishlistDrawer();">${p.title}</h4>
                    <span class="cart-item-meta">${p.category}</span>
                    <span class="cart-item-price">${formatCurrency(p.price)}</span>
                    <div class="cart-item-controls" style="margin-top: 6px;">
                        <button class="remove-item-btn" style="color: var(--gold); border-color: var(--gold); padding: 3px 8px;" onclick="openProductDetail('${p.id}'); closeWishlistDrawer();">View Piece</button>
                        <button class="remove-item-btn" onclick="toggleWishlist('${p.id}')">Remove</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += itemHtml;
    });
}

function updateModalWishlistState() {
    const btn = document.getElementById("modal-wishlist-btn");
    if (!btn || !currentActiveProduct) return;
    const isFav = wishlist.includes(currentActiveProduct.id);
    if (isFav) {
        btn.classList.add("active");
        btn.innerHTML = `<i class="fa-solid fa-heart" style="color: #E05666;"></i> <span>Saved</span>`;
    } else {
        btn.classList.remove("active");
        btn.innerHTML = `<i class="fa-regular fa-heart"></i> <span>Save</span>`;
    }
}

// ─────────────────────────────────────────────────────────────
// 1-CLICK PRODUCT SHARING ON WHATSAPP
// ─────────────────────────────────────────────────────────────
function shareActiveProduct() {
    if (!currentActiveProduct) return;
    const p = currentActiveProduct;
    const shareText = encodeURIComponent(
        `✨ Check out this luxury creation by Shapes By Satiinder Kaur!\n\n` +
        `*${p.title}*\n` +
        `Category: ${p.category}\n` +
        `Price: ₹${p.price.toLocaleString("en-IN")}\n\n` +
        `Handcrafted to order (15–22 days delivery). Explore details at:\n` +
        `https://shapesbysatinderkaur.com`
    );
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
}


// Open Product Detail Modal
function openProductDetail(productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    currentActiveProduct = p;
    selectedSize = "";

    // Set Modal content
    document.getElementById("modal-product-image").src = cleanImagePath(p.image);
    document.getElementById("modal-product-image").alt = p.title;
    document.getElementById("modal-product-category").innerText = p.category;
    document.getElementById("modal-product-title").innerText = p.title;
    document.getElementById("modal-product-price").innerHTML = `${formatCurrency(p.price)} <span style="font-size: 11px; font-weight: 400; color: var(--grey-dark); letter-spacing: 0.04em; font-family: var(--font-sans); margin-left: 6px;">(Inclusive of all taxes &amp; GST)</span>`;
    document.getElementById("modal-product-desc").innerText = p.description;

    document.getElementById("modal-craftsmanship-detail").innerText = p.craft || "Handcrafted by regional master weavers. Dry clean only.";

    // Stock status check
    const stockContainer = document.getElementById("modal-product-stock");
    const addToCartBtn = document.getElementById("modal-add-to-cart-btn");
    
    if (p.inventory <= 0) {
        stockContainer.innerHTML = `<span class="stock-dot stock-out"></span> Retired / Out of Stock`;
        addToCartBtn.disabled = true;
        addToCartBtn.innerText = "OUT OF STOCK";
    } else if (p.inventory <= 2) {
        stockContainer.innerHTML = `<span class="stock-dot stock-low"></span> Only ${p.inventory} pieces left`;
        addToCartBtn.disabled = false;
        addToCartBtn.innerText = "ADD TO BAG";
    } else {
        stockContainer.innerHTML = `<span class="stock-dot stock-in"></span> Creation Available`;
        addToCartBtn.disabled = false;
        addToCartBtn.innerText = "ADD TO BAG";
    }

    // Render Razorpay Affordability & EMI Widget
    renderAffordabilityWidget(p.price);

    // Reset size selectors
    document.querySelectorAll(".size-option").forEach(btn => {
        btn.classList.remove("active");
    });

    updateModalWishlistState();

    document.getElementById("product-detail-modal").classList.add("active");
    document.body.style.overflow = "hidden";
}

// Razorpay Affordability & EMI Widget Initializer
function renderAffordabilityWidget(priceInInr) {
    const container = document.getElementById("razorpay-affordability-widget");
    if (!container) return;
    container.innerHTML = "";

    const rzpKey = config.razorpayKey || "rzp_live_TQ0RwUwXQjD3tq";

    const amountInPaise = (priceInInr || 0) * 100;

    if (typeof RazorpayAffordabilitySuite !== "undefined") {
        try {
            const widgetConfig = {
                "key": rzpKey,
                "amount": amountInPaise
            };
            const rzpAffordabilitySuite = new RazorpayAffordabilitySuite(widgetConfig);
            rzpAffordabilitySuite.render();
        } catch (e) {
            console.warn("Razorpay Affordability Widget render:", e.message);
        }
    }
}



// Setup Event Listeners
function setupEventListeners() {
    // 1. Header scroll animation (Passive listener for 120fps smooth mobile scrolling)
    window.addEventListener("scroll", () => {
        const header = document.getElementById("header");
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }, { passive: true });

    // 2. Mobile Nav Drawer Toggle
    const mobileToggle = document.getElementById("mobile-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    
    mobileToggle.addEventListener("click", () => {
        mobileToggle.classList.toggle("active");
        mobileNav.classList.toggle("open");
    });

    // Direct links to Shop categories from Nav Header
    document.querySelectorAll(".shop-nav-trigger").forEach(link => {
        link.addEventListener("click", (e) => {
            const cat = link.dataset.category;
            if (cat) {
                e.preventDefault();
                // Select Category tab
                selectCategoryTab(cat);
                // Scroll to Shop section
                document.getElementById("catalog").scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Mobile nav trigger categories
    document.querySelectorAll(".mobile-shop-trigger").forEach(link => {
        link.addEventListener("click", (e) => {
            const cat = link.dataset.category;
            if (cat) {
                e.preventDefault();
                // Select Category tab
                selectCategoryTab(cat);
                // Close mobile drawer
                mobileToggle.classList.remove("active");
                mobileNav.classList.remove("open");
                // Scroll to Shop
                setTimeout(() => {
                    document.getElementById("catalog").scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        });
    });

    // Footer categories links
    document.querySelectorAll(".footer-shop-trigger").forEach(link => {
        link.addEventListener("click", (e) => {
            const cat = link.dataset.category;
            if (cat) {
                e.preventDefault();
                // Select Category tab
                selectCategoryTab(cat);
                // Scroll to Shop
                document.getElementById("catalog").scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Banner "Explore Shop" CTA
    document.getElementById("hero-discover-btn").addEventListener("click", () => {
        selectCategoryTab("All");
        document.getElementById("catalog").scrollIntoView({ behavior: 'smooth' });
    });

    // "Our Story" nav triggers
    document.querySelectorAll(".story-nav-trigger").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("story-section").scrollIntoView({ behavior: 'smooth' });
        });
    });

    document.querySelectorAll(".mobile-story-trigger").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            // Close mobile menu
            mobileToggle.classList.remove("active");
            mobileNav.classList.remove("open");
            // Scroll to Story
            setTimeout(() => {
                document.getElementById("story-section").scrollIntoView({ behavior: 'smooth' });
            }, 300);
        });
    });

    // 4. Search and Sort inputs
    const searchInput = document.getElementById("boutique-search-input");
    const sortSelect = document.getElementById("boutique-sort-select");

    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        updateCatalogGrid();
    });

    sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        updateCatalogGrid();
    });

    // 5. Product Modal Controls
    document.getElementById("close-product-modal").addEventListener("click", () => {
        document.getElementById("product-detail-modal").classList.remove("active");
        document.body.style.overflow = "";
    });

    // Dynamic Image Zoom Lens
    const zoomContainer = document.getElementById("zoom-container");
    const zoomImg = document.getElementById("modal-product-image");

    zoomContainer.addEventListener("mousemove", (e) => {
        const rect = zoomContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        zoomImg.style.transformOrigin = `${x}% ${y}%`;
        zoomImg.style.transform = "scale(1.8)";
    });

    zoomContainer.addEventListener("mouseleave", () => {
        zoomImg.style.transform = "scale(1)";
        zoomImg.style.transformOrigin = "center center";
    });

    // Size Option clicks
    document.querySelectorAll(".size-option").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".size-option").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedSize = btn.dataset.size;
        });
    });

    // Add to Bag action button
    document.getElementById("modal-add-to-cart-btn").addEventListener("click", () => {
        if (!currentActiveProduct) return;
        if (!selectedSize) {
            alert("Please select a size to proceed.");
            return;
        }

        addToCart(currentActiveProduct.id, selectedSize);
        document.getElementById("close-product-modal").click();
        openCartDrawer();
    });

    // Modal Wishlist & Share buttons
    const modalWishlistBtn = document.getElementById("modal-wishlist-btn");
    if (modalWishlistBtn) {
        modalWishlistBtn.addEventListener("click", () => {
            if (currentActiveProduct) toggleWishlist(currentActiveProduct.id);
        });
    }

    const modalShareBtn = document.getElementById("modal-share-wa-btn");
    if (modalShareBtn) {
        modalShareBtn.addEventListener("click", shareActiveProduct);
    }

    // Currency Switcher
    const currencySelect = document.getElementById("currency-select");
    if (currencySelect) {
        currencySelect.value = currentCurrency;
        currencySelect.addEventListener("change", (e) => {
            setCurrency(e.target.value);
        });
    }

    // Wishlist Drawer triggers
    const openWishlistBtn = document.getElementById("open-wishlist-btn");
    if (openWishlistBtn) openWishlistBtn.addEventListener("click", openWishlistDrawer);
    const closeWishlistBtn = document.getElementById("close-wishlist-btn");
    if (closeWishlistBtn) closeWishlistBtn.addEventListener("click", closeWishlistDrawer);
    const wishlistShopBtn = document.getElementById("wishlist-shop-btn");
    if (wishlistShopBtn) wishlistShopBtn.addEventListener("click", closeWishlistDrawer);
    const wishlistDrawer = document.getElementById("wishlist-drawer");
    if (wishlistDrawer) {
        wishlistDrawer.addEventListener("click", (e) => {
            if (e.target.id === "wishlist-drawer") closeWishlistDrawer();
        });
    }

    // Bag drawer triggers
    document.getElementById("open-cart-btn").addEventListener("click", openCartDrawer);

    const mobileBarCartBtn = document.getElementById("mobile-bar-cart-btn");
    if (mobileBarCartBtn) mobileBarCartBtn.addEventListener("click", openCartDrawer);
    const toastViewBagBtn = document.getElementById("toast-view-bag-btn");
    if (toastViewBagBtn) toastViewBagBtn.addEventListener("click", () => {
        document.getElementById("mobile-toast").classList.remove("active");
        openCartDrawer();
    });

    document.getElementById("close-cart-btn").addEventListener("click", closeCartDrawer);
    document.getElementById("cart-drawer").addEventListener("click", (e) => {
        if (e.target.id === "cart-drawer") closeCartDrawer();
    });


    // Checkout trigger
    document.getElementById("proceed-checkout-btn").addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your Shopping Bag is empty.");
            return;
        }
        closeCartDrawer();
        openCheckoutModal();
    });

    document.getElementById("close-checkout-btn").addEventListener("click", closeCheckoutModal);

    // Accordions
    document.querySelectorAll(".accordion-header").forEach(header => {
        header.addEventListener("click", () => {
            header.parentElement.classList.toggle("active");
        });
    });

    // Checkout Billing Form Submit
    document.getElementById("billing-shipping-form").addEventListener("submit", (e) => {
        e.preventDefault();
        processCheckout();
    });

    document.getElementById("finish-checkout-btn").addEventListener("click", () => {
        closeCheckoutModal();
    });
}

// Add Item To Cart
function addToCart(productId, size) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    // Check inventory levels
    const cartItem = cart.find(item => item.id === productId && item.size === size);
    const existingQty = cartItem ? cartItem.quantity : 0;

    if (existingQty + 1 > p.inventory) {
        alert(`Designer note: Only ${p.inventory} pieces of this creation are currently crafted.`);
        return;
    }

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            size: size,
            quantity: 1
        });
    }

    saveCartState();
    updateCartCount();
    showMobileToast(`Added "${p.title}" to Bag`);
}

// Mobile Floating Toast Alert
let toastTimer = null;
function showMobileToast(msg) {
    const toast = document.getElementById("mobile-toast");
    const msgEl = document.getElementById("toast-message");
    if (!toast || !msgEl) return;

    msgEl.textContent = msg;
    toast.classList.add("active");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("active");
    }, 3500);
}

// Update Cart Quantity
function updateCartQty(productId, size, increment) {
    const item = cart.find(i => i.id === productId && i.size === size);
    if (!item) return;

    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    if (increment > 0) {
        if (item.quantity + 1 > p.inventory) {
            alert(`Only ${p.inventory} physical creations are currently in stock.`);
            return;
        }
        item.quantity += 1;
    } else {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart = cart.filter(i => !(i.id === productId && i.size === size));
        }
    }

    saveCartState();
    updateCartCount();
    renderCartItems();
}

// Remove item entirely
function removeCartItem(productId, size) {
    cart = cart.filter(i => !(i.id === productId && i.size === size));
    saveCartState();
    updateCartCount();
    renderCartItems();
}

// Save cart to LocalStorage
function saveCartState() {
    localStorage.setItem("shapes_cart", JSON.stringify(cart));
}

// Cart badge counts (Sync desktop + mobile badges)
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const desktopBadge = document.getElementById("cart-count");
    const mobileBadge = document.getElementById("mobile-cart-count");

    if (desktopBadge) desktopBadge.innerText = count;
    if (mobileBadge) mobileBadge.innerText = count;
}

// Open Bag Drawer
function openCartDrawer() {
    renderCartItems();
    document.getElementById("cart-drawer").classList.add("active");
}


function closeCartDrawer() {
    document.getElementById("cart-drawer").classList.remove("active");
}

// Render items in bag
function renderCartItems() {
    const container = document.getElementById("cart-items-container");
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty-msg">
                <i class="fa-solid fa-gem"></i>
                <p>Your luxury collection bag is empty.</p>
            </div>
        `;
        document.getElementById("cart-subtotal").innerText = formatCurrency(0);
        return;
    }

    let subtotal = 0;

    cart.forEach(item => {
        const p = products.find(prod => prod.id === item.id);
        if (!p) return;

        subtotal += p.price * item.quantity;

        const itemHtml = `
            <div class="cart-item">
                <div class="cart-item-img-wrapper">
                    <img src="${cleanImagePath(p.image)}" alt="${p.title}">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${p.title}</h4>
                    <span class="cart-item-meta">Size: ${item.size} | Category: ${p.category}</span>
                    <span class="cart-item-price">${formatCurrency(p.price)}</span>
                    <div class="cart-item-controls">
                        <div class="qty-control">
                            <button class="qty-btn" onclick="updateCartQty('${item.id}', '${item.size}', -1)">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateCartQty('${item.id}', '${item.size}', 1)">+</button>
                        </div>
                        <button class="remove-item-btn" onclick="removeCartItem('${item.id}', '${item.size}')">Remove</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += itemHtml;
    });

    document.getElementById("cart-subtotal").innerText = formatCurrency(subtotal);
}

// Open Checkout Modal
function openCheckoutModal() {
    const container = document.getElementById("checkout-items-list");
    container.innerHTML = "";

    let subtotal = 0;
    cart.forEach(item => {
        const p = products.find(prod => prod.id === item.id);
        if (!p) return;

        subtotal += p.price * item.quantity;

        const row = `
            <div class="checkout-item-row">
                <div class="checkout-item-title-qty">
                    <strong>${p.title}</strong><br>
                    <span class="grey-text">Size: ${item.size} (x${item.quantity})</span>
                </div>
                <span>${formatCurrency(p.price * item.quantity)}</span>
            </div>
        `;
        container.innerHTML += row;
    });

    // Calculate GST (12% Apparel GST included)
    const gstRate = 0.12;
    const taxableBase = Math.round(subtotal / (1 + gstRate));
    const gstAmount = subtotal - taxableBase;

    const subtotalEl = document.getElementById("checkout-subtotal");
    const gstEl = document.getElementById("checkout-gst-amount");
    const grandEl = document.getElementById("checkout-grand-total");

    if (subtotalEl) subtotalEl.innerText = formatCurrency(subtotal);
    if (gstEl) gstEl.innerText = formatCurrency(gstAmount);
    if (grandEl) grandEl.innerText = formatCurrency(subtotal);


    // Reset Success states
    document.getElementById("checkout-main-form").style.display = "block";
    document.getElementById("order-success-screen").style.display = "none";

    document.getElementById("checkout-modal").classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
    document.getElementById("checkout-modal").classList.remove("active");
    document.body.style.overflow = "";
}

// Process Secure Checkout
async function processCheckout() {
    const name = document.getElementById("cust-name").value.trim();
    const email = document.getElementById("cust-email").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const address = document.getElementById("cust-address").value.trim();
    const zip = document.getElementById("cust-zip").value.trim();
    const gstin = (document.getElementById("cust-gstin") ? document.getElementById("cust-gstin").value.trim() : "");


    const subtotal = cart.reduce((total, item) => {
        const p = products.find(prod => prod.id === item.id);
        return total + (p ? p.price * item.quantity : 0);
    }, 0);

    const amountInPaise = subtotal * 100;
    if (amountInPaise < 100) {
        alert("Minimum order amount must be at least ₹1.");
        return;
    }

    const submitBtn = document.querySelector(".submit-order-btn");
    const originalBtnText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerText = "INITIALIZING SECURE GATEWAY...";

    try {
        let backendOrderId = null;
        let finalAmount = amountInPaise;
        let finalCurrency = "INR";

        // Try backend order creation if Netlify functions are active
        try {
            const orderResponse = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amountInPaise })
            });

            if (orderResponse.ok) {
                const orderData = await orderResponse.json();
                if (orderData && orderData.order_id) {
                    backendOrderId = orderData.order_id;
                    finalAmount = orderData.amount || amountInPaise;
                    finalCurrency = orderData.currency || "INR";
                }
            }
        } catch (backendErr) {
            console.warn("Backend order endpoint unavailable, falling back to direct client gateway:", backendErr.message);
        }

        const rzpKey = config.razorpayKey || "rzp_live_TQ0RwUwXQjD3tq";


        // Open Razorpay Standard Checkout
        const options = {
            "key": rzpKey,
            "amount": finalAmount,
            "currency": finalCurrency,
            "name": "Shapes By Satiinder Kaur",
            "description": "Couture Order Checkout",
            "image": "app_icon.png",
            ...(backendOrderId ? { "order_id": backendOrderId } : {}),
            "handler": async function (response) {
                submitBtn.innerText = "CONFIRMING ORDER...";
                
                // If signature verification endpoint is available, verify it; otherwise complete directly
                if (response.razorpay_signature && backendOrderId) {
                    try {
                        const verifyResponse = await fetch("/api/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        if (verifyResponse.ok) {
                            const vData = await verifyResponse.json();
                            if (vData.status !== "success") {
                                console.warn("Signature verification mismatch, proceeding with confirmed paymentId");
                            }
                        }
                    } catch (vErr) {
                        console.warn("Verification endpoint skipped:", vErr.message);
                    }
                }

                completeOrder(response.razorpay_payment_id || ("pay_" + Date.now()));
            },
            "prefill": {
                "name": name,
                "email": email,
                "contact": phone
            },
            "notes": {
                "address": `${address} - ${zip}`,
                "cart_details": JSON.stringify(cart)
            },
            "theme": {
                "color": "#C5A059"
            },
            "modal": {
                "ondismiss": function() {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.on('payment.failed', function (response) {
            alert("Payment could not be completed: " + (response.error ? response.error.description : "Transaction declined."));
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        });
        rzp.open();

    } catch (err) {
        console.error("Payment gateway error:", err);
        alert("Payment Gateway Notice: " + err.message);
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
    }

}

// Complete order callback on payment authorization
function completeOrder(paymentId) {
    // 1. Deduct products stock
    const orderedItems = cart.map(item => {
        const p = products.find(prod => prod.id === item.id);
        return { title: p ? p.title : item.id, size: item.size, quantity: item.quantity, price: p ? p.price : 0 };
    });

    cart.forEach(item => {
        const p = products.find(prod => prod.id === item.id);
        if (p) {
            p.inventory = Math.max(0, p.inventory - item.quantity);
        }
    });

    localStorage.setItem("shapes_products", JSON.stringify(products));

    // 2. Sequential Order ID — starts from #0001
    const lastOrderNum = parseInt(localStorage.getItem("shapes_last_order_num") || "0");
    const newOrderNum = lastOrderNum + 1;
    localStorage.setItem("shapes_last_order_num", String(newOrderNum));
    const refCode = "SH-" + String(newOrderNum).padStart(4, "0");

    // 3. Save order details to localStorage for tracking page
    const totalAmt = orderedItems.reduce((t, i) => t + (i.price * i.quantity), 0);
    const gstRate = 0.12;
    const taxableBase = Math.round(totalAmt / (1 + gstRate));
    const gstAmount = totalAmt - taxableBase;
    const gstin = (document.getElementById("cust-gstin") ? document.getElementById("cust-gstin").value.trim() : "");

    const orderRecord = {
        ref: refCode,
        paymentId: paymentId,
        date: new Date().toISOString(),
        items: orderedItems,
        total: totalAmt,
        taxableBase: taxableBase,
        gstAmount: gstAmount,
        gstRate: "12%",
        gstin: gstin,
        status: "confirmed"
    };
    const allOrders = JSON.parse(localStorage.getItem("shapes_orders") || "[]");
    allOrders.push(orderRecord);
    localStorage.setItem("shapes_orders", JSON.stringify(allOrders));


    // 4. Clear cart state
    cart = [];
    saveCartState();
    updateCartCount();

    // 5. Update Order Reference on screen
    document.getElementById("order-ref-code").innerHTML =
        `${refCode}<br><span style="font-size: 10px; color: var(--gold); letter-spacing: 0.05em; font-family: var(--font-sans);">Payment ID: ${paymentId}</span>`;

    // 6. Build WhatsApp confirmation message
    const custName = document.getElementById("cust-name").value.trim() || "Customer";
    const itemsSummary = orderedItems.map(i => `${i.title} (Size: ${i.size} x${i.quantity})`).join(", ");
    const waMsg = encodeURIComponent(
        `Hello Shapes By Satiinder Kaur! 🌟\n\n` +
        `I just completed my order and would like to confirm:\n\n` +
        `Order Ref: *${refCode}*\n` +
        `Payment ID: ${paymentId}\n` +
        `Items: ${itemsSummary}\n` +
        `Total: ₹${totalAmt.toLocaleString("en-IN")}\n\n` +
        `Name: ${custName}\n\n` +
        `Please confirm my order. Thank you!`
    );

    const waLink = `https://wa.me/919833392756?text=${waMsg}`;
    document.getElementById("whatsapp-confirm-btn").href = waLink;

    // 7. Update Track Order link with order ref
    document.getElementById("track-order-btn").href = `track.html?ref=${refCode}`;

    // 8. Show Success Screen
    document.getElementById("checkout-main-form").style.display = "none";
    document.getElementById("order-success-screen").style.display = "flex";

    // 9. Re-render storefront
    renderStorefront();
}

// Scroll Reveal Animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll(".animate-on-scroll").forEach(el => {
        observer.observe(el);
    });
}

// Expose functions globally for dynamic inline DOM click bindings
window.updateCartQty = updateCartQty;
window.removeCartItem = removeCartItem;


// Run initial loading
window.addEventListener("DOMContentLoaded", initStore);


// ─────────────────────────────────────────────────────────────────────────────
// FIREBASE AUTH & FIRESTORE INTEGRATION (ESM module — loaded after DOM ready)
// ─────────────────────────────────────────────────────────────────────────────

// Global firebase handles (set by ESM module below via window._*)
let _currentUser = null;

function injectAccountNavLink() {
    // Insert "My Account" link into nav-right if not already present
    if (document.getElementById("nav-account-link")) return;
    const navRight = document.querySelector(".nav-right");
    if (!navRight) return;
    const link = document.createElement("a");
    link.id = "nav-account-link";
    link.href = "account.html";
    link.className = "nav-link";
    link.innerHTML = `<i class="fa-solid fa-circle-user" style="font-size:14px; color:var(--gold);"></i>`;
    link.title = "My Account";
    link.style.cssText = "display:flex;align-items:center;gap:5px;";
    navRight.insertBefore(link, navRight.firstChild);
}

// Called by firebase ESM module when auth state changes
window._onAuthUser = function(user) {
    _currentUser = user;
    injectAccountNavLink();
    const link = document.getElementById("nav-account-link");
    if (link) {
        link.title = user ? `Signed in as ${user.displayName || user.email}` : "Sign In / Register";
        link.innerHTML = user
            ? `<i class="fa-solid fa-circle-user" style="font-size:14px; color:var(--gold);"></i>`
            : `<i class="fa-regular fa-circle-user" style="font-size:14px;"></i>`;
    }
};

// Save order to Firestore — called from completeOrder()
async function saveOrderToFirestore(orderRecord) {
    if (!window._dbStore || !window._addDocStore || !window._collectionStore) return;
    try {
        const user = _currentUser;
        const enriched = {
            ...orderRecord,
            uid: user ? user.uid : null,
            customerName: user ? (user.displayName || "") : (document.getElementById("cust-name")?.value || ""),
            customerEmail: user ? user.email : (document.getElementById("cust-email")?.value || ""),
            customerPhone: document.getElementById("cust-phone")?.value || ""
        };
        await window._addDocStore(window._collectionStore(window._dbStore, "orders"), enriched);
    } catch (e) {
        console.warn("Firestore save failed (will fallback to localStorage):", e.message);
    }
}

// Patch completeOrder to also save to Firestore (non-breaking — localStorage still works even if Firebase not configured)
const _originalCompleteOrder = completeOrder;
window.completeOrder = async function(paymentId) {
    // Run original logic first (sets up orderRecord in localStorage etc.)
    _originalCompleteOrder(paymentId);

    // Retrieve the just-saved order from localStorage and push to Firestore
    try {
        const allOrders = JSON.parse(localStorage.getItem("shapes_orders") || "[]");
        const latest = allOrders[allOrders.length - 1];
        if (latest) await saveOrderToFirestore(latest);
    } catch (e) { /* silent */ }
};

// ─────────────────────────────────────────────────────────────────────────────
// LUXURY CLIENT REVIEWS & TESTIMONIALS CONTROLLER
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_CLIENT_REVIEWS = [
    {
        id: "rev-google-1",
        author: "Rhea Dhameja",
        city: "Mumbai",
        rating: 5,
        category: "Bridal",
        categoryLabel: "Verified Google Review",
        text: "Perfect stitching, great attention to detail, and excellent service by Gitu.",
        verified: true,
        date: "Verified Google Review"
    },
    {
        id: "rev-google-2",
        author: "Wilma Vaz",
        city: "Mumbai",
        rating: 5,
        category: "Pret",
        categoryLabel: "Verified Google Review",
        text: "Hands down, this is the best tailor with excellent customer service.",
        verified: true,
        date: "Verified Google Review"
    },
    {
        id: "rev-google-3",
        author: "Dr. Nishtha Mishra",
        city: "Mumbai",
        rating: 5,
        category: "Couture",
        categoryLabel: "Verified Google Review",
        text: "They offer you best options, best designs and best fitting.",
        verified: true,
        date: "Verified Google Review"
    }
];

function getStoredClientReviews() {
    try {
        // Migration to clean out old template reviews
        if (localStorage.getItem("shapes_reviews_version") !== "shapes_real_google_v1") {
            localStorage.removeItem("shapes_client_reviews");
            localStorage.setItem("shapes_reviews_version", "shapes_real_google_v1");
        }
        const stored = localStorage.getItem("shapes_client_reviews");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}
    localStorage.setItem("shapes_client_reviews", JSON.stringify(DEFAULT_CLIENT_REVIEWS));
    return DEFAULT_CLIENT_REVIEWS;
}

let activeReviewCategory = "All";

function renderClientReviews() {
    const container = document.getElementById("testimonials-grid-container");
    if (!container) return;

    const allReviews = getStoredClientReviews();
    const countDisplay = document.getElementById("reviews-count-display");
    if (countDisplay) {
        countDisplay.textContent = `${47 + (allReviews.length - DEFAULT_CLIENT_REVIEWS.length)}+ Verified Client Reviews`;
    }

    const filtered = activeReviewCategory === "All" 
        ? allReviews 
        : allReviews.filter(r => r.category === activeReviewCategory);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--grey-medium);">
                <i class="fa-solid fa-gem" style="font-size: 2rem; color: var(--gold); margin-bottom: 1rem; display: block;"></i>
                <p style="font-size: 14px; font-family: var(--font-serif); font-style: italic;">No reviews in this category yet. Be the first to share your experience!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(r => {
        const starsHtml = '<i class="fa-solid fa-star"></i>'.repeat(r.rating || 5);
        const initials = r.author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CL';
        return `
            <div class="testimonial-card">
                <i class="fa-solid fa-quote-right quote-watermark"></i>
                <div>
                    <div class="card-top-row">
                        <div class="stars">${starsHtml}</div>
                        <span class="review-category-badge">${r.categoryLabel || r.category || 'Couture'}</span>
                    </div>
                    <p class="review-text">"${r.text}"</p>
                </div>
                <div class="reviewer-profile-row">
                    <div class="reviewer-avatar">${initials}</div>
                    <div class="reviewer-info-meta">
                        <h4 class="client-name">
                            ${r.author}
                            ${r.verified ? '<span class="verified-icon-badge"><i class="fa-solid fa-circle-check"></i> Verified</span>' : ''}
                        </h4>
                        <div class="source-tag">
                            <span><i class="fa-solid fa-location-dot" style="font-size:9px; color:var(--gold);"></i> ${r.city || 'India'}</span>
                            <span>·</span>
                            <span>${r.date || 'Verified Review'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function filterClientReviews(category, btnElement) {
    activeReviewCategory = category;
    document.querySelectorAll(".review-filter-pill").forEach(p => p.classList.remove("active"));
    if (btnElement) btnElement.classList.add("active");
    renderClientReviews();
}

function openWriteReviewModal() {
    const modal = document.getElementById("write-review-modal");
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeWriteReviewModal() {
    const modal = document.getElementById("write-review-modal");
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
}

function initStarRatingPicker() {
    const picker = document.getElementById("review-stars-picker");
    if (!picker) return;

    const stars = picker.querySelectorAll("i");
    const valInput = document.getElementById("review-rating-value");
    const feedback = document.getElementById("star-rating-feedback");

    const feedbackTexts = {
        1: "★☆☆☆☆ Poor (1 / 5 Stars)",
        2: "★★☆☆☆ Fair (2 / 5 Stars)",
        3: "★★★☆☆ Good (3 / 5 Stars)",
        4: "★★★★☆ Great (4 / 5 Stars)",
        5: "★★★★★ Exceptional (5 / 5 Stars)"
    };

    stars.forEach(star => {
        star.addEventListener("mouseenter", () => {
            const rating = parseInt(star.getAttribute("data-rating"));
            stars.forEach((s, idx) => {
                s.classList.toggle("hovered", idx < rating);
            });
            if (feedback) feedback.textContent = feedbackTexts[rating] || "";
        });

        star.addEventListener("mouseleave", () => {
            stars.forEach(s => s.classList.remove("hovered"));
            const current = parseInt(valInput.value || "5");
            if (feedback) feedback.textContent = feedbackTexts[current] || "";
        });

        star.addEventListener("click", () => {
            const rating = parseInt(star.getAttribute("data-rating"));
            valInput.value = rating;
            stars.forEach((s, idx) => {
                s.classList.toggle("selected", idx < rating);
            });
            if (feedback) feedback.textContent = feedbackTexts[rating] || "";
        });
    });
}

function handleClientReviewSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("rev-author-name").value.trim();
    const city = document.getElementById("rev-author-city").value.trim();
    const categoryVal = document.getElementById("rev-category-select").value;
    const categoryText = document.getElementById("rev-category-select").options[document.getElementById("rev-category-select").selectedIndex].text;
    const rating = parseInt(document.getElementById("review-rating-value").value || "5");
    const story = document.getElementById("rev-story-text").value.trim();

    if (!name || !story) {
        alert("Please enter your name and review details.");
        return;
    }

    const newReview = {
        id: "rev-" + Date.now(),
        author: name,
        city: city || "Mumbai",
        rating: rating,
        category: categoryVal,
        categoryLabel: categoryText,
        text: story,
        verified: true,
        date: "Just now"
    };

    // Save to localStorage
    const currentReviews = getStoredClientReviews();
    currentReviews.unshift(newReview);
    localStorage.setItem("shapes_client_reviews", JSON.stringify(currentReviews));

    // Also sync to Firestore if connected
    if (window._dbStore && window._addDocStore && window._collectionStore) {
        try {
            window._addDocStore(window._collectionStore(window._dbStore, "reviews"), {
                ...newReview,
                createdAt: new Date().toISOString()
            });
        } catch (err) {
            console.warn("Firestore review sync:", err.message);
        }
    }

    // Refresh UI
    renderClientReviews();
    closeWriteReviewModal();

    // Reset Form
    document.getElementById("write-review-form").reset();
    document.getElementById("review-rating-value").value = "5";
    const stars = document.querySelectorAll("#review-stars-picker i");
    stars.forEach(s => s.classList.add("selected"));

    // Toast Alert
    showToast("✨ Thank you! Your review is now featured in our Client Showcase.");
}

// ─────────────────────────────────────────────────────────────────────────────
// LUXURY JOURNAL (BLOG) STOREFRONT CONTROLLER
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_STORE_JOURNAL = [
    {
        id: "art-1",
        title: "The Architecture of Modern Zardozi Corsetry",
        category: "Couture Craft",
        author: "Satinder Kaur",
        date: "Aug 15, 2026",
        image: "images/heritage_craft.png",
        excerpt: "Exploring the delicate balance between structural internal boning and antique metal thread embroidery on raw Banarasi silks.",
        body: `Every bespoke corset crafted at Shapes By Satiinder Kaur begins as an architectural dialogue. We fuse centuries-old metal zardozi techniques with contemporary ergonomic boning, creating silhouettes that feel weightless while sculpting an iconic royal hourglass contour.
        
In our Mumbai boutique workshop, master artisans spend upwards of 120 hours meticulously setting antique metallic threads, dapka wire, and seed pearls onto handwoven silks. The result is a statement piece that bridges heirloom Indian craftsmanship with the clean lines of modern couture.

Whether styled over a fluid drape saree, paired with a layered palace lehenga skirt, or worn with tailored silk trousers for an evening gala, the zardozi corset remains the defining signature of the modern Indian woman.`,
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
        body: `A bridal trousseau is an heirloom investment that tells the story of a lifetime. When designing our Empress Crimson and Royal Velvet lehengas, we focus on modular versatility—allowing brides to re-style blouses with draped skirts or pair zardozi dupattas with contemporary pret drapes for future celebrations.

From selecting rich jewel tones that complement your wedding venue lighting to customizing neckline heights and sleeve embroidery, our private bridal consultations in Chembur ensure your bridal ensemble is uniquely yours.`,
        status: "published"
    }
];

function getStoreJournalArticles() {
    try {
        const stored = localStorage.getItem("shapes_journal_articles");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch(e) {}
    localStorage.setItem("shapes_journal_articles", JSON.stringify(DEFAULT_STORE_JOURNAL));
    return DEFAULT_STORE_JOURNAL;
}

function renderStoreJournal() {
    const grid = document.getElementById("store-journal-grid");
    if (!grid) return;

    const articles = getStoreJournalArticles();
    grid.innerHTML = articles.map(art => `
        <article class="journal-card" onclick="openArticleReader('${art.id}')">
            <div class="journal-card-img-wrapper">
                <img src="${art.image || 'images/heritage_craft.png'}" alt="${art.title}" loading="lazy">
                <span class="journal-category-tag">${art.category || 'Couture'}</span>
            </div>
            <div class="journal-card-content">
                <div class="journal-meta">By ${art.author || 'Satinder Kaur'} · ${art.date || 'Recent Story'}</div>
                <h3 class="journal-title">${art.title}</h3>
                <p class="journal-excerpt">${art.excerpt}</p>
                <span class="journal-read-link">Read Journal Story <i class="fa-solid fa-arrow-right-long"></i></span>
            </div>
        </article>
    `).join("");
}

function openArticleReader(id) {
    const articles = getStoreJournalArticles();
    const art = articles.find(a => a.id === id) || articles[0];
    if (!art) return;

    const container = document.getElementById("journal-reader-content");
    const modal = document.getElementById("journal-reader-modal");
    if (!container || !modal) return;

    container.innerHTML = `
        <div style="text-align:center; margin-bottom:2rem;">
            <span style="font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold); display:block; margin-bottom:8px;">${art.category}</span>
            <h2 style="font-family:var(--font-serif); font-size:2.4rem; color:var(--gold-light); font-weight:300; line-height:1.2; margin:0 0 1rem 0;">${art.title}</h2>
            <div style="font-size:11px; color:var(--grey-dark); text-transform:uppercase; letter-spacing:0.1em;">
                Words by <strong>${art.author}</strong> &nbsp;·&nbsp; ${art.date}
            </div>
        </div>

        <div style="width:100%; height:320px; border-radius:6px; overflow:hidden; margin-bottom:2rem; border:1px solid rgba(197,160,89,0.2);">
            <img src="${art.image || 'images/heritage_craft.png'}" style="width:100%; height:100%; object-fit:cover;" alt="${art.title}">
        </div>

        <div style="font-size:14px; line-height:1.9; color:rgba(255,255,255,0.85); font-family:var(--font-sans); white-space:pre-wrap; margin-bottom:2.5rem;">
${art.body}
        </div>

        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(197,160,89,0.25); border-radius:6px; padding:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div>
                <h4 style="font-family:var(--font-serif); font-size:1.3rem; color:var(--gold); margin:0 0 4px 0;">Experience Bespoke Couture</h4>
                <p style="font-size:11px; color:var(--grey); margin:0;">Book a private fitting session with designer Satinder Kaur.</p>
            </div>
            <a href="contact.html" class="primary-btn" style="padding:0.7rem 1.4rem; font-size:11px;">
                <i class="fa-solid fa-calendar-check"></i> Book Consultation
            </a>
        </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeArticleReader() {
    const modal = document.getElementById("journal-reader-modal");
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
}

// Global Window Exports
window.toggleWishlist = toggleWishlist;
window.openWishlistDrawer = openWishlistDrawer;
window.closeWishlistDrawer = closeWishlistDrawer;
window.setCurrency = setCurrency;
window.openProductDetail = openProductDetail;
window.openWriteReviewModal = openWriteReviewModal;
window.closeWriteReviewModal = closeWriteReviewModal;
window.filterClientReviews = filterClientReviews;
window.handleClientReviewSubmit = handleClientReviewSubmit;
window.openArticleReader = openArticleReader;
window.closeArticleReader = closeArticleReader;
window.renderStoreJournal = renderStoreJournal;



