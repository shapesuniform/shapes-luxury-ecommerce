/* ============================================================
   SHAPES BY SATIINDER KAUR — MASTER STORE ENGINE & EVENT DELEGATION
   ============================================================ */

const DEFAULT_PRODUCTS = [
  {
    id: "coord_1",
    title: "The Noir Botanical Silk Set",
    category: "Printed Co-Ords",
    price: 8500,
    badge: "BESTSELLER",
    image: "images/coord_black_floral.webp",
    description: "Handcrafted 2-piece co-ord set in pure modal silk featuring bespoke floral motifs, relaxed collar silhouette, and tailored wide-leg trousers."
  },
  {
    id: "coord_2",
    title: "Ivory & Sand Linen Set",
    category: "Linen & Cotton",
    price: 7800,
    badge: "NEW ARRIVAL",
    image: "images/coord_beige_linen.webp",
    description: "Breathable natural slub linen co-ord set with mother-of-pearl buttons, tailored shirt collar, and comfortable cropped trouser fit."
  },
  {
    id: "coord_3",
    title: "The Emerald Festive Silk Set",
    category: "Festive Co-Ords",
    price: 9400,
    badge: "LUXURY PRET",
    image: "images/coord_royal_emerald.webp",
    description: "Rich emerald green modal silk ensemble adorned with subtle zardozi highlight embroidery on cuffs and lapels. Ideal for festive evenings."
  },
  {
    id: "coord_4",
    title: "Indigo Heritage Handblock Modal Set",
    category: "Fusion Sets",
    price: 7200,
    badge: "HANDBLOCK",
    image: "images/coord_indigo_print.webp",
    description: "Artisanal handblock printed modal silk co-ord set with contemporary tunic collar and fluid silhouette designed for all-day comfort."
  }
];

const DEFAULT_CATEGORIES = ["NEW ARRIVALS", "Printed Co-Ords", "Linen & Cotton", "Festive Co-Ords", "Fusion Sets"];

const DEFAULT_CLIENT_REVIEWS = [
  {
    id: "rev_1",
    authorName: "Rhea Dhameja",
    location: "Chembur, Mumbai",
    garmentPurchased: "The Noir Botanical Silk Co-Ord Set",
    reviewText: "Perfect stitching, great attention to detail, and excellent service by Satiinder Kaur. The fitting of my co-ord set was immaculate!",
    rating: 5,
    categoryLabel: "Verified Google Review",
    date: "Verified Google Review"
  },
  {
    id: "rev_2",
    authorName: "Wilma Vaz",
    location: "Mumbai",
    garmentPurchased: "Ivory & Sand Linen Co-Ord Set",
    reviewText: "Hands down, this is the best designer boutique with excellent customer service and tailoring in Chembur.",
    rating: 5,
    categoryLabel: "Verified Google Review",
    date: "Verified Google Review"
  },
  {
    id: "rev_3",
    authorName: "Dr. Nishtha Mishra",
    location: "Mumbai",
    garmentPurchased: "Designer Pret Collection",
    reviewText: "They offer you the best options, best contemporary designs, and best fitting in Chembur.",
    rating: 5,
    categoryLabel: "Verified Google Review",
    date: "Verified Google Review"
  },
  {
    id: "rev_4",
    authorName: "Pooja Sawant",
    location: "Chembur, Mumbai",
    garmentPurchased: "Ivory & Sand Linen Co-Ord Set",
    reviewText: "Bought the pure linen co-ord set. The fabric quality is so breathable and luxurious. Got so many compliments at brunch!",
    rating: 5,
    categoryLabel: "Verified Google Review",
    date: "Verified Google Review"
  },
  {
    id: "rev_5",
    authorName: "Simran Ahuja",
    location: "Bandra, Mumbai",
    garmentPurchased: "The Noir Botanical Silk Co-Ord Set",
    reviewText: "The Noir Botanical silk co-ord set is stunning! Drapes so effortlessly and the stitching quality is top-notch.",
    rating: 5,
    categoryLabel: "Verified Google Review",
    date: "Verified Google Review"
  },
  {
    id: "rev_6",
    authorName: "Ananya Iyer",
    location: "Mumbai",
    garmentPurchased: "The Emerald Festive Silk Co-Ord Set",
    reviewText: "Finding a designer who understands body contour and comfortable silhouettes is rare. Satiinder Kaur and team are masters.",
    rating: 5,
    categoryLabel: "Verified Google Review",
    date: "Verified Google Review"
  }
];

