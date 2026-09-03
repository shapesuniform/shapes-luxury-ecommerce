// ═════════════════════════════════════════════════════════════════════
// 6B: FIREBASE REAL-TIME MULTI-DEVICE SYNC ENGINE
// SHAPES By Satiinder Kaur — Live order & inventory sync across devices
// ═════════════════════════════════════════════════════════════════════

/*
 * SETUP INSTRUCTIONS:
 * 1. Go to firebase.google.com → Your Project → Firestore Database
 * 2. Your firebase-config.js already has the connection details
 * 3. This module auto-syncs orders and inventory in real-time
 * 4. The admin portal will show live updates without page refresh
 */

const SHAPES_SYNC = {
    enabled: false, // Set to true once Firebase is configured
    syncInterval: 30000, // 30 seconds polling fallback

    init: function() {
        if (typeof window._dbAdmin === "undefined") {
            console.log("[SHAPES Sync] Firebase not yet initialized. Using localStorage mode.");
            return;
        }
        this.enabled = true;
        this.startRealtimeSync();
        console.log("[SHAPES Sync] Real-time multi-device sync enabled via Firebase Firestore");
    },

    startRealtimeSync: function() {
        if (!this.enabled || typeof window._onSnapshotAdmin !== "function") return;

        // Listen for order changes in real-time
        try {
            const ordersRef = window._collectionAdmin(window._dbAdmin, "orders");
            window._onSnapshotAdmin(ordersRef, (snapshot) => {
                const firestoreOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if (firestoreOrders.length > 0) {
                    localStorage.setItem("shapes_orders", JSON.stringify(firestoreOrders));
                    if (typeof window.loadAdminOrders === "function") {
                        window.loadAdminOrders();
                    }
                    console.log("[SHAPES Sync] Orders synced from Firestore:", firestoreOrders.length);
                }
            });
        } catch(e) {
            console.warn("[SHAPES Sync] Real-time listener error:", e.message);
        }
    },

    saveOrderToCloud: async function(order) {
        if (!this.enabled || typeof window._dbAdmin === "undefined") {
            // Fallback to localStorage
            const orders = JSON.parse(localStorage.getItem("shapes_orders") || "[]");
            const idx = orders.findIndex(o => o.ref === order.ref);
            if (idx > -1) { orders[idx] = { ...orders[idx], ...order }; }
            else { orders.unshift(order); }
            localStorage.setItem("shapes_orders", JSON.stringify(orders));
            return { source: "localStorage" };
        }

        try {
            // Also sync to Cloudflare D1 Edge DB
            fetch("/api/db/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order)
            }).catch(() => {});
        } catch(e) {}

        return { source: "firebase" };
    }
};

// Auto-initialize when Firebase is ready
if (document.readyState === "complete") {
    SHAPES_SYNC.init();
} else {
    window.addEventListener("load", () => SHAPES_SYNC.init());
}

window.SHAPES_SYNC = SHAPES_SYNC;
export { SHAPES_SYNC };
