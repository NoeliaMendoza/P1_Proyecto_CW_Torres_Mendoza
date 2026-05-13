import { define, html } from "hybrids";

define({
  tag: "sugerencias-page",

  categorias: {
    value: [],
    connect: (host) => {
      const fetchWithTimeout = (url, options, timeout = 1500) => {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('Timeout de API')), timeout);
          fetch(url, options).then(
            response => { clearTimeout(timer); resolve(response); },
            err => { clearTimeout(timer); reject(err); }
          );
        });
      };

      fetchWithTimeout("http://localhost:3000/api/productos/categorias")
        .then((r) => {
          if (!r.ok) throw new Error("Error en respuesta de API");
          return r.json();
        })
        .then((cats) => {
          if (!Array.isArray(cats)) throw new Error("La API no devolvió un arreglo");
          host.categorias = cats;
          return Promise.all(
            cats.map((cat) =>
              fetchWithTimeout(`http://localhost:3000/api/productos/categoria/${cat.slug}`)
                .then((r) => r.json())
                .then((prods) =>
                  Array.isArray(prods) ? prods.map((p) => ({
                    ...p,
                    _categoria_slug: cat.slug,
                  })) : []
                ),
            ),
          );
        })
        .then((results) => {
          const todos = results.flat();
          if (todos.length === 0) throw new Error("No hay productos en la API");
          host.productos = todos;
          host.productosFiltrados = todos;
          host.cargando = false;
        })
        .catch((err) => {
          console.error("Error cargando menú de la API:", err);
          host.cargando = false;
          host.productos = [];
          host.productosFiltrados = [];
        });
    }
  },
  productos: { value: [] },
  productosFiltrados: { value: [] },
  categoriaActiva: "todos",
  cartItems: { value: [] },
  cargando: true,



  render: (host) => {
    const {
      categorias,
      productos,
      productosFiltrados,
      categoriaActiva,
      cartItems,
      cargando,
    } = host;

    const handleFiltro = (slug) => {
      host.categoriaActiva = slug;
      host.productosFiltrados =
        slug === "todos"
          ? host.productos
          : host.productos.filter((p) => p._categoria_slug === slug);
    };

    const handleAgregar = (producto) => {
      const items = [...host.cartItems];
      const idx = items.findIndex((i) => i.id === producto.id);
      if (idx >= 0) {
        items[idx] = { ...items[idx], cantidad: items[idx].cantidad + 1 };
      } else {
        items.push({ ...producto, cantidad: 1 });
      }
      host.cartItems = items;
    };

    const handleQty = (idx, delta) => {
      const items = [...host.cartItems];
      if (items[idx].cantidad + delta <= 0) {
        items.splice(idx, 1);
      } else {
        items[idx] = { ...items[idx], cantidad: items[idx].cantidad + delta };
      }
      host.cartItems = items;
    };

    const handleRemove = (idx) => {
      const items = [...host.cartItems];
      items.splice(idx, 1);
      host.cartItems = items;
    };

    const handleConfirmar = () => {
      if (cartItems.length === 0) return;
      sessionStorage.setItem("pedido_pendiente", JSON.stringify(cartItems));
      window.location.href = "/checkout";
    };

    const subtotal = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.precio) * item.cantidad,
      0,
    );
    const total = subtotal + 0.5;

    return html`
      <style>
        :host {
          display: block;
          font-family:
            "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
          background: var(--color-leche, #faf3e8);
          min-height: 100vh;
        }

        .page-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          align-items: start;
        }

        @media (max-width: 768px) {
          .page-layout {
            grid-template-columns: 1fr;
          }
          .cart-col {
            order: -1;
          }
        }

        h1 {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-espresso, #2c1a0e);
          margin: 0 0 1rem;
        }

        .filter-wrapper {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .filter-btn {
          padding: 0.45rem 1.2rem;
          border-radius: 999px;
          border: none;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition:
            background 0.2s,
            color 0.2s,
            transform 0.15s;
          background: var(--color-crema, #e8d5b7);
          color: var(--color-canela, #7b4a2d);
        }

        .filter-btn:hover {
          background: #d9c4a0;
          transform: translateY(-1px);
        }

        .filter-btn.active {
          background: var(--color-caramelo, #c4956a);
          color: #fff;
          box-shadow: 0 2px 8px rgba(196, 149, 106, 0.35);
        }

        .productos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
          margin-top: 1rem;
        }

        .loading,
        .empty {
          text-align: center;
          padding: 3rem 0;
          font-size: 0.95rem;
          color: var(--color-canela, #7b4a2d);
        }



        .cart-col {
          position: sticky;
          top: 1.5rem;
        }

        .cart-drawer {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(44, 26, 14, 0.1);
          padding: 1.25rem;
        }

        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .cart-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-espresso, #2c1a0e);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin: 0;
        }

        .item-count {
          background: var(--color-caramelo, #c4956a);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
        }

        .empty-cart {
          color: var(--color-caramelo, #c4956a);
          font-size: 0.85rem;
          text-align: center;
          padding: 1.5rem 0;
        }

        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
          max-height: 320px;
          overflow-y: auto;
        }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .item-img {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .item-info {
          flex: 1;
          min-width: 0;
        }

        .item-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-espresso, #2c1a0e);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-price {
          font-size: 0.8rem;
          color: var(--color-canela, #7b4a2d);
        }

        .item-controls {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .qty-btn {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: 1.5px solid var(--color-crema, #e8d5b7);
          background: var(--color-leche, #faf3e8);
          color: var(--color-canela, #7b4a2d);
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          padding: 0;
          font-family: inherit;
        }

        .qty-btn:hover {
          background: var(--color-crema, #e8d5b7);
        }

        .qty-value {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-espresso, #2c1a0e);
          min-width: 16px;
          text-align: center;
        }

        .btn-remove {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-crema, #e8d5b7);
          padding: 0.2rem;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }

        .btn-remove:hover {
          color: var(--color-canela, #7b4a2d);
        }

        .divider {
          border: none;
          border-top: 1px solid var(--color-crema, #e8d5b7);
          margin: 0.75rem 0;
        }

        .totals {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 1rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--color-canela, #7b4a2d);
        }

        .total-row.grand {
          font-weight: 700;
          font-size: 1rem;
          color: var(--color-espresso, #2c1a0e);
        }

        .btn-confirmar {
          width: 100%;
          padding: 0.75rem;
          background: var(--color-caramelo, #c4956a);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition:
            background 0.2s,
            transform 0.15s;
        }

        .btn-confirmar:hover {
          background: var(--color-canela, #7b4a2d);
          transform: translateY(-1px);
        }

        .btn-confirmar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      </style>

      <div class="page-layout">
        <div class="catalog-col">
          ${!cargando ? html`
            <sugerencias-weather
              productos=${productos}
              onagregar=${(host, e) => handleAgregar(e.detail)}
            ></sugerencias-weather>
          ` : ""}


        </div>

        <div class="cart-col">
          <div class="cart-drawer">
            <div class="cart-header">
              <h2 class="cart-title">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                Tu Pedido
              </h2>
              ${cartItems.length > 0
        ? html`<span class="item-count"
                    >${cartItems.reduce((s, i) => s + i.cantidad, 0)}
                    items</span
                  >`
        : html``}
            </div>

            ${cartItems.length === 0
        ? html`<p class="empty-cart">Tu carrito está vacío</p>`
        : html`
                  <div class="cart-items-list">
                    ${cartItems.map(
          (item, idx) => html`
                        <div class="cart-item">
                          <img
                            class="item-img"
                            src="${item.imagen_url ||
            "https://placehold.co/48x48/e8d5b7/7b4a2d?text=☕"}"
                            alt="${item.nombre}"
                          />
                          <div class="item-info">
                            <div class="item-name">${item.nombre}</div>
                            <div class="item-price">
                              $${(
              parseFloat(item.precio) * item.cantidad
            ).toFixed(2)}
                            </div>
                          </div>
                          <div class="item-controls">
                            <button
                              class="qty-btn"
                              onclick=${() => handleQty(idx, -1)}
                            >
                              -
                            </button>
                            <span class="qty-value">${item.cantidad}</span>
                            <button
                              class="qty-btn"
                              onclick=${() => handleQty(idx, 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            class="btn-remove"
                            onclick=${() => handleRemove(idx)}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path
                                d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"
                              />
                            </svg>
                          </button>
                        </div>
                      `,
        )}
                  </div>

                  <hr class="divider" />

                  <div class="totals">
                    <div class="total-row">
                      <span>Subtotal</span>
                      <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                      <span>Servicio</span>
                      <span>$0.50</span>
                    </div>
                    <div class="total-row grand">
                      <span>Total</span>
                      <span>$${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button class="btn-confirmar" onclick=${handleConfirmar}>
                    Confirmar pedido
                  </button>
                `}
          </div>
        </div>
      </div>
    `;
  },
});
