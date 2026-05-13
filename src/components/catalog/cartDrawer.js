import { define, html } from 'hybrids';

define({
    tag: 'cart-drawer',

    items: () => [],
    onconfirmar: () => () => {},

    subtotal: ({ items }) =>
        items.reduce((sum, item) => sum + parseFloat(item.precio) * item.cantidad, 0),

    total: ({ subtotal }) => subtotal + 0.5,

    render: ({ items, subtotal, total, onconfirmar }) => html`
        <style>
            :host {
                display: block;
                font-family:
                    'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
                    sans-serif;
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 2px 16px rgba(44, 26, 14, 0.1);
                padding: 1.25rem;
            }

            .drawer-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 1rem;
            }

            .drawer-title {
                font-size: 1rem;
                font-weight: 700;
                color: var(--color-espresso, #2c1a0e);
                display: flex;
                align-items: center;
                gap: 0.4rem;
                margin: 0;
            }

            .drawer-title svg {
                width: 18px;
                height: 18px;
                color: var(--color-caramelo, #c4956a);
            }

            .item-count {
                background: var(--color-caramelo, #c4956a);
                color: #fff;
                font-size: 0.72rem;
                font-weight: 700;
                padding: 0.15rem 0.55rem;
                border-radius: 999px;
            }

            .empty-msg {
                color: var(--color-caramelo, #c4956a);
                font-size: 0.85rem;
                text-align: center;
                padding: 1.5rem 0;
            }

            .cart-items {
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
                line-height: 1;
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

        <div class="drawer-header">
            <h2 class="drawer-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                Tu Pedido
            </h2>
            ${items.length > 0
                ? html`<span class="item-count"
                      >${items.reduce((s, i) => s + i.cantidad, 0)} items</span
                  >`
                : html``}
        </div>

        ${items.length === 0
            ? html`<p class="empty-msg">Tu carrito está vacío</p>`
            : html`
                  <div class="cart-items">
                      ${items.map(
                          (item, idx) => html`
                              <div class="cart-item">
                                  <img
                                      class="item-img"
                                      src="${item.imagen_url ||
                                      item.imagen ||
                                      'https://placehold.co/48x48/e8d5b7/7b4a2d?text=•'}"
                                      alt="${item.nombre}"
                                  />
                                  <div class="item-info">
                                      <div class="item-name">${item.nombre}</div>
                                      <div class="item-price">
                                          $${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
                                      </div>
                                  </div>
                                  <div class="item-controls">
                                      <button
                                          class="qty-btn"
                                          onclick="${(host) => {
                                              const updated = [...host.items];
                                              if (updated[idx].cantidad > 1) {
                                                  updated[idx] = {
                                                      ...updated[idx],
                                                      cantidad: updated[idx].cantidad - 1,
                                                  };
                                              } else {
                                                  updated.splice(idx, 1);
                                              }
                                              host.items = updated;
                                          }}"
                                      >
                                          −
                                      </button>
                                      <span class="qty-value">${item.cantidad}</span>
                                      <button
                                          class="qty-btn"
                                          onclick="${(host) => {
                                              const updated = [...host.items];
                                              updated[idx] = {
                                                  ...updated[idx],
                                                  cantidad: updated[idx].cantidad + 1,
                                              };
                                              host.items = updated;
                                          }}"
                                      >
                                          +
                                      </button>
                                  </div>
                                  <button
                                      class="btn-remove"
                                      onclick="${(host) => {
                                          const updated = [...host.items];
                                          updated.splice(idx, 1);
                                          host.items = updated;
                                      }}"
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
                                          <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
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

                  <button
                      class="btn-confirmar"
                      onclick="${(host) => host.onconfirmar(host, host.items)}"
                  >
                      Confirmar pedido
                  </button>
              `}
    `,
});
