function animateCSS(element, animation, duration = '1s') {
  return new Promise((resolve) => {
    const animationName = `animate__${animation}`;

    element.classList.add('animate__animated', animationName);
    element.style.setProperty('--animate-duration', duration);
    
    function handleAnimationEnd(event) {
      event.stopPropagation();
      element.classList.remove('animate__animated', animationName);
      element.removeEventListener('animationend', handleAnimationEnd);
      resolve();
    }

    element.addEventListener('animationend', handleAnimationEnd, { once: true });
  });
}

//Se reutiliza
//Si quiero usar varias etiquetas debo de usar 'querySelectorAll con forEach'

const elements = document.querySelectorAll('.block--main-menu a');
elements.forEach((element) => {
  element.addEventListener('mouseenter', () => {
    console.log('hover funcionando');
    animateCSS(element, 'pulse', '1s');
  });
});

console.log(elements)



  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    
    authDomain: "merme-db.firebaseapp.com",
    projectId: "merme-db",
    storageBucket: "merme-db.firebasestorage.app",
    messagingSenderId: "667177586343",
    appId: "1:667177586343:web:031089153e2233598dd582",
    measurementId: "G-0P6FFGBM6J"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);











/*
*/
    const products = [
        {
            id: 1,
            name: "Mermelada de Kiwi",
            flavor: "Kiwi",
            price: 85,
            stock: 6,
            emoji: "",
            img: '/resources/kiwi.png',
            desc: "Elaborada con fresas frescas seleccionadas a mano. Su sabor intenso y natural la convierte en la preferida de nuestros clientes. Perfecta para pan tostado, crepes o yogurt.",
        },
        {
            id: 2,
            name: "Mermelada de Mango",
            flavor: "Mango",
            price: 90,
            stock: 6,
            emoji: "",
            img: '/resources/mango.png',
            desc: "La mermelada que lo tiene todo: dulce con un toque picante que sorprende. Ideal para acompañar quesos, carnes o galletas saladas. ¡Atrévete a probarla!",
        },
        {
            id: 3,
            name: "Mermelada de Piña",
            flavor: "Piña",
            price: 88,
            stock: 6,
            emoji: "",
            img: '/resources/piña.png',
            desc: "Un sabor oscuro y profundo con notas ligeramente ácidas. Elaborada con zarzamoras silvestres. Excelente para postres o simplemente en una tostada.",
        },
        {
            id: 4,
            name: "Mermelada de Tamarindo",
            flavor: "Tamarindo",
            price: 88,
            stock: 6,
            emoji: "",
            img: '/resources/tamarindo.png',
            desc: "Un sabor oscuro y profundo con notas ligeramente ácidas. Elaborada con zarzamoras silvestres. Excelente para postres o simplemente en una tostada.",
        },
    ];
 
    function getStockInfo(stock) {
        if (stock === 0) return { text: "Agotado", cls: "out" };
        if (stock <= 5) return { text: `¡Solo ${stock} disponibles!`, cls: "low" };
        return { text: `${stock} disponibles`, cls: "" };
    }
 
    function renderCards() {
        const grid = document.getElementById("products-grid");
        grid.innerHTML = products.map(p => {
            const s = getStockInfo(p.stock);
            const imgHTML = p.img
                ? `<img src="${p.img}" alt="${p.name}">`
                : `<div class="img-placeholder">${p.emoji}</div>`;
            return `
            <div class="product-card" data-id="${p.id}">
                <div class="card-img">
                    ${imgHTML}
                    <span class="card-badge">150ml</span>
                </div>
                <div class="card-body">
                    <div class="card-weight">Sabor · ${p.flavor}</div>
                    <h3 class="card-name">${p.name}</h3>
                    <p class="card-desc">${p.desc.slice(0, 72)}…</p>
                    <div class="card-footer-row">
                        <div class="card-price"><span>$</span>${p.price}</div>
                        <button class="card-btn" ${p.stock === 0 ? "disabled" : ""}>
                            ${p.stock === 0 ? "Agotado" : "Ver más"}
                        </button>
                    </div>
                    <div class="card-stock ${s.cls}">${s.text}</div>
                </div>
            </div>`;
        }).join("");
 
        document.querySelectorAll(".product-card").forEach(card => {
            card.addEventListener("click", () => {
                const product = products.find(p => p.id === parseInt(card.dataset.id));
                if (product) openModal(product);
            });
        });

        const params = new URLSearchParams(window.location.search);
        const productoId = params.get("producto");
        if (productoId) {
            const product = products.find(p => p.id === parseInt(productoId));
            if (product) openModal(product);
        }
    }
 
    let currentProduct = null;
    let currentQty = 1;
 
    function openModal(product) {
        currentProduct = product;
        currentQty = product.stock > 0 ? 1 : 0;
 
        const imgArea = document.getElementById("modal-img-area");
        imgArea.innerHTML = product.img
            ? `<img class="modal-img" src="${product.img}" alt="${product.name}">`
            : `<div class="modal-img-placeholder">${product.emoji}</div>`;
 
        document.getElementById("modal-tag").textContent = `Sabor · ${product.flavor}`;
        document.getElementById("modal-title").textContent = product.name;
        document.getElementById("modal-desc").textContent = product.desc;
 
        const badge = document.getElementById("modal-stock-badge");
        if (product.stock === 0) {
            badge.className = "modal-stock-badge out-stock";
            badge.textContent = "Sin stock — Agotado";
        } else if (product.stock <= 5) {
            badge.className = "modal-stock-badge low-stock";
            badge.textContent = `¡Últimas ${product.stock} piezas disponibles!`;
        } else {
            badge.className = "modal-stock-badge in-stock";
            badge.textContent = `En stock — ${product.stock} disponibles`;
        }
 
        const buyBtn = document.getElementById("modal-buy-btn");
        buyBtn.disabled = product.stock === 0;
        buyBtn.textContent = product.stock === 0 ? "Sin stock" : "Agregar al carrito";
 
        updateModalQty();
 
        document.getElementById("modal-overlay").classList.add("active");
        document.body.style.overflow = "hidden";
    }
 
    function updateModalQty() {
        document.getElementById("qty-label").textContent = currentQty;
        const total = currentProduct ? currentProduct.price * currentQty : 0;
        document.getElementById("modal-total-price").textContent = `$${total}`;
        document.getElementById("qty-minus").disabled = currentQty <= 1;
        document.getElementById("qty-plus").disabled = currentQty >= (currentProduct?.stock ?? 0);
    }
 
    function closeModal() {
        document.getElementById("modal-overlay").classList.remove("active");
        document.body.style.overflow = "";
        currentProduct = null;
        currentQty = 1;
    }
 
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal-overlay").addEventListener("click", e => {
        if (e.target === document.getElementById("modal-overlay")) closeModal();
    });
    document.getElementById("qty-minus").addEventListener("click", () => {
        if (currentQty > 1) { currentQty--; updateModalQty(); }
    });
    document.getElementById("qty-plus").addEventListener("click", () => {
        if (currentQty < currentProduct.stock) { currentQty++; updateModalQty(); }
    });
    document.getElementById("modal-buy-btn").addEventListener("click", () => {
        if (!currentProduct || currentProduct.stock === 0) return;
        alert(`✅ Agregaste ${currentQty} × ${currentProduct.name} a tu carrito.`);
        closeModal();
    });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });
 
    renderCards();