import {
  auth, db, onAuthStateChanged,
  doc, getDoc, setDoc, updateDoc,
  serverTimestamp
} from "./firebase.js";

// ─── CART STATE ──────────────────────────────────────────────
let cartItems = []; // [{ id, name, price, img, qty }]
let cartOpen  = false;

// ─── STORAGE HELPERS ─────────────────────────────────────────
function saveLocal() {
  localStorage.setItem("meraley_cart", JSON.stringify(cartItems));
}

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem("meraley_cart") || "[]");
  } catch { return []; }
}

async function syncToFirestore(uid) {
  try {
    await setDoc(doc(db, "carts", uid), {
      items: cartItems,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) { console.warn("Cart sync error:", e); }
}

async function loadFromFirestore(uid) {
  try {
    const snap = await getDoc(doc(db, "carts", uid));
    if (snap.exists()) {
      cartItems = snap.data().items || [];
      saveLocal();
    }
  } catch (e) { console.warn("Cart load error:", e); }
}

// ─── INIT ─────────────────────────────────────────────────────
export async function initCart() {
  cartItems = loadLocal();
  renderCart();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await loadFromFirestore(user.uid);
      renderCart();
    }
  });

  buildCartUI();
  updateBadge();
}

// ─── PUBLIC API ───────────────────────────────────────────────
export function addToCart(product, qty = 1) {
  const existing = cartItems.find(i => i.id === product.id);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, product.stock);
  } else {
    cartItems.push({
      id:    product.id,
      name:  product.name,
      price: product.price,
      img:   product.img || "",
      qty:   qty,
      stock: product.stock
    });
  }
  persist();
  showCartToast(product.name, qty);
  updateBadge();
  renderCart();
}

export function removeFromCart(id) {
  cartItems = cartItems.filter(i => i.id !== id);
  persist();
  renderCart();
  updateBadge();
}

export function changeQty(id, delta) {
  const item = cartItems.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, Math.min(item.qty + delta, item.stock));
  persist();
  renderCart();
  updateBadge();
}

export function clearCart() {
  cartItems = [];
  persist();
  renderCart();
  updateBadge();
}

export function getCart() { return [...cartItems]; }

function persist() {
  saveLocal();
  const user = auth.currentUser;
  if (user) syncToFirestore(user.uid);
}

// ─── BADGE ────────────────────────────────────────────────────
function updateBadge() {
  const total = cartItems.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll(".cart-badge").forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? "flex" : "none";
  });
}

// ─── TOAST ────────────────────────────────────────────────────
function showCartToast(name, qty) {
  let toast = document.getElementById("cart-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cart-toast";
    toast.className = "cart-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = `✓ ${qty}× ${name} agregado`;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2800);
}

// ─── RENDER DRAWER ────────────────────────────────────────────
function renderCart() {
  const list = document.getElementById("cart-list");
  const totalEl = document.getElementById("cart-total");
  if (!list) return;

  if (cartItems.length === 0) {
    list.innerHTML = `<div class="cart-empty">
      <span>🫙</span>
      <p>Tu carrito está vacío</p>
    </div>`;
    if (totalEl) totalEl.textContent = "$0";
    return;
  }

  list.innerHTML = cartItems.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-img">
        ${item.img ? `<img src="${item.img}" alt="${item.name}">` : `<span>🫙</span>`}
      </div>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">$${item.price}</p>
      </div>
      <div class="cart-item-qty">
        <button class="cqty-btn" onclick="window._cart.changeQty(${item.id}, -1)">−</button>
        <span>${item.qty}</span>
        <button class="cqty-btn" onclick="window._cart.changeQty(${item.id}, 1)">+</button>
      </div>
      <button class="cart-item-remove" onclick="window._cart.removeFromCart(${item.id})">✕</button>
    </div>
  `).join("");

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  if (totalEl) totalEl.textContent = `$${total}`;
}

// ─── BUILD DRAWER UI ─────────────────────────────────────────
function buildCartUI() {
  if (document.getElementById("cart-drawer")) return;

  // Cart button in header (inyectado si existe .merme-login-register)
  const nav = document.querySelector(".merme-login-register");
  if (nav) {
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="cart-toggle button" id="cart-btn" aria-label="Carrito">
        Carrito <span class="cart-badge" id="cart-badge" style="display:none">0</span>
      </button>`;
    nav.prepend(li);
    document.getElementById("cart-btn").addEventListener("click", toggleCart);
  }

  // Drawer
  const drawer = document.createElement("div");
  drawer.id = "cart-drawer";
  drawer.className = "cart-drawer";
  drawer.innerHTML = `
    <div class="cart-overlay" id="cart-overlay"></div>
    <div class="cart-panel">
      <div class="cart-header">
        <h2>Mi Carrito</h2>
        <button class="cart-close" id="cart-close">✕</button>
      </div>
      <div class="cart-list" id="cart-list"></div>
      <div class="cart-footer">
        <div class="cart-footer-row">
          <span>Total</span>
          <strong id="cart-total">$0</strong>
        </div>
        <button class="cart-checkout-btn" id="cart-checkout">Proceder al pago</button>
        <button class="cart-clear-btn" id="cart-clear">Vaciar carrito</button>
      </div>
    </div>`;
  document.body.appendChild(drawer);

  document.getElementById("cart-close").addEventListener("click", toggleCart);
  document.getElementById("cart-overlay").addEventListener("click", toggleCart);
  document.getElementById("cart-clear").addEventListener("click", () => {
    if (confirm("¿Vaciar el carrito?")) clearCart();
  });
  document.getElementById("cart-checkout").addEventListener("click", () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para continuar con tu compra.");
      window.location.href = "/subpages/signin.html";
      return;
    }
    alert(" Próximamente: pasarela de pago integrada.");
  });

  // Expose for inline onclick handlers
  window._cart = { addToCart, removeFromCart, changeQty, clearCart };

  renderCart();
  updateBadge();
}

function toggleCart() {
  cartOpen = !cartOpen;
  const drawer = document.getElementById("cart-drawer");
  if (drawer) drawer.classList.toggle("open", cartOpen);
  document.body.style.overflow = cartOpen ? "hidden" : "";
}

export { toggleCart };