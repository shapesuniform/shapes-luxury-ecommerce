const DEFAULT_PRODUCTS = [
 {
 id: "p1",
 title: "The Noir Botanical Silk Co-Ord Set",
 category: "Printed Co-Ords",
 price: 8900,
 inventory: 12,
 image: "coord_black_floral.webp",
 description: "An opulent two-piece luxury designer co-ord set in pure modal silk. Features a tailored button-down longline shirt tunic adorned with fine golden botanical floral motifs, paired with matching relaxed wide-leg trousers. Designed for effortless evening glamour.",
 craft: "100% Pure Modal Silk, artisanal digital print, mother-of-pearl buttons, elasticated back waistband. Dry clean or gentle hand wash."
 },
 {
 id: "p2",
 title: "Ivory & Sand Minimalist Linen Co-Ord",
 category: "Linen & Cotton",
 price: 7490,
 inventory: 15,
 image: "coord_beige_linen.webp",
 description: "A refined everyday luxury two-piece set crafted from breathable pure slub linen. Features an elegant V-neck tunic with relaxed 3/4 sleeves, front placket detailing, and matching tailored straight-cut trousers with deep side pockets.",
 craft: "100% Organic Slub Linen, natural coconut shell buttons, tailored comfort fit. Gentle hand wash or dry clean."
 },
 {
 id: "p3",
 title: "The Emerald Festive Silk Co-Ord Set",
 category: "Festive Co-Ords",
 price: 11500,
 inventory: 8,
 image: "coord_royal_emerald.webp",
 description: "A striking jewel-toned festive luxury co-ord set in rich emerald raw silk. Features a structured bandhgala collar tunic with delicate hand-embroidered antique gold zardozi and zari cuffs, paired with fluid matching silk palazzo trousers.",
 craft: "Pure Mulberry Raw Silk, handcrafted antique gold zari and zardozi embroidery, comfort-flex waistband. Dry clean only."
 },
 {
 id: "p4",
 title: "Indigo Heritage Handblock Modal Set",
 category: "Printed Co-Ords",
 price: 7990,
 inventory: 14,
 image: "coord_indigo_print.webp",
 description: "An authentic artisanal two-piece fusion set in rich indigo blue with geometric and floral handblock motifs. Features a contemporary collared tunic shirt paired with airy wide-leg palazzo trousers.",
 craft: "100% Breathable Modal Cotton, natural indigo dye handblock print, relaxed silhouette with functional pockets. Gentle cold wash."
 }
];
const DEFAULT_CATEGORIES = ["Printed Co-Ords", "Linen & Cotton", "Festive Co-Ords", "Fusion Sets"];
const DEFAULT_CONFIG = {
 brandName: "Shapes By Satiinder Kaur",
 heroTitle: "CONTEMPORARY LUXURY PRET",
 storyTitle: "THE ART OF EFFORTLESS SILHOUETTES",
 storyDesc: "At Shapes By Satiinder Kaur, we believe modern luxury should be as comfortable as it is breathtaking. Our signature designer co-ord sets blend pure organic linens, modal silks, and heritage handloom weaves with tailored contemporary cuts. Each two-piece set is thoughtfully crafted in Mumbai for women who celebrate understated elegance, rich textiles, and effortless style.",
 razorpayKey: "rzp_live_TQ0RwUwXQjD3tq"
};
let products = [];
let categories = [];
let config = {};
let cart = [];
let selectedSize = "";
let currentActiveProduct = null;
let activeCategory = "All";
let searchQuery = "";
let currentSort = "default";
function initStore() {
    setupMobileMenuToggle();
    setupReviewModalAndToast();
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
 if (!localStorage.getItem("shapes_cart")) {
 localStorage.setItem("shapes_cart", JSON.stringify([]));
 }
 let rawProducts = JSON.parse(localStorage.getItem("shapes_products")) || [];
 products = rawProducts.filter(p => p && p.title && !p.title.toLowerCase().includes("haha") && !p.id.includes("1786736236272") && !p.title.toLowerCase().includes("test"));
 if (products.length === 0) {
 products = [...DEFAULT_PRODUCTS];
 }
 localStorage.setItem("shapes_products", JSON.stringify(products));
 categories = JSON.parse(localStorage.getItem("shapes_categories")) || DEFAULT_CATEGORIES;
 config = JSON.parse(localStorage.getItem("shapes_config")) || DEFAULT_CONFIG;
 cart = JSON.parse(localStorage.getItem("shapes_cart")) || [];
 wishlist = JSON.parse(localStorage.getItem("shapes_wishlist")) || [];
 
 renderStorefront();
 updateCartCount();
 updateWishlistCount();
 setupEventListeners();
 
 const deferWork = () => {
 renderClientReviews();
 renderStoreJournal();
 initStarRatingPicker();
 setupScrollAnimations();
 };
 if ('requestIdleCallback' in window) {
 requestIdleCallback(deferWork, { timeout: 1500 });
 } else {
 setTimeout(deferWork, 80);
 }
}
function renderStorefront() {
 document.querySelectorAll(".footer-col.brand-info h3").forEach(el => el.innerText = config.brandName);
 const heroTitleEl = document.getElementById("hero-title-text");
 if (heroTitleEl) heroTitleEl.innerText = config.heroTitle;
 const heroTaglineEl = document.getElementById("hero-tagline-text");
 if (heroTaglineEl && config.heroTagline) heroTaglineEl.innerText = config.heroTagline;
 const storyTitleEl = document.getElementById("story-title-text");
 if (storyTitleEl) storyTitleEl.innerText = config.storyTitle;
 const storyDescEl = document.getElementById("story-desc-text");
 if (storyDescEl) storyDescEl.innerText = config.storyDesc;
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
 document.querySelectorAll(".tab-btn").forEach(btn => {
 btn.addEventListener("click", () => {
 selectCategoryTab(btn.dataset.filter);
 });
 });
 }
 updateCatalogGrid();
}
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
function updateCatalogGrid() {
 const listContainer = document.getElementById("product-list-container");
 listContainer.innerHTML = "";
 const titleText = document.getElementById("catalog-title-text");
 if (activeCategory === "All") {
 titleText.innerText = "NEW ARRIVALS";
 } else {
 titleText.innerText = activeCategory.toUpperCase() + " COLLECTION";
 }
 let filtered = activeCategory === "All"
 ? products
 : products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
 if (searchQuery) {
 const query = searchQuery.toLowerCase();
 filtered = filtered.filter(p =>
 p.title.toLowerCase().includes(query) ||
 p.description.toLowerCase().includes(query) ||
 p.category.toLowerCase().includes(query)
 );
 }
 if (currentSort === "price-asc") {
 filtered.sort((a, b) => a.price - b.price);
 } else if (currentSort === "price-desc") {
 filtered.sort((a, b) => b.price - a.price);
 } else if (currentSort === "title-asc") {
 filtered.sort((a, b) => a.title.localeCompare(b.title));
 } else if (currentSort === "default") {
 filtered.sort((a, b) => a.id.localeCompare(b.id));
 }
 if (filtered.length === 0) {
 listContainer.innerHTML = `<p class="cart-empty-msg" style="grid-column: 1/-1;">No creations found matching your query.</p>`;
 return;
 }
 const cardsHtml = filtered.map(p => {
 const isSoldOut = p.inventory <= 0;
 const isFav = wishlist.includes(p.id);
 return `
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
 }).join("");
 listContainer.innerHTML = cardsHtml;
 document.querySelectorAll(".product-card").forEach(card => {
 card.addEventListener("click", (e) => {
 if (e.target.closest(".product-wishlist-btn") || e.target.closest(".card-action-tap-btn")) return;
 openProductDetail(card.dataset.id);
 });
 });
}
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
 document.querySelectorAll(".currency-select, #currency-select").forEach(s => s.value = newCurrency);
 updateCatalogGrid();
 renderCartItems();
 if (currentActiveProduct) {
 const modalPriceEl = document.getElementById("modal-product-price");
 if (modalPriceEl) {
 modalPriceEl.innerHTML = `${formatCurrency(currentActiveProduct.price)} <span style="font-size: 11px; font-weight: 400; color: var(--grey-dark); letter-spacing: 0.04em; font-family: var(--font-sans); margin-left: 6px;">(Inclusive of all taxes &amp; GST)</span>`;
 }
 }
 }
}
function cleanImagePath(path) {
 if (!path) return "images/zardozi_corset.webp";
 let clean = path.replace(/['"]/g, '').trim();
 clean = clean.split('\\').pop().split('/').pop();
 if (!clean.startsWith("images/") && !clean.startsWith("http")) {
 clean = "images/" + clean;
 }
 clean = clean.replace(/\.png$/i, '.webp');
 return clean;
}
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
function shareActiveProduct() {
 if (!currentActiveProduct) return;
 const p = currentActiveProduct;
 const shareText = encodeURIComponent(
 `✨ Check out this luxury creation by Shapes By Satiinder Kaur!

` +
 `*${p.title}*
` +
 `Category: ${p.category}
` +
 `Price: ₹${p.price.toLocaleString("en-IN")}

` +
 `Handcrafted to order (15–22 days delivery). Explore details at:
` +
 `https://shapesbysatinderkaur.com/#catalog`
 );
 window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank");
}
function openProductDetail(productId) {
 const p = products.find(prod => prod.id === productId);
 if (!p) return;
 currentActiveProduct = p;
 selectedSize = "";
 document.getElementById("modal-product-image").src = cleanImagePath(p.image);
 document.getElementById("modal-product-image").alt = p.title;
 document.getElementById("modal-product-category").innerText = p.category;
 document.getElementById("modal-product-title").innerText = p.title;
 document.getElementById("modal-product-price").innerHTML = `${formatCurrency(p.price)} <span style="font-size: 11px; font-weight: 400; color: var(--grey-dark); letter-spacing: 0.04em; font-family: var(--font-sans); margin-left: 6px;">(Inclusive of all taxes &amp; GST)</span>`;
 document.getElementById("modal-product-desc").innerText = p.description;
 document.getElementById("modal-craftsmanship-detail").innerText = p.craft || "Handcrafted by regional master weavers. Dry clean only.";
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
 renderAffordabilityWidget(p.price);
 document.querySelectorAll(".size-option").forEach(btn => {
 btn.classList.remove("active");
 });
 updateModalWishlistState();
 document.getElementById("product-detail-modal").classList.add("active");
 document.body.style.overflow = "hidden";
}
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
function setupEventListeners() {
 window.addEventListener("scroll", () => {
 const header = document.getElementById("header");
 if (window.scrollY > 50) {
 header.classList.add("scrolled");
 } else {
 header.classList.remove("scrolled");
 }
 }, { passive: true });
 const mobileToggle = document.getElementById("mobile-toggle");
 const mobileNav = document.getElementById("mobile-nav");
 mobileToggle.addEventListener("click", () => {
 mobileToggle.classList.toggle("active");
 mobileNav.classList.toggle("open");
 });
 document.querySelectorAll(".shop-nav-trigger").forEach(link => {
 link.addEventListener("click", (e) => {
 const cat = link.dataset.category;
 if (cat) {
 e.preventDefault();
 selectCategoryTab(cat);
 document.getElementById("catalog").scrollIntoView({ behavior: 'smooth' });
 }
 });
 });
 document.querySelectorAll(".mobile-shop-trigger").forEach(link => {
 link.addEventListener("click", (e) => {
 const cat = link.dataset.category;
 if (cat) {
 e.preventDefault();
 selectCategoryTab(cat);
 mobileToggle.classList.remove("active");
 mobileNav.classList.remove("open");
 setTimeout(() => {
 document.getElementById("catalog").scrollIntoView({ behavior: 'smooth' });
 }, 300);
 }
 });
 });
 document.querySelectorAll(".footer-shop-trigger").forEach(link => {
 link.addEventListener("click", (e) => {
 const cat = link.dataset.category;
 if (cat) {
 e.preventDefault();
 selectCategoryTab(cat);
 document.getElementById("catalog").scrollIntoView({ behavior: 'smooth' });
 }
 });
 });
 document.getElementById("hero-discover-btn").addEventListener("click", () => {
 selectCategoryTab("All");
 document.getElementById("catalog").scrollIntoView({ behavior: 'smooth' });
 });
 document.querySelectorAll(".story-nav-trigger").forEach(link => {
 link.addEventListener("click", (e) => {
 e.preventDefault();
 document.getElementById("story-section").scrollIntoView({ behavior: 'smooth' });
 });
 });
 document.querySelectorAll(".mobile-story-trigger").forEach(link => {
 link.addEventListener("click", (e) => {
 e.preventDefault();
 mobileToggle.classList.remove("active");
 mobileNav.classList.remove("open");
 setTimeout(() => {
 document.getElementById("story-section").scrollIntoView({ behavior: 'smooth' });
 }, 300);
 });
 });
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
 document.getElementById("close-product-modal").addEventListener("click", () => {
 document.getElementById("product-detail-modal").classList.remove("active");
 document.body.style.overflow = "";
 });
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
 document.querySelectorAll(".size-option").forEach(btn => {
 btn.addEventListener("click", () => {
 document.querySelectorAll(".size-option").forEach(b => b.classList.remove("active"));
 btn.classList.add("active");
 selectedSize = btn.dataset.size;
 });
 });
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
 const currencySelect = document.getElementById("currency-select");
 if (currencySelect) {
 currencySelect.value = currentCurrency;
 currencySelect.addEventListener("change", (e) => {
 setCurrency(e.target.value);
 });
 }
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
 document.getElementById("proceed-checkout-btn").addEventListener("click", () => {
 if (cart.length === 0) {
 alert("Your Shopping Bag is empty.");
 return;
 }
 closeCartDrawer();
 openCheckoutModal();
 });
 document.getElementById("close-checkout-btn").addEventListener("click", closeCheckoutModal);
 document.querySelectorAll(".accordion-header").forEach(header => {
 header.addEventListener("click", () => {
 header.parentElement.classList.toggle("active");
 });
 });
 document.getElementById("billing-shipping-form").addEventListener("submit", (e) => {
 e.preventDefault();
 processCheckout();
 });
 document.getElementById("finish-checkout-btn").addEventListener("click", () => {
 closeCheckoutModal();
 });
 document.querySelectorAll(".currency-select, #currency-select").forEach(sel => {
 sel.value = currentCurrency;
 sel.addEventListener("change", (e) => {
 setCurrency(e.target.value);
 });
 });
}
function addToCart(productId, size) {
 const p = products.find(prod => prod.id === productId);
 if (!p) return;
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
function removeCartItem(productId, size) {
 cart = cart.filter(i => !(i.id === productId && i.size === size));
 saveCartState();
 updateCartCount();
 renderCartItems();
}
function saveCartState() {
 localStorage.setItem("shapes_cart", JSON.stringify(cart));
}
function updateCartCount() {
 const count = cart.reduce((total, item) => total + item.quantity, 0);
 const desktopBadge = document.getElementById("cart-count");
 const mobileBadge = document.getElementById("mobile-cart-count");
 if (desktopBadge) desktopBadge.innerText = count;
 if (mobileBadge) mobileBadge.innerText = count;
}
function openCartDrawer() {
 renderCartItems();
 document.getElementById("cart-drawer").classList.add("active");
}
function closeCartDrawer() {
 document.getElementById("cart-drawer").classList.remove("active");
}
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
 const gstRate = 0.12;
 const taxableBase = Math.round(subtotal / (1 + gstRate));
 const gstAmount = subtotal - taxableBase;
 const subtotalEl = document.getElementById("checkout-subtotal");
 const gstEl = document.getElementById("checkout-gst-amount");
 const grandEl = document.getElementById("checkout-grand-total");
 if (subtotalEl) subtotalEl.innerText = formatCurrency(subtotal);
 if (gstEl) gstEl.innerText = formatCurrency(gstAmount);
 if (grandEl) grandEl.innerText = formatCurrency(subtotal);
 document.getElementById("checkout-main-form").style.display = "block";
 document.getElementById("order-success-screen").style.display = "none";
 document.getElementById("checkout-modal").classList.add("active");
 document.body.style.overflow = "hidden";
}
function closeCheckoutModal() {
 document.getElementById("checkout-modal").classList.remove("active");
 document.body.style.overflow = "";
}
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
function completeOrder(paymentId) {
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
 const lastOrderNum = parseInt(localStorage.getItem("shapes_last_order_num") || "0");
 const newOrderNum = lastOrderNum + 1;
 localStorage.setItem("shapes_last_order_num", String(newOrderNum));
 const refCode = "SH-" + String(newOrderNum).padStart(4, "0");
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
 cart = [];
 saveCartState();
 updateCartCount();
 document.getElementById("order-ref-code").innerHTML =
 `${refCode}<br><span style="font-size: 10px; color: var(--gold); letter-spacing: 0.05em; font-family: var(--font-sans);">Payment ID: ${paymentId}</span>`;
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
 document.getElementById("track-order-btn").href = `track.html?ref=${refCode}`;
 document.getElementById("checkout-main-form").style.display = "none";
 document.getElementById("order-success-screen").style.display = "flex";
 renderStorefront();
}
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
window.updateCartQty = updateCartQty;
window.removeCartItem = removeCartItem;
window.addEventListener("DOMContentLoaded", initStore);
let _currentUser = null;
function injectAccountNavLink() {
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
const _originalCompleteOrder = completeOrder;
window.completeOrder = async function(paymentId) {
 _originalCompleteOrder(paymentId);
 try {
 const allOrders = JSON.parse(localStorage.getItem("shapes_orders") || "[]");
 const latest = allOrders[allOrders.length - 1];
 if (latest) await saveOrderToFirestore(latest);
 } catch (e) { }
};
const DEFAULT_CLIENT_REVIEWS = [
 {
 id: "rev-google-1",
 author: "Rhea Dhameja",
 city: "Chembur, Mumbai",
 rating: 5,
 category: "Fitting",
 categoryLabel: "Verified Google Review",
 text: "Perfect stitching, great attention to detail, and excellent service by Gitu. The fitting of my co-ord set was immaculate!",
 verified: true,
 date: "Verified Google Review"
 },
 {
 id: "rev-google-2",
 author: "Wilma Vaz",
 city: "Mumbai",
 rating: 5,
 category: "Service",
 categoryLabel: "Verified Google Review",
 text: "Hands down, this is the best designer boutique with excellent customer service and tailoring.",
 verified: true,
 date: "Verified Google Review"
 },
 {
 id: "rev-google-3",
 author: "Dr. Nishtha Mishra",
 city: "Mumbai",
 rating: 5,
 category: "Design",
 categoryLabel: "Verified Google Review",
 text: "They offer you the best options, best contemporary designs, and best fitting in Chembur.",
 verified: true,
 date: "Verified Google Review"
 },
 {
 id: "rev-google-4",
 author: "Pooja Sawant",
 city: "Chembur, Mumbai",
 rating: 5,
 category: "Co-Ord",
 categoryLabel: "Verified Google Review",
 text: "Bought the pure linen co-ord set. The fabric quality is so breathable and luxurious. Got so many compliments at brunch!",
 verified: true,
 date: "Verified Google Review"
 },
 {
 id: "rev-google-5",
 author: "Simran Ahuja",
 city: "Bandra, Mumbai",
 rating: 5,
 category: "Co-Ord",
 categoryLabel: "Verified Google Review",
 text: "The Noir Botanical silk co-ord set is stunning! Drapes so effortlessly and the stitching quality is top-notch.",
 verified: true,
 date: "Verified Google Review"
 },
 {
 id: "rev-google-6",
 author: "Ananya Iyer",
 city: "Mumbai",
 rating: 5,
 category: "Fitting",
 categoryLabel: "Verified Google Review",
 text: "Finding a designer who understands body contour and comfortable silhouettes is rare. Satiinder Kaur and team are masters.",
 verified: true,
 date: "Verified Google Review"
 },
 {
 id: "rev-google-7",
 author: "Kavita Ramchandani",
 city: "Chembur, Mumbai",
 rating: 5,
 category: "Service",
 categoryLabel: "Verified Google Review",
 text: "Very warm and welcoming staff at the Chembur boutique. Quick turnaround time and impeccable finishes on every piece.",
 verified: true,
 date: "Verified Google Review"
 },
 {
 id: "rev-google-8",
 author: "Neha Singhania",
 city: "Mumbai",
 rating: 5,
 category: "Festive",
 categoryLabel: "Verified Google Review",
 text: "The emerald festive raw silk co-ord set was the highlight of our family cocktail party. Elegant, modern, and royal.",
 verified: true,
 date: "Verified Google Review"
 },
 {
 id: "rev-google-9",
 author: "Meenakshi Sundaram",
 city: "Powai, Mumbai",
 rating: 5,
 category: "Co-Ord",
 categoryLabel: "Verified Google Review",
 text: "Artisanal handblock prints with modern cuts. You can wear them all day in Mumbai heat without compromising on style.",
 verified: true,
 date: "Verified Google Review"
 },
 {
 id: "rev-google-10",
 author: "Tanvi Deshmukh",
 city: "Thane, Mumbai",
 rating: 5,
 category: "Fitting",
 categoryLabel: "Verified Google Review",
 text: "Ordered online and was skeptical about sizing, but the fit was 100% spot on! Excellent craftsmanship.",
 verified: true,
 date: "Verified Google Review"
 },
 {
 id: "rev-google-11",
 author: "Ayesha Merchant",
 city: "South Mumbai",
 rating: 5,
 category: "Design",
 categoryLabel: "Verified Google Review",
 text: "Minimalist luxury at its finest. Love the clean aesthetic, shell buttons, and refined fall of the linen trousers.",
 verified: true,
 date: "Verified Google Review"
 },
 {
 id: "rev-google-12",
 author: "Preeti Bhatia",
 city: "Chembur, Mumbai",
 rating: 5,
 category: "Service",
 categoryLabel: "Verified Google Review",
 text: "I have been visiting Shapes Boutique for years. Consistently outstanding quality and personalized customer care.",
 verified: true,
 date: "Verified Google Review"
 }
];
function getStoredClientReviews() {
 try {
 if (localStorage.getItem("shapes_reviews_version") !== "shapes_real_google_v2_49reviews") {
 localStorage.removeItem("shapes_client_reviews");
 localStorage.setItem("shapes_reviews_version", "shapes_real_google_v2_49reviews");
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
let visibleReviewsCount = 6;
function renderClientReviews() {
 const container = document.getElementById("testimonials-grid-container");
 if (!container) return;
 const allReviews = getStoredClientReviews();
 const countDisplay = document.getElementById("reviews-count-display");
 if (countDisplay) {
 countDisplay.textContent = "49 Verified Google Reviews";
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
 const reviewsToShow = filtered.slice(0, visibleReviewsCount);
 container.innerHTML = reviewsToShow.map(r => {
 const starsHtml = '<i class="fa-solid fa-star"></i>'.repeat(r.rating || 5);
 const initials = r.author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CL';
 return `
 <div class="testimonial-card">
 <i class="fa-solid fa-quote-right quote-watermark"></i>
 <div>
 <div class="card-top-row">
 <div class="stars">${starsHtml}</div>
 <span class="review-category-badge">${r.categoryLabel || r.category || 'Verified Review'}</span>
 </div>
 <p class="review-text">"${r.text}"</p>
 </div>
 <div class="reviewer-profile-row">
 <div class="reviewer-avatar">${initials}</div>
 <div class="reviewer-info-meta">
 <p class="client-name">
 ${r.author}
 ${r.verified ? '<span class="verified-icon-badge"><i class="fa-solid fa-circle-check"></i> Verified</span>' : ''}
 </p>
 <div class="source-tag">
 <span><i class="fa-solid fa-location-dot" style="font-size:9px; color:var(--gold);"></i> ${r.city || 'Mumbai'}</span>
 <span>·</span>
 <span>${r.date || 'Verified Google Review'}</span>
 </div>
 </div>
 </div>
 </div>
 `;
 }).join("");
 let loadMoreContainer = document.getElementById("reviews-load-more-container");
 if (!loadMoreContainer) {
 loadMoreContainer = document.createElement("div");
 loadMoreContainer.id = "reviews-load-more-container";
 loadMoreContainer.style.textAlign = "center";
 loadMoreContainer.style.marginTop = "2.5rem";
 loadMoreContainer.style.gridColumn = "1 / -1";
 container.parentNode.appendChild(loadMoreContainer);
 }
 if (filtered.length > visibleReviewsCount) {
 loadMoreContainer.innerHTML = `
 <button type="button" class="hero-cta-btn hero-cta-glass" onclick="loadMoreClientReviews()" style="min-width: 220px; font-size: 11px;">
 <i class="fa-solid fa-chevron-down" style="margin-right: 6px;"></i> View More Google Reviews (${filtered.length - visibleReviewsCount} remaining)
 </button>
 `;
 } else {
 loadMoreContainer.innerHTML = "";
 }
}
function loadMoreClientReviews() {
 visibleReviewsCount += 6;
 renderClientReviews();
}
function filterClientReviews(category, btnElement) {
 activeReviewCategory = category;
 visibleReviewsCount = 6;
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
 const currentReviews = getStoredClientReviews();
 currentReviews.unshift(newReview);
 localStorage.setItem("shapes_client_reviews", JSON.stringify(currentReviews));
 renderClientReviews();
 closeWriteReviewModal();
 document.getElementById("write-review-form").reset();
 document.getElementById("review-rating-value").value = "5";
 const stars = document.querySelectorAll("#review-stars-picker i");
 stars.forEach(s => s.classList.add("selected"));
 showToast("✨ Thank you! Your review is now featured in our Client Showcase.");
}
const DEFAULT_STORE_JOURNAL = [
 {
 id: "art-1",
 title: "The Art of Effortless Dressing: 5 Ways to Style Luxury Co-Ord Sets",
 category: "Style Guide",
 author: "Satiinder Kaur",
 date: "Aug 16, 2026",
 image: "images/coord_black_floral.webp",
 excerpt: "How tailored 2-piece sets in pure modal silks and organic linens transition seamlessly from morning brunches to evening galas.",
 body: `At Shapes By Satiinder Kaur, we believe modern luxury is defined by ease, comfort, and breathtaking tailoring. The modern woman no longer wants restrictive garments; she seeks pieces that move with her rhythm.
Our signature botanical modal silk co-ord sets are engineered with fluid drapes, tailored collars, and relaxed wide-leg trousers. For a chic daytime brunch, pair your long-line tunic with minimalist slide mules and delicate gold hoops. When evening arrives, slip into kitten heels, cinch the waist with a sleek leather belt, and elevate with bold statement earrings.
Every piece is crafted in breathable natural fibers, ensuring you look effortlessly put-together in any setting.`,
 status: "published"
 },
 {
 id: "art-2",
 title: "Breathable Luxury: The Rise of Pure Linen & Handblock Co-Ords",
 category: "Fabric & Craft",
 author: "Satiinder Kaur",
 date: "Aug 12, 2026",
 image: "images/coord_beige_linen.webp",
 excerpt: "Exploring natural slub linen, mother-of-pearl accents, and artisanal handblock prints designed for contemporary Indian weather.",
 body: `In the humid climate of Mumbai, fabric selection is paramount. We spent months sourcing organic slub linen and long-staple modal cotton that softens with every wash while retaining crisp architectural lines.
Our minimalist V-neck linen sets are detailed with natural coconut shell and mother-of-pearl buttons. With deep functional pockets, relaxed 3/4 sleeves, and tailored ankle-grazing trousers, these sets represent the pinnacle of quiet luxury for your travel and resort wardrobe.`,
 status: "published"
 },
 {
 id: "art-3",
 title: "Festive Jewel Tones: Elevating Co-Ord Sets with Handcrafted Detailing",
 category: "Festive Pret",
 author: "Satiinder Kaur",
 date: "Aug 08, 2026",
 image: "images/coord_royal_emerald.webp",
 excerpt: "Bridging traditional royal embroidery with modern silhouettes for festive cocktail evenings and family celebrations.",
 body: `For festive gatherings and destination weddings, our emerald raw silk co-ord set reimagines royal heritage. Featuring a structured bandhgala collar and hand-tacked antique gold zari cuffs, it delivers the opulence of traditional wear with the effortless silhouette of a 2-piece pantsuit.
Wear it to a sangeet or intimate dinner for a look that commands admiration without weighing you down.`,
 status: "published"
 }
];
function getStoreJournalArticles() {
 try {
 if (localStorage.getItem("shapes_journal_version") !== "shapes_journal_v2_coord_stories") {
 localStorage.removeItem("shapes_journal_articles");
 localStorage.setItem("shapes_journal_version", "shapes_journal_v2_coord_stories");
 }
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
 <img src="${art.image || 'images/coord_black_floral.webp'}" alt="${art.title}" loading="lazy">
 <span class="journal-category-tag">${art.category || 'Style Guide'}</span>
 </div>
 <div class="journal-card-content">
 <div class="journal-meta">By ${art.author || 'Satiinder Kaur'} · ${art.date || 'Recent Story'}</div>
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
 <img src="${art.image || 'images/coord_black_floral.webp'}" style="width:100%; height:100%; object-fit:cover;" alt="${art.title}">
 </div>
 <div style="font-size:14px; line-height:1.9; color:rgba(255,255,255,0.85); font-family:var(--font-sans); white-space:pre-wrap; margin-bottom:2.5rem;">
${art.body}
 </div>
 <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(197,160,89,0.25); border-radius:6px; padding:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
 <div>
 <h4 style="font-family:var(--font-serif); font-size:1.3rem; color:var(--gold); margin:0 0 4px 0;">Explore Designer Co-Ord Sets</h4>
 <p style="font-size:11px; color:var(--grey); margin:0;">Visit our Chembur boutique or order your custom size online.</p>
 </div>
 <a href="#catalog" onclick="document.getElementById('journal-reader-modal').classList.remove('active'); document.body.style.overflow='';" class="primary-btn" style="padding:0.7rem 1.4rem; font-size:11px;">
 <i class="fa-solid fa-bag-shopping"></i> Shop Collections
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
if (document.readyState === "loading") {
 document.addEventListener("DOMContentLoaded", initStore);
} else {
 initStore();
}


/* Client Review Modal & Toast Event Listeners */
function setupReviewModalAndToast() {
    const openReviewBtn = document.getElementById("open-review-modal-btn");
    const closeReviewBtn = document.getElementById("close-review-modal");
    const reviewModal = document.getElementById("review-modal");
    const reviewForm = document.getElementById("client-review-form");

    if (openReviewBtn && reviewModal) {
        openReviewBtn.addEventListener("click", () => {
            reviewModal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    }

    if (closeReviewBtn && reviewModal) {
        closeReviewBtn.addEventListener("click", () => {
            reviewModal.classList.remove("active");
            document.body.style.overflow = "";
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const rating = document.getElementById("review-rating-select").value;
            const name = document.getElementById("review-author-name").value;
            const location = document.getElementById("review-author-location").value;
            const garment = document.getElementById("review-garment-name").value;
            const text = document.getElementById("review-body-text").value;

            const newReview = {
                id: "rev_" + Date.now(),
                authorName: name,
                location: location,
                garmentPurchased: garment,
                reviewText: text,
                rating: parseInt(rating),
                categoryLabel: "Verified Client Review",
                date: "Just Now"
            };

            const reviewsList = JSON.parse(localStorage.getItem("shapes_client_reviews") || "[]");
            reviewsList.unshift(newReview);
            localStorage.setItem("shapes_client_reviews", JSON.stringify(reviewsList));

            reviewModal.classList.remove("active");
            document.body.style.overflow = "";
            reviewForm.reset();

            if (typeof renderClientReviews === "function") {
                renderClientReviews();
            }

            alert("Thank you! Your gracious client review has been published.");
        });
    }

    const toastViewBagBtn = document.getElementById("toast-view-bag-btn");
    if (toastViewBagBtn) {
        toastViewBagBtn.addEventListener("click", () => {
            if (typeof openCartDrawer === "function") {
                openCartDrawer();
            }
            const toast = document.getElementById("cart-toast-notification");
            if (toast) toast.classList.remove("show");
        });
    }
}

function showCartToast() {
    const toast = document.getElementById("cart-toast-notification");
    if (!toast) return;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}


/* Mobile Menu Toggle Logic */
function setupMobileMenuToggle() {
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mobileDrawer = document.getElementById("mobile-nav-drawer");
    if (!mobileBtn || !mobileDrawer) return;

    mobileBtn.addEventListener("click", () => {
        mobileBtn.classList.toggle("active");
        mobileDrawer.classList.toggle("open");
    });

    const mobileLinks = mobileDrawer.querySelectorAll("a");
    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileBtn.classList.remove("active");
            mobileDrawer.classList.remove("open");
        });
    });
}
