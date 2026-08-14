// SHAPES Luxury Showroom - Customer Core Logic & State Management

// Default Initial Data (Falls back to this if LocalStorage is empty)
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
        title: "Banarasi Brocade Sweetheart Corset",
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
    brandName: "Shapes By Satinder Kaur",
    heroTitle: "THE STRUCTURE OF HERITAGE",
    storyTitle: "RE-IMAGINING THE CORSET",
    storyDesc: "Every creation at Shapes By Satinder Kaur begins as a dialogue between structural precision and heritage handlooms. We fuse classical Western corsetry with opulent Indian fabrics. Our master craftsmen hand-embroider raw silks, Banarasi brocades, and heavy velvets with antique zardozi wires, molding structural silhouettes that contour the modern form. We celebrate heritage that refuses to remain in the past, transforming ancient handlooms into bold contemporary treasures."
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
    // Check and migrate from old structures to new Indo-Western structures
    if (localStorage.getItem("shapes_currency_version") !== "satinder_kaur_v2") {
        localStorage.clear();
        localStorage.setItem("shapes_currency_version", "satinder_kaur_v2");
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

    products = JSON.parse(localStorage.getItem("shapes_products"));
    categories = JSON.parse(localStorage.getItem("shapes_categories"));
    config = JSON.parse(localStorage.getItem("shapes_config"));
    cart = JSON.parse(localStorage.getItem("shapes_cart"));

    // Render elements
    renderStorefront();
    updateCartCount();
    setupEventListeners();
    setupScrollAnimations();
}

// Render storefront elements
function renderStorefront() {
    // 1. Text elements config
    document.querySelectorAll(".footer-col.brand-info h3").forEach(el => el.innerText = config.brandName);
    document.getElementById("hero-title-text").innerText = config.heroTitle;
    document.getElementById("story-title-text").innerText = config.storyTitle;
    document.getElementById("story-desc-text").innerText = config.storyDesc;

    // 2. Render Horizontal Category Filter Tabs in Catalog Section
    const tabsContainer = document.getElementById("catalog-tabs-container");
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

    // 3. Render Catalog Grid (Initially filtered by active values)
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
        const cardHtml = `
            <div class="product-card" data-id="${p.id}">
                <div class="product-card-img-wrapper">
                    ${isSoldOut ? '<span class="sold-out-badge">Retired / Sold Out</span>' : ''}
                    <img src="${p.image}" alt="${p.title}">
                    <div class="product-card-quickview">Quick Inspection</div>
                </div>
                <div class="product-card-info">
                    <span class="product-card-category">${p.category}</span>
                    <h3 class="product-card-title">${p.title}</h3>
                    <span class="product-card-price">${formatCurrency(p.price)}</span>
                </div>
            </div>
        `;
        listContainer.innerHTML += cardHtml;
    });

    // Add card click listeners
    document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", () => {
            openProductDetail(card.dataset.id);
        });
    });
}

// Currency formatter
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Open Product Detail Modal
function openProductDetail(productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    currentActiveProduct = p;
    selectedSize = "";

    // Set Modal content
    document.getElementById("modal-product-image").src = p.image;
    document.getElementById("modal-product-image").alt = p.title;
    document.getElementById("modal-product-category").innerText = p.category;
    document.getElementById("modal-product-title").innerText = p.title;
    document.getElementById("modal-product-price").innerText = formatCurrency(p.price);
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
        stockContainer.innerHTML = `<span class="stock-dot stock-low"></span> Only ${p.inventory} pieces left in Atelier`;
        addToCartBtn.disabled = false;
        addToCartBtn.innerText = "ADD TO BAG";
    } else {
        stockContainer.innerHTML = `<span class="stock-dot stock-in"></span> Creation Available`;
        addToCartBtn.disabled = false;
        addToCartBtn.innerText = "ADD TO BAG";
    }

    // Reset size selectors
    document.querySelectorAll(".size-option").forEach(btn => {
        btn.classList.remove("active");
    });

    document.getElementById("product-detail-modal").classList.add("active");
    document.body.style.overflow = "hidden";
}

// Setup Event Listeners
function setupEventListeners() {
    // 1. Header scroll animation
    window.addEventListener("scroll", () => {
        const header = document.getElementById("header");
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

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

    // Bag drawer triggers
    document.getElementById("open-cart-btn").addEventListener("click", openCartDrawer);
    document.getElementById("close-cart-btn").addEventListener("click", closeCartDrawer);
    document.getElementById("cart-drawer").addEventListener("click", (e) => {
        if (e.target.id === "cart-drawer") closeCartDrawer();
    });

    // Checkout trigger
    document.getElementById("proceed-checkout-btn").addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your Atelier Bag is empty.");
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
        alert(`Bespoke designer note: Only ${p.inventory} pieces of this creation are currently crafted.`);
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

// Cart badge counts
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").innerText = count;
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
                    <img src="${p.image}" alt="${p.title}">
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

    document.getElementById("checkout-subtotal").innerText = formatCurrency(subtotal);
    document.getElementById("checkout-grand-total").innerText = formatCurrency(subtotal);

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
function processCheckout() {
    // 1. Deduct products stock
    cart.forEach(item => {
        const p = products.find(prod => prod.id === item.id);
        if (p) {
            p.inventory = Math.max(0, p.inventory - item.quantity);
        }
    });

    // Save product stock updates
    localStorage.setItem("shapes_products", JSON.stringify(products));

    // Clear cart state
    cart = [];
    saveCartState();
    updateCartCount();

    // 2. Generate random order ref
    const refCode = "SH-" + Math.floor(100000 + Math.random() * 900000);
    document.getElementById("order-ref-code").innerText = refCode;

    // 3. Show Success Screen
    document.getElementById("checkout-main-form").style.display = "none";
    document.getElementById("order-success-screen").style.display = "flex";

    // 4. Re-render storefront
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

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(reg => console.log("Service Worker registered successfully:", reg.scope))
            .catch(err => console.log("Service Worker registration failed:", err));
    });
}
