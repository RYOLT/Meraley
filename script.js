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

//Se reutiliza esta parte del del codigo para animaciones
// const element = document.querySelector('.block--main-menu ul li a');
// element.addEventListener('mouseenter', () => {
//   animateCSS(element, 'pulse', '2s');
// });

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

// 🖱️ Eventos de Ratón y Teclado
// Estos eventos responden a la interacción directa del usuario con el dispositivo de entrada.
/*
Ratón: Incluyen
click (clic izquierdo)
dblclick (doble clic)
mousedown/mouseup (presionar/soltar botón)
mousemove (movimiento continuo)
mouseover/mouseout (entrar/salir del área de un elemento)
mouseenter/mouseleave (entrar/salir del elemento y sus hijos)
contextmenu (clic derecho).
Teclado: Cubren keydown (presionar tecla)
keypress (momento de pulsación)
keyup (soltar tecla)
 */
/*---------------------------------------------------------------------------------------------------------*/
// 📝 Eventos de Formulario, Carga y Ventana
// Gestionan la interacción con datos, la carga de recursos y cambios en la ventana del navegador.

// Formulario: submit (envío)
// reset (restablecimiento)
// change (cambio de valor)
// focus (obtención de foco)
// blur (pérdida de foco).
// Carga y Ventana: load (carga completa de página o recurso), DOMContentLoaded (carga del HTML), unload (abandono de página), resize (cambio de tamaño de ventana) y scroll (desplazamiento).
// Red: online y offline indican el estado de la conexión a internet.
/*---------------------------------------------------------------------------------------------------------*/
// 📺 Eventos de Medios y Otros
// Se activan durante la reproducción de audio/video o cambios específicos en el entorno.

// Medios: play, pause, ended (fin de reproducción), canplay, loadeddata y timeupdate.
// Otros: Incluyen eventos de animación (animationstart, animationend), batería (chargingchange), impresión (beforeprint, afterprint) y DOM (DOMSubtreeModified, aunque estos últimos han sido en gran parte reemplazados por MutationObserver).

/* Categoría	Eventos Principales	Descripción Breve
Ratón
    click, dblclick, mouseover, mousemove	Interacción con cursor y clics.
    Teclado	keydown, keypress, keyup	Presión y liberación de teclas.
    Formulario
    submit, change, focus, blur	Envío, modificación y enfoque de inputs.
    Ventana/Documento
    load, resize, scroll, unload	Carga, tamaño, desplazamiento y cierre.
    Medios
    play, pause, ended, canplay	Control de reproducción de audio/video.
    Red
    online, offline	Estado de conexión a internet.

*/

// //how creates an animation
// const element = document.querySelector('.hola2');
// element.addEventListener('click', () => {
//   //Add a class to the element with the name of the animation
//   element.classList.add('animate__animated', 'animate__heartBeat');

//   //Obliga a reiniciar la animación
//   void element.offsetWidth;

//   element.classList.add('animate__animated', 'animate__heartBeat');
//   //Assing a property to the element
//   element.style.setProperty('--animate-duration', '1s');
// });
// //Detect when an animation ends
// element.addEventListener('animationend', () => {
//   element.classList.remove('animate__animated', 'animate__heartBeat');
// });


    const products = [
        {
            id: 1,
            name: "Mermelada de Fresa",
            flavor: "Fresa",
            price: 85,
            stock: 24,
            emoji: "",
            img: 'resources/fresa.png',
            desc: "Elaborada con fresas frescas seleccionadas a mano. Su sabor intenso y natural la convierte en la preferida de nuestros clientes. Perfecta para pan tostado, crepes o yogurt.",
        },
        {
            id: 2,
            name: "Mermelada de Uva",
            flavor: "Uva",
            price: 90,
            stock: 3,
            emoji: "",
            img: 'resources/uva.png',
            desc: "La mermelada que lo tiene todo: dulce con un toque picante que sorprende. Ideal para acompañar quesos, carnes o galletas saladas. ¡Atrévete a probarla!",
        },
        {
            id: 3,
            name: "Mermelada de Mango",
            flavor: "Mango",
            price: 85,
            stock: 15,
            emoji: "",
            img: null,
            desc: "El sabor tropical del mango capturado en un frasco. Suave, dulce y aromática. Combina perfectamente con pan de baguette y mantequilla.",
        },
        {
            id: 4,
            name: "Mermelada de Zarzamora",
            flavor: "Zarzamora",
            price: 88,
            stock: 0,
            emoji: "",
            img: null,
            desc: "Un sabor oscuro y profundo con notas ligeramente ácidas. Elaborada con zarzamoras silvestres. Excelente para postres o simplemente en una tostada.",
        },
        {
            id: 5,
            name: "Mermelada de Durazno",
            flavor: "Durazno",
            price: 82,
            stock: 10,
            emoji: "",
            img: null,
            desc: "Suave, dorada y aromática. Nuestra mermelada de durazno es pura nostalgia en cada cucharada. Perfecta para hot cakes o como relleno de pays.",
        },
        {
            id: 6,
            name: "Mermelada de Tamarindo",
            flavor: "Tamarindo",
            price: 92,
            stock: 7,
            emoji: "",
            img: null,
            desc: "Sabor agridulce único e inconfundible. Esta mermelada artesanal de tamarindo es para los paladares aventureros. Ideal con quesos frescos y totopos.",
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
                    <span class="card-badge">120g</span>
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