let products = [];
let cart = [];
let wishlist = [];
let currentCategory = "NEW ARRIVALS";
let searchQuery = "";
let sortOption = "default";
let selectedCurrency = "INR";
let currencyRates = { INR: 1, USD: 0.012, AED: 0.044, GBP: 0.0094, EUR: 0.011 };
let currencySymbols = { INR: "₹", USD: "$", AED: "AED ", GBP: "£", EUR: "€" };
let currentActiveProduct = null;
let selectedSize = "M";

// Local Storage Helper
function getStoredData(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch(e) {
        return fallback;
    }
}

function setStoredData(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch(e) {}
}

// Currency Conversion Helper
function formatPrice(amountInINR) {
    const rate = currencyRates[selectedCurrency] || 1;
    const sym = currencySymbols[selectedCurrency] || "₹";
    const converted = Math.round(amountInINR * rate);
    return `${sym}${converted.toLocaleString()}`;
}

// Render Category Tabs
function renderCategoryTabs() {
    const container = document.getElementById("catalog-tabs-container");
    if (!container) return;
    container.innerHTML = DEFAULT_CATEGORIES.map(cat => `
        <button class="tab-btn ${cat === currentCategory ? 'active' : ''}" data-category="${cat}">
            ${cat}
        </button>
    `).join("");
}

