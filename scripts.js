/* =============================================================
   iBITE — App logic
   Vanilla JS, sin librerías. Renderiza catálogo, filtros,
   carrito, checkout por WhatsApp, FAQ acordeón, marquee y FABs.
   ============================================================= */
(() => {
  "use strict";

  // ---------- CONFIG ----------
  const WHATSAPP_NUMBER = "5492215749478";
  const CUOTAS = "2, 3 y 6 cuotas sin intereses";

  // Categorías (FUNDAS y VIDRIOS eliminadas)
  const CATEGORIES = [
    { id: "cargadores",  name: "Cargadores",  emoji: "⚡" },
    { id: "auriculares", name: "Auriculares", emoji: "🎧" },
    { id: "powerbank",   name: "Power Bank",  emoji: "🔋" },
    { id: "soportes",    name: "Soportes",    emoji: "🧲" },
    { id: "adaptadores", name: "Adaptadores", emoji: "🔌" },
    { id: "smartwatch",  name: "Smartwatch",  emoji: "⌚" },
    { id: "cables",      name: "Cables",      emoji: "🧵" }
  ];

  // Marcas permitidas (removidas: Huawei, Realme, Google Pixel, Anker,
  // Baseus, Ugreen, ESR, Spigen)
  // Marcas permitidas: Apple, Samsung, Motorola, Xiaomi, JBL
  const BRANDS = [
    { name: "Apple",    logo: brandLogo("apple") },
    { name: "Samsung",  logo: brandLogo("samsung") },
    { name: "Motorola", logo: brandLogo("motorola") },
    { name: "Xiaomi",   logo: brandLogo("xiaomi") },
    { name: "JBL",      logo: brandLogo("jbl") }
  ];

  const PRODUCTS = [
    { id: 1,  cat: "smartwatch",  name: "Smartwatch Pro GPS",   brand: "Apple",    price: 78890, old: null,  rating: 4.6, tag: null,   emoji: "⌚", stock: true },
    { id: 2,  cat: "soportes",    name: "Soporte MagSafe Auto", brand: "Samsung",  price: 12190, old: null,  rating: 4.3, tag: null,   emoji: "🧲", stock: true },
    { id: 3,  cat: "auriculares", name: "Auriculares TWS Pro",  brand: "Apple",    price: 39490, old: 49363, rating: 4.7, tag: "sale", emoji: "🎧", stock: true },
    { id: 4,  cat: "cables",      name: "Cable USB-C 100W",     brand: "Xiaomi",   price: 4490,  old: 5613,  rating: 4.5, tag: "sale", emoji: "🧵", stock: true },
    { id: 5,  cat: "smartwatch",  name: "Watch Galaxy 6",       brand: "Samsung",  price: 82190, old: null,  rating: 4.8, tag: "new",  emoji: "⌚", stock: true },
    { id: 6,  cat: "powerbank",   name: "Power Bank 10.000mAh", brand: "Xiaomi",   price: 24490, old: null,  rating: 4.6, tag: null,   emoji: "🔋", stock: true },
    { id: 7,  cat: "auriculares", name: "AirPods 3ra Gen",      brand: "Apple",    price: 154990,old: null,  rating: 4.9, tag: null,   emoji: "🎧", stock: false },
    { id: 8,  cat: "cargadores",  name: "Cargador GaN 65W",     brand: "Xiaomi",   price: 18490, old: 22900, rating: 4.5, tag: "sale", emoji: "⚡", stock: true },
    { id: 9,  cat: "adaptadores", name: "Adaptador Jack 3.5",   brand: "Apple",    price: 6490,  old: null,  rating: 4.2, tag: null,   emoji: "🔌", stock: true },
    { id: 10, cat: "powerbank",   name: "Power Bank MagSafe 10K",brand:"Motorola", price: 28090, old: null,  rating: 4.4, tag: null,   emoji: "🔋", stock: true },
    { id: 11, cat: "auriculares", name: "Auriculares Tune 510", brand: "JBL",      price: 38390, old: 47988, rating: 4.6, tag: "sale", emoji: "🎧", stock: true },
    { id: 12, cat: "cables",      name: "Cable Lightning MFi",  brand: "Apple",    price: 8890,  old: null,  rating: 4.3, tag: null,   emoji: "🧵", stock: true },
    { id: 13, cat: "cargadores",  name: "Cargador Turbo 25W",   brand: "Samsung",  price: 12990, old: null,  rating: 4.5, tag: null,   emoji: "⚡", stock: true },
    { id: 14, cat: "smartwatch",  name: "Watch Fit 3",          brand: "Xiaomi",   price: 45990, old: null,  rating: 4.4, tag: "new",  emoji: "⌚", stock: true },
    { id: 15, cat: "soportes",    name: "Soporte Auto Ventilación",brand:"Motorola",price:8990,  old: 10990, rating: 4.1, tag: "sale", emoji: "🧲", stock: true },
    { id: 16, cat: "auriculares", name: "Parlante JBL Go 3",    brand: "JBL",      price: 62990, old: null,  rating: 4.8, tag: null,   emoji: "🔊", stock: true },
    { id: 17, cat: "cables",      name: "Cable USB-C a USB-C 2m",brand:"Samsung",  price: 5790,  old: null,  rating: 4.3, tag: null,   emoji: "🧵", stock: true },
    { id: 18, cat: "powerbank",   name: "Power Bank 20.000mAh", brand: "Xiaomi",   price: 42990, old: null,  rating: 4.7, tag: null,   emoji: "🔋", stock: true },
    { id: 19, cat: "cargadores",  name: "Cargador Inalámbrico 15W",brand:"Apple",  price: 24990, old: null,  rating: 4.5, tag: "new",  emoji: "⚡", stock: true },
    { id: 20, cat: "adaptadores", name: "Adaptador HDMI USB-C", brand: "Samsung",  price: 14990, old: 17900, rating: 4.4, tag: "sale", emoji: "🔌", stock: true },
    { id: 21, cat: "smartwatch",  name: "Moto Watch 100",       brand: "Motorola", price: 52990, old: null,  rating: 4.3, tag: null,   emoji: "⌚", stock: true },
    { id: 22, cat: "soportes",    name: "Trípode con control",  brand: "JBL",      price: 15490, old: null,  rating: 4.4, tag: null,   emoji: "🧲", stock: true },
    { id: 23, cat: "auriculares", name: "Auriculares Moto Buds",brand:"Motorola",  price: 34990, old: null,  rating: 4.2, tag: null,   emoji: "🎧", stock: true },
    { id: 24, cat: "adaptadores", name: "Hub USB-C 6 en 1",     brand: "Xiaomi",   price: 19990, old: null,  rating: 4.6, tag: "new",  emoji: "🔌", stock: true }
  ];

  const FAQ = [
    { q: "GARANTÍA", a: "La garantía tiene 20 días y cubre fallos de fábrica. En caso de cambiar el producto por disgusto no lo cubre." },
    { q: "ENVÍOS",   a: "Los envíos se realizan a partir de las 48hs luego de recibir el comprobante de pago." },
    { q: "LUGARES DE ENVÍO", a: "Alrededores de LA PLATA: envío en moto-envío. Fuera de LA PLATA: por ANDREANI, CORREO ARG y OCA." },
    { q: "STOCK",    a: "El stock está sostenido por mes." },
    { q: "ENVÍO",    a: "Una vez realizado y abonado el producto, el envío y recibo se hará dentro de las 48 hs." }
  ];

  // ---------- HELPERS ----------
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const fmt = n => "$" + n.toLocaleString("es-AR");

  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 1800);
  }

  // Simple SVG brand marks (transparent) — evitamos assets externos.
  function brandLogo(id) {
    const svgs = {
      apple:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.2.9-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3.1 2.5 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.7c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.7-4zm-2.5-7.4c.7-.8 1.1-2 1-3.2-1 .1-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.5 2.9-1.3z"/></svg>`,
      samsung:  `<svg viewBox="0 0 64 24" fill="currentColor"><text x="0" y="18" font-family="Arial Black,sans-serif" font-size="16" font-weight="900">SAMSUNG</text></svg>`,
      xiaomi:   `<svg viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" rx="6" fill="#ff6900"/><text x="16" y="21" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="12" font-weight="900" fill="#fff">MI</text></svg>`,
      motorola: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="16" cy="16" r="12"/><path d="M8 20 L13 12 L16 17 L19 12 L24 20"/></svg>`,
      jbl:      `<svg viewBox="0 0 40 24"><rect width="40" height="24" rx="4" fill="#ff5a1f"/><text x="20" y="17" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="12" font-weight="900" fill="#fff">JBL</text></svg>`
    };
    return svgs[id] || "";
  }

  // ---------- RENDER: CATEGORIES ----------
  function renderCategories() {
    const grid = $("#catGrid");
    const counts = countBy(PRODUCTS, "cat");
    grid.innerHTML = CATEGORIES.map(c => `
      <button class="cat-card" data-cat="${c.id}" aria-label="${c.name}">
        <span class="emoji" aria-hidden="true">${c.emoji}</span>
        <h3>${c.name}</h3>
        <small>${counts[c.id] || 0} productos</small>
      </button>
    `).join("");
    grid.addEventListener("click", e => {
      const btn = e.target.closest(".cat-card");
      if (!btn) return;
      setFilter(btn.dataset.cat);
      $("#products").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function countBy(arr, key) {
    return arr.reduce((a, x) => (a[x[key]] = (a[x[key]] || 0) + 1, a), {});
  }

  // ---------- RENDER: FILTERS ----------
  let activeFilter = "all";
  function renderFilters() {
    const f = $("#filters");
    const opts = [{ id: "all", name: "Todos" }, ...CATEGORIES];
    f.innerHTML = opts.map(o =>
      `<button class="filter-btn ${o.id === activeFilter ? "active" : ""}" data-cat="${o.id}">${o.name}</button>`
    ).join("");
    f.addEventListener("click", e => {
      const b = e.target.closest(".filter-btn");
      if (!b) return;
      setFilter(b.dataset.cat);
    }, { once: true });
  }
  function setFilter(cat) {
    activeFilter = cat;
    $$("#filters .filter-btn").forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
    renderProducts();
  }

  // ---------- RENDER: PRODUCTS ----------
  let searchQuery = "";
  function starRow(rating) {
    const full = Math.round(rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
  }
  function skeletonCards(n) {
    return Array.from({ length: n }, () => `
      <div class="product-card skeleton">
        <div class="sk sk-media"></div>
        <div class="product-body">
          <div class="sk sk-line sk-sm"></div>
          <div class="sk sk-line"></div>
          <div class="sk sk-line sk-md"></div>
          <div class="sk sk-line sk-lg"></div>
        </div>
      </div>`).join("");
  }
  function renderProducts() {
    const grid = $("#productGrid");
    // Skeleton loading rápido
    grid.innerHTML = skeletonCards(8);
    // Pequeño defer para simular carga y mostrar skeleton (no bloquea)
    setTimeout(() => {
      const sort = $("#sortSel").value;
      const q = searchQuery.trim().toLowerCase();
      let list = PRODUCTS.filter(p => activeFilter === "all" || p.cat === activeFilter);
      if (q) list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        cat(p.cat).toLowerCase().includes(q)
      );
      switch (sort) {
        case "asc":    list.sort((a,b) => a.price - b.price); break;
        case "desc":   list.sort((a,b) => b.price - a.price); break;
        case "rating": list.sort((a,b) => b.rating - a.rating); break;
        case "new":    list = list.filter(p => p.tag === "new").concat(list.filter(p => p.tag !== "new")); break;
        case "offers": list = list.filter(p => p.old).concat(list.filter(p => !p.old)); break;
        default: break;
      }
      if (!list.length) {
        grid.innerHTML = `<div class="empty-state">No encontramos productos que coincidan con tu búsqueda.</div>`;
        return;
      }
      grid.innerHTML = list.map(p => `
        <article class="product-card reveal" data-id="${p.id}">
          ${p.tag === "new" ? `<span class="product-tag new">Nuevo</span>` : ""}
          ${p.old ? `<span class="product-tag sale">-${Math.round((1 - p.price / p.old) * 100)}%</span>` : ""}
          <span class="product-tag ${p.stock ? "in" : "out"}">${p.stock ? "Disponible" : "Sin stock"}</span>
          <div class="product-media" role="img" aria-label="${p.name}">${p.emoji}</div>
          <div class="product-body">
            <div class="product-brand">${p.brand} · ${cat(p.cat)}</div>
            <h3 class="product-title">${p.name}</h3>
            <div class="product-rating" aria-label="Rating ${p.rating} de 5">${starRow(p.rating)} <span>(${Math.round(p.rating * 100)})</span></div>
            <div class="product-price">
              <span class="price-now">${fmt(p.price)}</span>
              ${p.old ? `<span class="price-old">${fmt(p.old)}</span>` : ""}
            </div>
            <div class="product-installments">${CUOTAS}</div>
            <button class="add-btn" ${!p.stock ? "disabled" : ""} data-add="${p.id}">
              ${p.stock ? "Agregar al carrito" : "Sin stock"}
            </button>
          </div>
        </article>
      `).join("");
    }, 120);
  }
  function cat(id) { return (CATEGORIES.find(c => c.id === id) || {}).name || id; }

  // ---------- CART ----------
  const CART_KEY = "ibite_cart_v1";
  let cart = loadCart();
  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }
  function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

  function addToCart(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p || !p.stock) return;
    const line = cart.find(l => l.id === id);
    if (line) line.qty += 1;
    else cart.push({ id, qty: 1 });
    saveCart(); renderCart();
    // animación en la tarjeta y el badge
    const card = document.querySelector(`.product-card[data-id="${id}"]`);
    if (card) { card.classList.remove("bump"); void card.offsetWidth; card.classList.add("bump"); }
    const badge = $("#cartBadge");
    badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
    toast(`✓ ${p.name} agregado`);
  }
  function updateQty(id, delta) {
    const line = cart.find(l => l.id === id);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) cart = cart.filter(l => l.id !== id);
    saveCart(); renderCart();
  }
  function removeItem(id) {
    cart = cart.filter(l => l.id !== id);
    saveCart(); renderCart();
  }

  function cartTotal() {
    return cart.reduce((s, l) => {
      const p = PRODUCTS.find(x => x.id === l.id);
      return s + (p ? p.price * l.qty : 0);
    }, 0);
  }

  function renderCart() {
    const count = cart.reduce((s, l) => s + l.qty, 0);
    $("#cartBadge").textContent = count;
    const body = $("#cartItems");
    if (!cart.length) {
      body.innerHTML = `<div class="empty-cart">Tu carrito está vacío.<br/>¡Agregá algún producto!</div>`;
    } else {
      body.innerHTML = cart.map(l => {
        const p = PRODUCTS.find(x => x.id === l.id);
        return `
          <div class="cart-item">
            <div class="thumb">${p.emoji}</div>
            <div>
              <h5>${p.name}</h5>
              <small>${p.brand} · ${fmt(p.price)}</small>
              <div class="cart-qty">
                <button data-dec="${p.id}" aria-label="Restar">−</button>
                <span>${l.qty}</span>
                <button data-inc="${p.id}" aria-label="Sumar">+</button>
              </div>
            </div>
            <div style="text-align:right">
              <strong>${fmt(p.price * l.qty)}</strong>
              <div><button class="cart-remove" data-rm="${p.id}">Quitar</button></div>
            </div>
          </div>`;
      }).join("");
    }
    $("#cartTotal").textContent = fmt(cartTotal());
  }

  // ---------- DRAWER ----------
  function openCart() { $("#cartDrawer").setAttribute("aria-hidden", "false"); }
  function closeCart() { $("#cartDrawer").setAttribute("aria-hidden", "true"); }

  // ---------- CHECKOUT MODAL ----------
  function openPay() {
    if (!cart.length) { toast("Tu carrito está vacío"); return; }
    $("#payModal").setAttribute("aria-hidden", "false");
  }
  function closePay() { $("#payModal").setAttribute("aria-hidden", "true"); }

  function sendWhatsapp(method) {
    const items = cart.map(l => {
      const p = PRODUCTS.find(x => x.id === l.id);
      return `- ${p.name} x${l.qty} (${fmt(p.price * l.qty)})`;
    }).join("\n");
    const msg =
`Hola IBITE! Quiero finalizar mi compra.
Método de pago: ${method}.
Productos en carrito:
${items}
Total: ${fmt(cartTotal())}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener");
    closePay();
  }

  // ---------- MARQUEE ----------
  function renderMarquee() {
    const track = $("#marqueeTrack");
    const items = BRANDS.map(b => `
      <div class="marquee-item">
        <span aria-hidden="true">${b.logo}</span>
        <span>${b.name}</span>
      </div>`).join("");
    // Duplicar contenido para bucle infinito fluido
    track.innerHTML = items + items;
  }

  // ---------- FAQ ----------
  function renderFAQ() {
    const list = $("#faqList");
    list.innerHTML = FAQ.map((f, i) => `
      <div class="faq-item" data-i="${i}">
        <button class="faq-q" aria-expanded="false">${f.q}</button>
        <div class="faq-a"><p>${f.a}</p></div>
      </div>`).join("");
    list.addEventListener("click", e => {
      const b = e.target.closest(".faq-q");
      if (!b) return;
      const item = b.parentElement;
      const open = item.classList.toggle("open");
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // ---------- SCROLL TO TOP ----------
  function initScrollTop() {
    const btn = $("#toTop");
    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 300);
    }, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // ---------- NAV MOBILE ----------
  function initNav() {
    const toggle = $("#navToggle");
    const nav = $("#mainNav");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", e => {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---------- EVENTS ----------
  function bind() {
    // Add-to-cart delegado
    $("#productGrid").addEventListener("click", e => {
      const b = e.target.closest("[data-add]");
      if (b) addToCart(+b.dataset.add);
    });
    // Cart drawer
    $("#cartBtn").addEventListener("click", openCart);
    $("#cartClose").addEventListener("click", closeCart);
    $("#cartDrawer").addEventListener("click", e => {
      if (e.target.dataset.close !== undefined) closeCart();
      const inc = e.target.closest("[data-inc]");
      const dec = e.target.closest("[data-dec]");
      const rm  = e.target.closest("[data-rm]");
      if (inc) updateQty(+inc.dataset.inc, +1);
      if (dec) updateQty(+dec.dataset.dec, -1);
      if (rm)  removeItem(+rm.dataset.rm);
    });
    // Pay flow
    $("#payBtn").addEventListener("click", openPay);
    $("#payModal").addEventListener("click", e => {
      if (e.target.dataset.closeModal !== undefined) closePay();
      const p = e.target.closest("[data-method]");
      if (p) sendWhatsapp(p.dataset.method);
    });
    // Sort
    $("#sortSel").addEventListener("change", renderProducts);
    // Búsqueda en tiempo real (con debounce)
    let sT;
    $("#searchInput").addEventListener("input", e => {
      clearTimeout(sT);
      searchQuery = e.target.value;
      sT = setTimeout(renderProducts, 120);
    });
    // ESC cierra modales
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") { closeCart(); closePay(); }
    });
  }

  // ---------- REVEAL ON SCROLL (AOS-like) ----------
  function initReveal() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    const scan = () => document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));
    scan();
    // Re-escanea cuando cambia el catálogo
    new MutationObserver(scan).observe($("#productGrid"), { childList: true });
  }

  // ---------- INIT ----------
  document.addEventListener("DOMContentLoaded", () => {
    $("#year").textContent = new Date().getFullYear();
    renderCategories();
    renderFilters();
    renderProducts();
    renderMarquee();
    renderFAQ();
    renderCart();
    initScrollTop();
    initNav();
    bind();
    initReveal();
  });
})();