// Render Products Grid
function renderProductsGrid() {
    const container = document.getElementById("product-list-container");
    if (!container) return;

    let filtered = products.filter(p => {
        const matchesCat = (currentCategory === "NEW ARRIVALS") ? true : (p.category === currentCategory);
        const matchesSearch = searchQuery === "" ? true : (
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return matchesCat && matchesSearch;
    });

    if (sortOption === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sortOption === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (sortOption === "title-asc") filtered.sort((a, b) => a.title.localeCompare(b.title));

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #888;">No co-ord creations found matching your search.</div>`;
        return;
    }

    container.innerHTML = filtered.map(p => {
        const isWish = wishlist.includes(p.id);
        return `
            <div class="product-card" data-id="${p.id}" id="product-card-${p.id}">
                <div class="product-card-img-wrapper">
                    <span class="product-card-badge">${p.badge || 'LUXURYPRET'}</span>
                    <button class="product-wishlist-btn ${isWish ? 'active' : ''}" data-id="${p.id}" title="Wishlist">
                        <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                    <img src="${p.image}" alt="${p.title}" loading="lazy" decoding="async">
                </div>
                <div class="product-card-info">
                    <h3 class="product-card-title">${p.title}</h3>
                    <div class="product-card-price-row">
                        <span class="product-card-price">${formatPrice(p.price)}</span>
                        <span class="gst-tag">INCL. GST</span>
                    </div>
                    <button class="card-action-tap-btn" data-id="${p.id}">
                        <i class="fa-solid fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// Render Client Reviews
function renderClientReviews() {
    const container = document.getElementById("testimonials-container");
    if (!container) return;
    const reviewsList = getStoredData("shapes_client_reviews", DEFAULT_CLIENT_REVIEWS);
    container.innerHTML = reviewsList.map(r => `
        <div class="testimonial-card">
            <div class="stars-row">
                ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating || 5)}
            </div>
            <p class="review-text">"${r.reviewText}"</p>
            <div class="reviewer-meta">
                <span class="client-name">${r.authorName}</span>
                <span class="client-location">${r.location}</span>
            </div>
        </div>
    `).join("");
}

// Open / Close Modals & Drawers
function openProductDetail(productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;
    currentActiveProduct = p;
    selectedSize = "M";

    document.getElementById("modal-product-image").src = p.image;
    document.getElementById("modal-product-image").alt = p.title;
    document.getElementById("modal-product-category").innerText = p.category;
    document.getElementById("modal-product-title").innerText = p.title;
    document.getElementById("modal-product-price").innerText = formatPrice(p.price);
    document.getElementById("modal-product-desc").innerText = p.description || "";

    document.querySelectorAll(".size-option").forEach(opt => {
        opt.classList.remove("active");
        if (opt.getAttribute("data-size") === "M") opt.classList.add("active");
    });

    const modal = document.getElementById("product-detail-modal");
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeProductDetailModal() {
    const modal = document.getElementById("product-detail-modal");
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
}

function openCartDrawer() {
    const overlay = document.getElementById("cart-drawer-overlay");
    if (overlay) {
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
        renderCartUI();
    }
}

function closeCartDrawer() {
    const overlay = document.getElementById("cart-drawer-overlay");
    if (overlay) {
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    }
}

function openReviewModal() {
    const modal = document.getElementById("review-modal");
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeReviewModal() {
    const modal = document.getElementById("review-modal");
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
}

// Cart Logic
function addToCart(productId, size) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    const existing = cart.find(item => item.id === productId && item.size === size);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: p.id,
            title: p.title,
            price: p.price,
            image: p.image,
            size: size || "M",
            quantity: 1
        });
    }

    setStoredData("shapes_cart_items", cart);
    updateCartBadge();
    showCartToast();
}

function updateCartBadge() {
    const countEl = document.getElementById("header-cart-count");
    if (countEl) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        countEl.innerText = total;
    }
}

function renderCartUI() {
    const container = document.getElementById("cart-items-container");
    const subtotalEl = document.getElementById("cart-subtotal-val");
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 3rem 0; color: #888;">Your shopping bag is currently empty.</div>`;
        if (subtotalEl) subtotalEl.innerText = formatPrice(0);
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map((item, idx) => {
        subtotal += item.price * item.quantity;
        return `
            <div class="cart-item" style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
                <img src="${item.image}" alt="${item.title}" style="width: 70px; height: 90px; object-fit: cover; border-radius: 4px;">
                <div style="flex-grow: 1;">
                    <h4 style="font-size: 1rem; color: #fff;">${item.title}</h4>
                    <p style="font-size: 0.8rem; color: var(--gold);">Size: ${item.size} | Qty: ${item.quantity}</p>
                    <p style="font-size: 0.95rem; font-weight: 600; color: var(--gold-light); margin-top: 0.3rem;">${formatPrice(item.price * item.quantity)}</p>
                </div>
                <button class="remove-cart-item-btn" data-index="${idx}" style="color: var(--crimson); font-size: 1.2rem; cursor: pointer;">&times;</button>
            </div>
        `;
    }).join("");

    if (subtotalEl) subtotalEl.innerText = formatPrice(subtotal);
}

function showCartToast() {
    const toast = document.getElementById("cart-toast-notification");
    if (!toast) return;
    toast.classList.add("show");
    setTimeout(() => { toast.classList.remove("show"); }, 3500);
}

function toggleWishlist(productId) {
    const idx = wishlist.indexOf(productId);
    if (idx > -1) {
        wishlist.splice(idx, 1);
    } else {
        wishlist.push(productId);
    }
    setStoredData("shapes_wishlist_items", wishlist);
    renderProductsGrid();
}

function shareActiveProductOnWhatsApp() {
    if (!currentActiveProduct) return;
    const p = currentActiveProduct;
    const text = encodeURIComponent(`Hello Shapes By Satiinder Kaur! I am interested in ordering:

*${p.title}*
Category: ${p.category}
Price: ${formatPrice(p.price)}
Size: ${selectedSize}

Please confirm availability.`);
    window.open(`https://wa.me/919833392756?text=${text}`, "_blank");
}

function openCheckoutModal() {
    if (cart.length === 0) {
        alert("Your shopping bag is empty. Please add items to checkout.");
        return;
    }
    const totalINR = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDisplay = formatPrice(totalINR);

    if (typeof Razorpay !== "undefined") {
        const options = {
            key: "rzp_test_shapes_boutique",
            amount: totalINR * 100,
            currency: "INR",
            name: "Shapes By Satiinder Kaur",
            description: "Luxury Designer Co-Ord Sets",
            image: "images/app_icon.webp",
            handler: function (response) {
                alert(`Thank you! Order Payment Confirmed (${response.razorpay_payment_id}).`);
                cart = [];
                setStoredData("shapes_cart_items", cart);
                updateCartBadge();
                closeCartDrawer();
            },
            prefill: { name: "", email: "", contact: "" },
            theme: { color: "#C5A059" }
        };
        const rzp = new Razorpay(options);
        rzp.open();
    } else {
        alert(`Order Summary Total: ${totalDisplay}

Razorpay Gateway simulated. Click OK to place WhatsApp Order confirmation.`);
        shareActiveProductOnWhatsApp();
    }
}

// Master Global Event Delegation Engine (100% Reliable Button Clicks)
document.addEventListener("click", function (e) {
    // 1. Wishlist nav trigger
    if (e.target.closest("#wishlist-nav-trigger")) {
        e.preventDefault();
        alert(`Your Wishlist contains ${wishlist.length} saved creation(s).`);
        return;
    }

    // 2. Cart nav trigger & Toast View Bag
    if (e.target.closest("#cart-nav-trigger") || e.target.closest("#toast-view-bag-btn")) {
        e.preventDefault();
        openCartDrawer();
        return;
    }

    // 3. Close Cart Drawer
    if (e.target.closest("#close-cart-drawer") || e.target.id === "cart-drawer-overlay") {
        closeCartDrawer();
        return;
    }

    // 4. Remove Item from Cart
    const removeCartBtn = e.target.closest(".remove-cart-item-btn");
    if (removeCartBtn) {
        const idx = parseInt(removeCartBtn.getAttribute("data-index"));
        cart.splice(idx, 1);
        setStoredData("shapes_cart_items", cart);
        updateCartBadge();
        renderCartUI();
        return;
    }

    // 5. Mobile Menu Toggle
    if (e.target.closest("#mobile-menu-btn")) {
        const btn = document.getElementById("mobile-menu-btn");
        const drawer = document.getElementById("mobile-nav-drawer");
        if (btn && drawer) {
            btn.classList.toggle("active");
            drawer.classList.toggle("open");
        }
        return;
    }

    // 6. Category Tab Buttons
    const tabBtn = e.target.closest(".tab-btn");
    if (tabBtn) {
        currentCategory = tabBtn.getAttribute("data-category");
        renderCategoryTabs();
        renderProductsGrid();
        return;
    }

    // 7. Write a Review Modal Open
    if (e.target.closest("#open-review-modal-btn")) {
        e.preventDefault();
        openReviewModal();
        return;
    }

    // 8. Close Review Modal
    if (e.target.closest("#close-review-modal") || e.target.id === "review-modal") {
        closeReviewModal();
        return;
    }

    // 9. Product Card View Details or Card Click
    const productCard = e.target.closest(".product-card");
    if (productCard && !e.target.closest(".product-wishlist-btn")) {
        const prodId = productCard.getAttribute("data-id");
        if (prodId) openProductDetail(prodId);
        return;
    }

    // 10. Wishlist Heart Button on Product Card
    const wishlistBtn = e.target.closest(".product-wishlist-btn");
    if (wishlistBtn) {
        e.preventDefault();
        e.stopPropagation();
        const prodId = wishlistBtn.getAttribute("data-id");
        if (prodId) toggleWishlist(prodId);
        return;
    }

    // 11. Close Product Detail Modal
    if (e.target.closest("#close-detail-modal") || e.target.id === "product-detail-modal") {
        closeProductDetailModal();
        return;
    }

    // 12. Size Option Selection
    const sizeOpt = e.target.closest(".size-option");
    if (sizeOpt) {
        document.querySelectorAll(".size-option").forEach(opt => opt.classList.remove("active"));
        sizeOpt.classList.add("active");
        selectedSize = sizeOpt.getAttribute("data-size") || "M";
        return;
    }

    // 13. Add to Cart inside Product Detail Modal
    if (e.target.closest("#modal-add-to-cart-btn")) {
        e.preventDefault();
        if (currentActiveProduct) {
            addToCart(currentActiveProduct.id, selectedSize);
            closeProductDetailModal();
        }
        return;
    }

    // 14. WhatsApp Inquire inside Product Detail Modal
    if (e.target.closest("#modal-whatsapp-inquire-btn")) {
        e.preventDefault();
        shareActiveProductOnWhatsApp();
        return;
    }

    // 15. Proceed to Checkout Button inside Cart Drawer
    if (e.target.closest("#proceed-checkout-btn")) {
        e.preventDefault();
        openCheckoutModal();
        return;
    }

    // 16. FAQ Accordion Click
    const faqBtn = e.target.closest(".faq-question-btn");
    if (faqBtn) {
        e.preventDefault();
        const faqItem = faqBtn.closest(".faq-item");
        if (faqItem) {
            faqItem.classList.toggle("active");
        }
        return;
    }
});

// Master Initialization
function initStore() {
    products = getStoredData("shapes_products_v25", DEFAULT_PRODUCTS);
    cart = getStoredData("shapes_cart_items", []);
    wishlist = getStoredData("shapes_wishlist_items", []);

    renderCategoryTabs();
    renderProductsGrid();
    renderClientReviews();
    updateCartBadge();

    // Search Input Listener
    const searchInput = document.getElementById("boutique-search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            renderProductsGrid();
        });
    }

    // Sort Selector Listener
    const sortSelect = document.getElementById("boutique-sort-select");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            sortOption = e.target.value;
            renderProductsGrid();
        });
    }

    // Currency Selector Listener
    const currSelect = document.getElementById("currency-selector");
    if (currSelect) {
        currSelect.addEventListener("change", (e) => {
            selectedCurrency = e.target.value;
            renderProductsGrid();
            if (currentActiveProduct) openProductDetail(currentActiveProduct.id);
            if (cart.length > 0) renderCartUI();
        });
    }

    // Review Form Submit Handler
    const reviewForm = document.getElementById("client-review-form");
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

            const list = getStoredData("shapes_client_reviews", DEFAULT_CLIENT_REVIEWS);
            list.unshift(newReview);
            setStoredData("shapes_client_reviews", list);

            closeReviewModal();
            reviewForm.reset();
            renderClientReviews();
            alert("Thank you! Your gracious client review has been published.");
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStore);
} else {
    initStore();
}
